const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');

dotenv.config();

mongoose.connect(
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fleetflow'
);

const seedData = async () => {
    try {
        await User.deleteMany();
        await Vehicle.deleteMany();
        await Driver.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const users = [
            { name: 'Alice (Fleet Manager)', email: 'manager@test.com', password, role: 'Fleet Manager' },
            { name: 'Bob (Dispatcher)', email: 'dispatcher@test.com', password, role: 'Dispatcher' },
            { name: 'Charlie (Safety)', email: 'safety@test.com', password, role: 'Safety Officer' },
            { name: 'Diana (Analyst)', email: 'analyst@test.com', password, role: 'Financial Analyst' },
        ];

        await User.insertMany(users);

        const vehicles = [
            { name: 'Volvo FH16', licensePlate: 'TRK-001', maxLoadCapacity: 25000, odometer: 15000, status: 'Available' },
            { name: 'Mercedes Sprinter', licensePlate: 'VAN-002', maxLoadCapacity: 3500, odometer: 42000, status: 'On Trip' },
            { name: 'Ford Transit', licensePlate: 'VAN-003', maxLoadCapacity: 3500, odometer: 75000, status: 'In Shop' },
            { name: 'Scania R500', licensePlate: 'TRK-004', maxLoadCapacity: 30000, odometer: 3200, status: 'Available' },
        ];

        await Vehicle.insertMany(vehicles);

        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        const drivers = [
            { name: 'John Doe', licenseNumber: 'DL-1001', licenseExpiryDate: nextYear, status: 'On Duty' },
            { name: 'Jane Smith', licenseNumber: 'DL-1002', licenseExpiryDate: nextYear, status: 'On Duty' },
            { name: 'Mike Johnson', licenseNumber: 'DL-1003', licenseExpiryDate: new Date('2020-01-01'), status: 'Suspended' }, // Expired
        ];

        await Driver.insertMany(drivers);

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
