import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus } from 'lucide-react';

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        vehicle: '',
        type: 'Fuel',
        liters: '',
        cost: '',
        description: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [expRes, vehRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/vehicles')
            ]);
            setExpenses(expRes.data);
            setVehicles(vehRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', formData);
            setShowModal(false);
            setFormData({ vehicle: '', type: 'Fuel', liters: '', cost: '', description: '' });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error saving expense');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Expense & Fuel Logging</h2>
                    <p className="text-slate-500 text-sm mt-1">Track fuel logs and operational expenses</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                    <Plus className="h-4 w-4" /> Add Record
                </button>
            </div>

            <div className="card w-full overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Date</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Vehicle</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Category</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Description</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm/text-right">Amount ($)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                            ) : expenses.map((exp) => (
                                <tr key={exp._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-600 text-sm">
                                        {new Date(exp.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {exp.vehicle?.name} <span className="text-slate-400 font-normal text-sm">({exp.vehicle?.licensePlate})</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium border ${exp.type === 'Fuel' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                exp.type === 'Maintenance' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                                    'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                            {exp.type} {exp.type === 'Fuel' && exp.liters ? `(${exp.liters}L)` : ''}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm">{exp.description || 'N/A'}</td>
                                    <td className="px-6 py-4 text-slate-800 font-mono font-medium">${exp.cost.toLocaleString()}</td>
                                </tr>
                            ))}
                            {expenses.length === 0 && !loading && (
                                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No expenses found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Log Expense</h3>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select required className="input-field" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="Fuel">Fuel</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                {formData.type === 'Fuel' && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Liters</label>
                                        <input required type="number" className="input-field" value={formData.liters} onChange={e => setFormData({ ...formData, liters: e.target.value })} placeholder="e.g. 50" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Total Cost ($)</label>
                                <input required type="number" className="input-field" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} placeholder="e.g. 150.50" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                                <input type="text" className="input-field" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Receipt # or notes" />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary bg-emerald-600 hover:bg-emerald-700">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
