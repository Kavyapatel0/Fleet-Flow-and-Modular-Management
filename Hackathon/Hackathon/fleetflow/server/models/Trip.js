const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    cargoWeight: { type: Number, required: true }, // in kg
    status: {
        type: String,
        enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
        default: 'Draft',
    },
    dispatchTime: { type: Date },
    completionTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
