const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const maintenanceLogs = await Maintenance.find({}).populate('vehicle');
            res.json(maintenanceLogs);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(protect, async (req, res) => {
        try {
            const { vehicle, description, cost, status } = req.body;

            const log = new Maintenance({
                vehicle, description, cost, status
            });
            const createdLog = await log.save();

            // When maintenance is added -> Vehicle status automatically "In Shop"
            await Vehicle.findByIdAndUpdate(vehicle, { status: 'In Shop' });

            res.status(201).json(createdLog);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

module.exports = router;
