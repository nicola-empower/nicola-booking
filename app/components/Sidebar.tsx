import { Service } from '../types/booking';

interface SidebarProps {
    selectedService: Service | null;
    selectedDate: string | null;
    selectedTime: string | null;
    userRole: 'client' | 'admin';
    onToggleRole: () => void;
}

export default function Sidebar({
    selectedService,
    selectedDate,
    selectedTime,
    userRole,
    onToggleRole
}: SidebarProps) {
    return (
        <div className="bg-slate-50 py-10 px-8 border-r border-black/5 flex flex-col">
            <div className="font-bold text-xl text-primary mb-8 flex items-center gap-2.5">
                <i className="fa-solid fa-bolt"></i> Empower Sync
            </div>

            <div className="profile-area">
                <h1 className="text-2xl mb-2.5 text-secondary">Book Nicola</h1>
                <p className="text-sm text-text-muted leading-relaxed mb-8">
                    Select a date and time to schedule a session. My calendar automatically syncs with my work & family
                    schedule to show you true availability.
                </p>
            </div>

            <div className="mt-auto bg-white p-5 rounded-2xl border border-slate-200 animate-slideUp">
                <h3 className="text-sm font-semibold text-secondary mb-4 border-b border-slate-100 pb-2">Booking Summary</h3>
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-text-muted">Date</span>
                    <span className="font-medium text-secondary">{selectedDate || '--'}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Time</span>
                    <span className="font-medium text-secondary">{selectedTime || '--'}</span>
                </div>
            </div>

            <div
                className="absolute bottom-5 left-5 opacity-30 text-xs cursor-pointer hover:opacity-100"
                onClick={onToggleRole}
            >
                Current View: <strong>{userRole === 'client' ? 'Client' : 'Admin'}</strong>
            </div>
        </div>
    );
}
