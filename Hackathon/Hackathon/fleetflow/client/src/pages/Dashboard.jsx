import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Truck, AlertTriangle, Activity, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [data, setData] = useState({
        activeFleet: 0,
        maintenanceAlerts: 0,
        utilizationRate: 0,
        pendingCargo: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKPIs = async () => {
            try {
                const res = await api.get('/reports/dashboard');
                setData(res.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchKPIs();
    }, []);

    const kpis = [
        { title: 'Active Fleet', value: data.activeFleet, subtext: 'Vehicles currently On Trip', icon: Truck, color: 'bg-blue-500', link: '/vehicles' },
        { title: 'Maintenance Alerts', value: data.maintenanceAlerts, subtext: 'Vehicles In Shop', icon: AlertTriangle, color: 'bg-rose-500', link: '/maintenance' },
        { title: 'Utilization Rate', value: `${data.utilizationRate}%`, subtext: 'Assigned / Total Vehicles', icon: Activity, color: 'bg-emerald-500', link: '/reports' },
        { title: 'Pending Cargo', value: data.pendingCargo, subtext: 'Trips in Draft status', icon: Package, color: 'bg-amber-500', link: '/trips' },
    ];

    if (loading) {
        return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => {
                    const Icon = kpi.icon;
                    return (
                        <Link key={idx} to={kpi.link} className="block group">
                            <div className="card hover:shadow-md transition-shadow h-full border-l-4" style={{ borderLeftColor: 'var(--tw-colors-blue-500)', borderLeft: 'none' }}>
                                <div className="flex items-center justify-between font-medium">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">{kpi.title}</p>
                                        <h3 className="text-3xl font-bold text-slate-800">{kpi.value}</h3>
                                    </div>
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${kpi.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-500">
                                    <span className="truncate">{kpi.subtext}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card lg:col-span-2 min-h-[400px]">
                    <h3 className="font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Recent Analytics</h3>
                    <div className="flex items-center justify-center h-[300px] text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        Chart Visualization Preview (Use view detailed reports)
                    </div>
                </div>
                <div className="card min-h-[400px]">
                    <h3 className="font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link to="/trips" className="block w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                            <div className="font-medium text-slate-800">Dispatch Trip</div>
                            <div className="text-xs text-slate-500 mt-1">Assign driver to new cargo load</div>
                        </Link>
                        <Link to="/maintenance" className="block w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition-colors">
                            <div className="font-medium text-slate-800">Log Maintenance</div>
                            <div className="text-xs text-slate-500 mt-1">Report defect or scheduled service</div>
                        </Link>
                        <Link to="/expenses" className="block w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                            <div className="font-medium text-slate-800">Add Fuel Receipt</div>
                            <div className="text-xs text-slate-500 mt-1">Log fuel & other fleet expenses</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
