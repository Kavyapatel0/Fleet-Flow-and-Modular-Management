import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import StatusPill from '../components/StatusPill';

const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        licensePlate: '',
        maxLoadCapacity: '',
        status: 'Available',
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await api.get('/vehicles');
            setVehicles(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (vehicle) => {
        const newStatus = vehicle.status === 'Retired' ? 'Available' : 'Retired';
        try {
            await api.put(`/vehicles/${vehicle._id}`, { status: newStatus });
            fetchVehicles();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await api.delete(`/vehicles/${id}`);
                fetchVehicles();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', formData);
            setShowModal(false);
            setFormData({ name: '', licensePlate: '', maxLoadCapacity: '', status: 'Available' });
            fetchVehicles();
        } catch (error) {
            console.error(error);
            alert('Error saving vehicle');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Vehicle Registry</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your fleet inventory</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Vehicle
                </button>
            </div>

            <div className="card w-full overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Vehicle / Model</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">License Plate</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Max Load (kg)</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Odometer (km)</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 placeholder-hide">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                            ) : vehicles.map((v) => (
                                <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{v.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{v.licensePlate}</td>
                                    <td className="px-6 py-4 text-slate-600">{v.maxLoadCapacity.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-slate-600">{v.odometer.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <StatusPill status={v.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => handleToggleStatus(v)}
                                                className="text-xs font-medium text-slate-500 hover:text-blue-600 border border-slate-200 px-2 py-1 rounded"
                                            >
                                                {v.status === 'Retired' ? 'Reactivate' : 'Retire'}
                                            </button>
                                            <button onClick={() => handleDelete(v._id)} className="text-slate-400 hover:text-rose-600 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vehicles.length === 0 && !loading && (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-500">No vehicles found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Add New Vehicle</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
                                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Ford Transit" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">License Plate</label>
                                <input required type="text" className="input-field" value={formData.licensePlate} onChange={e => setFormData({ ...formData, licensePlate: e.target.value })} placeholder="e.g. V-1234" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Max Load Capacity (kg)</label>
                                <input required type="number" className="input-field" value={formData.maxLoadCapacity} onChange={e => setFormData({ ...formData, maxLoadCapacity: e.target.value })} placeholder="3500" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Vehicle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Vehicles;
