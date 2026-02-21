import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, Mail, Lock } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 z-0"></div>

            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4">
                        <Truck className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">FleetFlow</h1>
                    <p className="text-slate-400 mt-2 text-center">Modular Fleet & Logistics Management System</p>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3 mb-6">
                        <ShieldCheck className="h-5 w-5 shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50">
                        <div className="flex items-center px-4 py-3 border-b border-slate-700 group focus-within:bg-slate-800 transition-colors">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-none text-white px-3 focus:outline-none placeholder:text-slate-500"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="flex items-center px-4 py-3 group focus-within:bg-slate-800 transition-colors">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-none text-white px-3 focus:outline-none placeholder:text-slate-500"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900" />
                            <span className="text-slate-300">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>Demo Accounts (password123)</p>
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                        <span>manager@test.com</span>
                        <span>dispatcher@test.com</span>
                        <span>safety@test.com</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
