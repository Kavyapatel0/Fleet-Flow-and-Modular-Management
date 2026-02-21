import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Navbar = ({ title }) => {
    const { user } = useContext(AuthContext);

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-slate-800">{title || 'Dashboard'}</h2>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 text-sm bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500 w-64 outline-none transition-all"
                    />
                </div>

                <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border-2 border-white"></span>
                </button>

                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm ring-2 ring-white">
                    {user?.name?.charAt(0) || 'U'}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
