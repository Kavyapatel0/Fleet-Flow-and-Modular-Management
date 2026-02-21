import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Download, FileText } from 'lucide-react';

const Reports = () => {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/reports/analytics');
            setAnalytics(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        if (analytics.length === 0) return;

        const headers = ['Vehicle ID', 'Vehicle', 'License Plate', 'Fuel Efficiency (km/L)', 'ROI (%)', 'Total Maintenance Cost', 'Total Fuel Cost'];
        const rows = analytics.map(a => [
            a.vehicleId, a.name, a.licensePlate, a.fuelEfficiency, a.roi, a.totalMaintenanceCost, a.totalFuelCost
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "fleet_analytics.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        window.print(); // Simple mock for PDF export via browser print dialog
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Reports & Analytics</h2>
                    <p className="text-slate-500 text-sm mt-1">Fleet financial and operational metrics</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExportCSV} className="btn btn-secondary flex items-center gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </button>
                    <button onClick={handleExportPDF} className="btn btn-primary flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Export PDF
                    </button>
                </div>
            </div>

            <div className="card w-full overflow-hidden p-0 print:border-none print:shadow-none">
                <div className="p-6 border-b border-slate-100 print:block hidden">
                    <h1 className="text-3xl font-bold">FleetFlow Analytics Report</h1>
                    <p className="text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Vehicle Insight</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Fuel Efficiency</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Total OpEx (Fuel+Maint)</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Vehicle ROI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-8">Loading Analytics...</td></tr>
                            ) : analytics.map((a) => {
                                const totalOpex = a.totalMaintenanceCost + a.totalFuelCost;
                                return (
                                    <tr key={a.vehicleId} className="hover:bg-slate-50/50 transition-colors block print:table-row md:table-row">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{a.name}</div>
                                            <div className="text-xs text-slate-500">{a.licensePlate}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-800 font-mono font-medium">{a.fuelEfficiency} km/L</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-800 font-mono font-medium">${totalOpex.toLocaleString()}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">
                                                Fuel: ${a.totalFuelCost.toLocaleString()} | Maint: ${a.totalMaintenanceCost.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${Number(a.roi) > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                    'bg-rose-50 text-rose-700 border-rose-200'
                                                }`}>
                                                {a.roi}%
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {analytics.length === 0 && !loading && (
                                <tr><td colSpan="4" className="text-center py-8 text-slate-500">No data found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
