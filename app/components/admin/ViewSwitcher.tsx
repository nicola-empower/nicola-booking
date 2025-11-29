import { CalendarView } from '../../types/calendar';

interface ViewSwitcherProps {
    currentView: CalendarView;
    onViewChange: (view: CalendarView) => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
    const views: { value: CalendarView; label: string; icon: string }[] = [
        { value: 'month', label: 'Month', icon: 'fa-calendar' },
        { value: 'week', label: 'Week', icon: 'fa-calendar-week' },
        { value: 'day', label: 'Day', icon: 'fa-calendar-day' },
    ];

    return (
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            {views.map((view) => (
                <button
                    key={view.value}
                    onClick={() => onViewChange(view.value)}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${currentView === view.value
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-muted hover:text-text-main hover:bg-white'
                        }
          `}
                >
                    <i className={`fa-solid ${view.icon}`}></i>
                    {view.label}
                </button>
            ))}
        </div>
    );
}
