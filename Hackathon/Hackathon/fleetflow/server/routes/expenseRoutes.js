const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, async (req, res) => {
        try {
            const expenses = await Expense.find({}).populate('vehicle');
            res.json(expenses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .post(protect, async (req, res) => {
        try {
            const { vehicle, type, liters, cost, description, date } = req.body;
            const expense = new Expense({
                vehicle, type, liters, cost, description, date
            });
            const createdExpense = await expense.save();
            res.status(201).json(createdExpense);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

module.exports = router;
