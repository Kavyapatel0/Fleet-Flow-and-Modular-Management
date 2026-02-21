import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    Map,
    Wrench,
    DollarSign,
    Users,
    BarChart3,
    LogOut
} from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { cn } from './StatusPill'; // re-using cn

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const links = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Vehicles', path: '/vehicles', icon: Truck },
        { name: 'Trips & Dispatch', path: '/trips', icon: Map },
        { name: 'Maintenance', path: '/maintenance', icon: Wrench },
        { name: 'Expenses', path: '/expenses', icon: DollarSign },
        { name: 'Drivers', path: '/drivers', icon: Users },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
    ];

    return (
        <div className="flex flex-col w-64 bg-dark text-slate-300 h-screen fixed top-0 left-0">
            <div className="flex items-center justify-center h-20 border-b border-slate-800">
                <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                    <Truck className="h-6 w-6 text-blue-500" />
                    FleetFlow
                </h1>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
                <nav className="flex flex-col gap-1 px-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/');
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 px-2 text-sm">
                    <p className="text-slate-400">Logged in as</p>
                    <p className="font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-xs text-blue-400 mt-0.5">{user?.role}</p>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
