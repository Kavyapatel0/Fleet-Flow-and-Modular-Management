import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, CheckCircle, Navigation } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        vehicle: '',
        driver: '',
        startLocation: '',
        endLocation: '',
        cargoWeight: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
                api.get('/trips'),
                api.get('/vehicles'),
                api.get('/drivers')
            ]);
            setTrips(tripsRes.data);
            // Filter available vehicles and active drivers for the dropdown
            setVehicles(vehiclesRes.data.filter(v => v.status === 'Available'));
            setDrivers(driversRes.data.filter(d =>
                d.status === 'On Duty' && new Date(d.licenseExpiryDate) > new Date()
            ));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDispatch = async (id) => {
        try {
            await api.put(`/trips/${id}/dispatch`);
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error dispatching trip');
        }
    };

    const handleComplete = async (id) => {
        const distanceAdded = prompt('Enter distance covered (km):', '150');
        if (!distanceAdded) return;

        try {
            await api.put(`/trips/${id}/complete`, { distanceAdded });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error completing trip');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        try {
            await api.post('/trips', formData);
            setShowModal(false);
            setFormData({ vehicle: '', driver: '', startLocation: '', endLocation: '', cargoWeight: '' });
            fetchData();
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Error saving trip');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Trip Dispatcher</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage logistics and assignments</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setErrorMsg(''); }}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Create Trip
                </button>
            </div>

            <div className="card w-full overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Route</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Vehicle</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Driver</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Cargo (kg)</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                            ) : trips.map((t) => (
                                <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{t.startLocation} → {t.endLocation}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                        <span className="font-medium text-blue-600">{t.vehicle?.licensePlate}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{t.driver?.name}</td>
                                    <td className="px-6 py-4 text-slate-600 font-mono">{t.cargoWeight}</td>
                                    <td className="px-6 py-4">
                                        <StatusPill status={t.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {t.status === 'Draft' && (
                                                <button
                                                    onClick={() => handleDispatch(t._id)}
                                                    className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <Navigation className="h-4 w-4" /> Dispatch
                                                </button>
                                            )}
                                            {t.status === 'Dispatched' && (
                                                <button
                                                    onClick={() => handleComplete(t._id)}
                                                    className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <CheckCircle className="h-4 w-4" /> Complete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {trips.length === 0 && !loading && (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No trips found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Create New Trip / Draft</h3>

                        {errorMsg && (
                            <div className="bg-rose-100 text-rose-700 p-3 rounded-lg mb-4 text-sm font-medium border border-rose-200">
                                {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Location</label>
                                    <input required type="text" className="input-field" value={formData.startLocation} onChange={e => setFormData({ ...formData, startLocation: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">End Location</label>
                                    <input required type="text" className="input-field" value={formData.endLocation} onChange={e => setFormData({ ...formData, endLocation: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
                                <select required className="input-field" value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })}>
                                    <option value="">Select Available Vehicle</option>
                                    {vehicles.map(v => (
                                        <option key={v._id} value={v._id}>{v.name} ({v.licensePlate}) - Max: {v.maxLoadCapacity}kg</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Driver</label>
                                <select required className="input-field" value={formData.driver} onChange={e => setFormData({ ...formData, driver: e.target.value })}>
                                    <option value="">Select Available Driver</option>
                                    {drivers.map(d => (
                                        <option key={d._id} value={d._id}>{d.name} (License expires {new Date(d.licenseExpiryDate).toLocaleDateString()})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cargo Weight (kg)</label>
                                <input required type="number" className="input-field" value={formData.cargoWeight} onChange={e => setFormData({ ...formData, cargoWeight: e.target.value })} placeholder="e.g. 2000" />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Draft</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trips;
