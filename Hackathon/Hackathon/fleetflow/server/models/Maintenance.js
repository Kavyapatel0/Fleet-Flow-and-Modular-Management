const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Completed',
    },
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
