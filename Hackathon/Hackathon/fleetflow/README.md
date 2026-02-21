# FleetFlow – Modular Fleet & Logistics Management System

A comprehensive web application for managing fleet logistics, dispatched trips, maintenance, drivers, and expenses.

## 🔧 Backend Setup

Inside `server` folder:

```bash
npm install
```

Create `.env` file in the `server` directory (or it will use defaults):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fleetflow
JWT_SECRET=secretkey
```

Seed the Database with dummy data (Run once):
```bash
node seed.js
```

Run Backend:
```bash
npm run dev
```

## 💻 Frontend Setup

Inside `client` folder:

```bash
npm install
npm run dev
```

App runs on:
[http://localhost:5173](http://localhost:5173)

## 📦 GITHUB INSTRUCTIONS

After project generation, follow these exact steps:

From root folder (`fleetflow`):

```bash
git init
git add .
git commit -m "Initial FleetFlow hackathon submission"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

If repo already connected:

```bash
git add .
git commit -m "Final hackathon submission"
git push
```

## Features Implemented:
- **Login & Authentication**: JWT + RBAC
- **Command Center (Dashboard)**: KPI Metrics and Real-time stats
- **Vehicle Registry**: CRUD operations + Odometer + Status tracking
- **Trip Dispatcher**: Assign drivers & vehicles, Cargo validation, Lifecycle management
- **Maintenance Logs**: Automatic "In Shop" status updates
- **Expense & Fuel Logging**: OpEx calculation
- **Driver Performance**: License expiration handling & safety metrics
- **Reports & Analytics**: ROI & Fuel Efficiency, Export to CSV/PDF
