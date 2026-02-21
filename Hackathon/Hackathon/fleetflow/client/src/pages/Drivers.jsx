import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        licenseNumber: '',
        licenseExpiryDate: '',
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const res = await api.get('/drivers');
            setDrivers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/drivers', formData);
            setShowModal(false);
            setFormData({ name: '', licenseNumber: '', licenseExpiryDate: '' });
            fetchDrivers();
        } catch (error) {
            console.error(error);
            alert('Error adding driver');
        }
    };

    const isExpired = (dateStr) => {
        return new Date(dateStr) < new Date();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Driver Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Track driver performance, assignments, and licenses</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Driver
                </button>
            </div>

            <div className="card w-full overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Driver Profile</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">License / Expiry</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Trip Completion</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Safety Score</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                            ) : drivers.map((driver) => {
                                const expired = isExpired(driver.licenseExpiryDate);
                                // System auto block handled via UI and backend preventing assignments
                                return (
                                    <tr key={driver._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                                    {driver.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-slate-800">{driver.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-800 text-sm font-medium">{driver.licenseNumber}</div>
                                            <div className={`text-xs mt-1 font-medium ${expired ? 'text-rose-500' : 'text-slate-500'}`}>
                                                {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                                                {expired && ' (Expired)'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-slate-500">{driver.tripCompletionRate}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                                                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${driver.tripCompletionRate}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`text-xs font-bold ${driver.safetyScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {driver.safetyScore} / 100
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                                                <div className={`h-1.5 rounded-full ${driver.safetyScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${driver.safetyScore}%` }}></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusPill status={expired && driver.status === 'On Duty' ? 'Suspended' : driver.status} />
                                        </td>
                                    </tr>
                                );
                            })}
                            {drivers.length === 0 && !loading && (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No drivers found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Add Driver Profile</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
                                <input required type="text" className="input-field" value={formData.licenseNumber} onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })} placeholder="e.g. D-56789" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">License Expiry Date</label>
                                <input required type="date" className="input-field" value={formData.licenseExpiryDate} onChange={e => setFormData({ ...formData, licenseExpiryDate: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary bg-indigo-600 hover:bg-indigo-700">Add Driver</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Drivers;
