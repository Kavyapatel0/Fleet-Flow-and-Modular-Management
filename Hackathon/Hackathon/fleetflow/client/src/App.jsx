import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Drivers from './pages/Drivers';
import Reports from './pages/Reports';

const AppLayout = ({ children, title }) => (
  <div className="flex h-screen bg-slate-50">
    <Sidebar />
    <div className="flex-1 flex flex-col ml-64 overflow-hidden">
      <Navbar title={title} />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Command Center';
      case '/vehicles': return 'Vehicle Registry';
      case '/trips': return 'Trip Dispatcher';
      case '/maintenance': return 'Maintenance Logs';
      case '/expenses': return 'Expense & Fuel Logging';
      case '/drivers': return 'Driver Performance';
      case '/reports': return 'Reports & Analytics';
      default: return 'FleetFlow';
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout title={getTitle()}><Dashboard /></AppLayout>} />
        <Route path="/vehicles" element={<AppLayout title={getTitle()}><Vehicles /></AppLayout>} />
        <Route path="/trips" element={<AppLayout title={getTitle()}><Trips /></AppLayout>} />
        <Route path="/maintenance" element={<AppLayout title={getTitle()}><Maintenance /></AppLayout>} />
        <Route path="/expenses" element={<AppLayout title={getTitle()}><Expenses /></AppLayout>} />
        <Route path="/drivers" element={<AppLayout title={getTitle()}><Drivers /></AppLayout>} />
        <Route path="/reports" element={<AppLayout title={getTitle()}><Reports /></AppLayout>} />
      </Route>
    </Routes>
  );
}

export default App;
