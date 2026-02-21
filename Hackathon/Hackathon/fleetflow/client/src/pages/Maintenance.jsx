import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const Maintenance = () => {
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        vehicle: '',
        description: '',
        cost: '',
        status: 'In Progress',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [logsRes, vehiclesRes] = await Promise.all([
                api.get('/maintenance'),
                api.get('/vehicles')
            ]);
            setLogs(logsRes.data);
            // Can maintain any vehicle, but typically available ones
            setVehicles(vehiclesRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/maintenance', formData);
            setShowModal(false);
            setFormData({ vehicle: '', description: '', cost: '', status: 'In Progress' });
            fetchData();
            // Vehicle status becomes In Shop automatically on backend
        } catch (error) {
            console.error(error);
            alert('Error saving log');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Maintenance Logs</h2>
                    <p className="text-slate-500 text-sm mt-1">Track vehicle repairs and service</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary flex items-center gap-2 bg-rose-600 hover:bg-rose-700"
                >
                    <Plus className="h-4 w-4" /> Log Service
                </button>
            </div>

            <div className="card w-full overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Vehicle</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Description</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Cost ($)</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                            ) : logs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        {new Date(log.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {log.vehicle?.name} <span className="text-slate-400 font-normal text-sm">({log.vehicle?.licensePlate})</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 max-w-md truncate">{log.description}</td>
                                    <td className="px-6 py-4 text-slate-600 font-mono">${log.cost.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <StatusPill status={log.status} />
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && !loading && (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No maintenance records found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Log Maintenance</h3>
                        <div className="bg-amber-50 text-amber-800 p-3 rounded-lg mb-4 text-xs">
                            Note: Logging maintenance will automatically update the vehicle status to "In Shop" and make it unavailable for dispatch.
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
                                <select required className="input-field" value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })}>
                                    <option value="">Select a vehicle</option>
                                    {vehicles.map(v => (
                                        <option key={v._id} value={v._id}>{v.name} ({v.licensePlate})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description / Defect</label>
                                <textarea required className="input-field min-h-[100px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed issue description"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Cost ($)</label>
                                <input required type="number" className="input-field" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} placeholder="e.g. 500" />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary bg-rose-600 hover:bg-rose-700">Save Log</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Maintenance;
