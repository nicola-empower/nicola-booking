import { UserRole } from '../types/booking';

interface TimeSlotProps {
    time: string;
    isBlocked: boolean;
    isSelected: boolean;
    userRole: UserRole;
    onClick: () => void;
}

export default function TimeSlot({ time, isBlocked, isSelected, userRole, onClick }: TimeSlotProps) {
    if (isBlocked) {
        return (
            <div
                className={`
          py-3 px-3 border rounded-lg text-center text-sm
          opacity-40 pointer-events-none line-through
          ${userRole === 'admin' ? 'bg-red-50' : 'bg-slate-100'}
        `}
                title="Unavailable (Life/Work Conflict)"
            >
                {time} {userRole === 'admin' && '(Busy)'}
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={`
        py-3 px-3 border rounded-lg cursor-pointer text-center text-sm
        ${isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-slate-200 hover:border-primary'
                }
      `}
        >
            {time}
        </div>
    );
}
