const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const drivers = await Driver.find({});
            res.json(drivers);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(protect, async (req, res) => {
        try {
            const driver = new Driver({
                name: req.body.name,
                licenseNumber: req.body.licenseNumber,
                licenseExpiryDate: req.body.licenseExpiryDate,
                status: req.body.status || 'On Duty',
            });
            const createdDriver = await driver.save();
            res.status(201).json(createdDriver);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.route('/:id')
    .put(protect, async (req, res) => {
        try {
            const driver = await Driver.findById(req.params.id);
            if (driver) {
                driver.name = req.body.name || driver.name;
                driver.licenseNumber = req.body.licenseNumber || driver.licenseNumber;
                driver.licenseExpiryDate = req.body.licenseExpiryDate || driver.licenseExpiryDate;
                driver.status = req.body.status || driver.status;
                const updatedDriver = await driver.save();
                res.json(updatedDriver);
            } else {
                res.status(404).json({ message: 'Driver not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .delete(protect, async (req, res) => {
        try {
            const driver = await Driver.findById(req.params.id);
            if (driver) {
                await Driver.deleteOne({ _id: driver._id });
                res.json({ message: 'Driver removed' });
            } else {
                res.status(404).json({ message: 'Driver not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

module.exports = router;
