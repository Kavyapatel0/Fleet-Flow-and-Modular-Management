const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    licenseExpiryDate: { type: Date, required: true },
    status: {
        type: String,
        enum: ['On Duty', 'Off Duty', 'Suspended'],
        default: 'On Duty',
    },
    tripCompletionRate: { type: Number, default: 100 }, // Percentage
    safetyScore: { type: Number, default: 100 }, // Out of 100
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
