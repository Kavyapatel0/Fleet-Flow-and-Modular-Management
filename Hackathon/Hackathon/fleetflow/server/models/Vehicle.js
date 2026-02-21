const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true },
    maxLoadCapacity: { type: Number, required: true }, // in kg
    odometer: { type: Number, required: true, default: 0 },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
        default: 'Available',
    },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
