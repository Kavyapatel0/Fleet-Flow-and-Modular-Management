const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Maintenance = require('../models/Maintenance');
const Expense = require('../models/Expense');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});
        const trips = await Trip.find({});

        const totalVehicles = vehicles.length;
        const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length;
        const inShopVehicles = vehicles.filter(v => v.status === 'In Shop').length;
        const utilizationRate = totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0;
        const pendingCargo = trips.filter(t => t.status === 'Draft').length;

        res.json({
            activeFleet: activeVehicles,
            maintenanceAlerts: inShopVehicles,
            utilizationRate: utilizationRate.toFixed(2),
            pendingCargo,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/analytics', protect, async (req, res) => {
    try {
        const vehicles = await Vehicle.find({});

        // Calculate fuel efficiency and ROI for each vehicle
        const analytics = await Promise.all(vehicles.map(async (v) => {
            // Find expenses for this vehicle
            const expenses = await Expense.find({ vehicle: v._id });
            const maintenanceLogs = await Maintenance.find({ vehicle: v._id });

            let totalFuelLiters = 0;
            let totalFuelCost = 0;
            expenses.forEach(e => {
                if (e.type === 'Fuel') {
                    totalFuelLiters += (e.liters || 0);
                    totalFuelCost += e.cost;
                }
            });

            let totalMaintenanceCost = 0;
            maintenanceLogs.forEach(m => totalMaintenanceCost += m.cost);

            const fuelEfficiency = totalFuelLiters > 0 ? (v.odometer / totalFuelLiters).toFixed(2) : 0;

            // Mock metrics for ROI if not in schema
            const acquisitionCost = 50000;
            const mockRevenue = v.odometer * 2; // say $2 per km

            const roi = ((mockRevenue - (totalMaintenanceCost + totalFuelCost)) / acquisitionCost * 100).toFixed(2);

            return {
                vehicleId: v._id,
                name: v.name,
                licensePlate: v.licensePlate,
                fuelEfficiency,
                roi,
                totalMaintenanceCost,
                totalFuelCost
            };
        }));

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
