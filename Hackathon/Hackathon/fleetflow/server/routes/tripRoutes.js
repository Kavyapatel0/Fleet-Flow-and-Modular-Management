const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const trips = await Trip.find({}).populate('vehicle').populate('driver');
            res.json(trips);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(protect, async (req, res) => {
        try {
            const { vehicle, driver, startLocation, endLocation, cargoWeight } = req.body;

            const v = await Vehicle.findById(vehicle);
            if (!v) return res.status(404).json({ message: 'Vehicle not found' });

            const d = await Driver.findById(driver);
            if (!d) return res.status(404).json({ message: 'Driver not found' });

            // Validation Rules
            if (cargoWeight > v.maxLoadCapacity) {
                return res.status(400).json({ message: 'Cargo weight exceeds vehicle capacity' });
            }

            if (d.licenseExpiryDate < new Date()) {
                return res.status(400).json({ message: 'Driver license is expired' });
            }

            const trip = new Trip({
                vehicle, driver, startLocation, endLocation, cargoWeight, status: 'Draft'
            });
            const createdTrip = await trip.save();
            res.status(201).json(createdTrip);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route('/:id/dispatch')
    .put(protect, async (req, res) => {
        try {
            const trip = await Trip.findById(req.params.id);
            if (!trip) return res.status(404).json({ message: 'Trip not found' });

            if (trip.status !== 'Draft') {
                return res.status(400).json({ message: 'Only Draft trips can be dispatched' });
            }

            trip.status = 'Dispatched';
            trip.dispatchTime = new Date();
            await trip.save();

            // Update Vehicle and Driver status
            await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'On Trip' });
            await Driver.findByIdAndUpdate(trip.driver, { status: 'On Duty' }); // Could be 'On Trip', requirement says 'On Duty'

            res.json(trip);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route('/:id/complete')
    .put(protect, async (req, res) => {
        try {
            const { distanceAdded } = req.body; // To update odometer
            const trip = await Trip.findById(req.params.id);
            if (!trip) return res.status(404).json({ message: 'Trip not found' });

            trip.status = 'Completed';
            trip.completionTime = new Date();
            await trip.save();

            // Update Vehicle and Driver
            const vehicle = await Vehicle.findById(trip.vehicle);
            if (vehicle) {
                vehicle.status = 'Available';
                vehicle.odometer += Number(distanceAdded || 0);
                await vehicle.save();
            }

            await Driver.findByIdAndUpdate(trip.driver, { status: 'On Duty' });

            res.json(trip);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

module.exports = router;
