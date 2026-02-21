import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};

const StatusPill = ({ status }) => {
    const styles = {
        // General
        'Available': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'On Trip': 'bg-blue-100 text-blue-800 border-blue-200',
        'In Shop': 'bg-rose-100 text-rose-800 border-rose-200',
        'Retired': 'bg-slate-100 text-slate-800 border-slate-200',

        // Trips
        'Draft': 'bg-slate-100 text-slate-800 border-slate-200',
        'Dispatched': 'bg-indigo-100 text-indigo-800 border-indigo-200',
        'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Cancelled': 'bg-red-100 text-red-800 border-red-200',

        // Drivers
        'On Duty': 'bg-emerald-100 text-emerald-800 border-emerald-200',
        'Off Duty': 'bg-slate-100 text-slate-800 border-slate-200',
        'Suspended': 'bg-red-100 text-red-800 border-red-200',

        // Maintenance
        'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
        'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    };

    const currentStyle = styles[status] || 'bg-slate-100 text-slate-800 border-slate-200';

    return (
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium border', currentStyle)}>
            {status}
        </span>
    );
};

export default StatusPill;
