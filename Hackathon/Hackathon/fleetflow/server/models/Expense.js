const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    type: {
        type: String,
        enum: ['Fuel', 'Maintenance', 'Other'],
        required: true,
    },
    liters: { type: Number }, // applicable if type is Fuel
    cost: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
