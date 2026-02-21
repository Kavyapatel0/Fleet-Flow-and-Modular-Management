const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const vehicles = await Vehicle.find({});
            res.json(vehicles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(protect, async (req, res) => {
        try {
            const vehicle = new Vehicle({
                name: req.body.name,
                licensePlate: req.body.licensePlate,
                maxLoadCapacity: req.body.maxLoadCapacity,
                odometer: req.body.odometer || 0,
                status: req.body.status || 'Available',
            });
            const createdVehicle = await vehicle.save();
            res.status(201).json(createdVehicle);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(protect, async (req, res) => {
        try {
            const vehicle = await Vehicle.findById(req.params.id);
            if (vehicle) {
                vehicle.name = req.body.name || vehicle.name;
                vehicle.licensePlate = req.body.licensePlate || vehicle.licensePlate;
                vehicle.maxLoadCapacity = req.body.maxLoadCapacity || vehicle.maxLoadCapacity;
                vehicle.odometer = req.body.odometer !== undefined ? req.body.odometer : vehicle.odometer;
                vehicle.status = req.body.status || vehicle.status;
                const updatedVehicle = await vehicle.save();
                res.json(updatedVehicle);
            } else {
                res.status(404).json({ message: 'Vehicle not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .delete(protect, async (req, res) => {
        try {
            const vehicle = await Vehicle.findById(req.params.id);
            if (vehicle) {
                await Vehicle.deleteOne({ _id: vehicle._id });
                res.json({ message: 'Vehicle removed' });
            } else {
                res.status(404).json({ message: 'Vehicle not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

module.exports = router;
