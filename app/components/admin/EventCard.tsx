import { CalendarEvent } from '../../types/calendar';

interface EventCardProps {
    event: CalendarEvent;
    onClick: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    compact?: boolean;
}

export default function EventCard({ event, onClick, onEdit, onDelete, compact = false }: EventCardProps) {
    const startTime = new Date(event.startTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const endTime = new Date(event.endTime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const getTypeIcon = () => {
        switch (event.type) {
            case 'event': return 'fa-calendar';
            case 'task': return 'fa-check-circle';
            case 'appointment': return 'fa-user-clock';
        }
    };

    if (compact) {
        return (
            <div
                onClick={onClick}
                className="text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 truncate"
                style={{ backgroundColor: event.color, color: 'white' }}
                title={`${event.title} (${startTime} - ${endTime})`}
            >
                <i className={`fa-solid ${getTypeIcon()} mr-1`}></i>
                {event.title}
            </div>
        );
    }

    return (
        <div
            className="bg-white border-l-4 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-3"
            style={{ borderLeftColor: event.color }}
            onClick={onClick}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <i className={`fa-solid ${getTypeIcon()}`} style={{ color: event.color }}></i>
                    <h3 className="font-semibold text-text-main">{event.title}</h3>
                </div>
                {(onEdit || onDelete) && (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                                title="Edit"
                            >
                                <i className="fa-solid fa-edit"></i>
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                className="text-red-600 hover:text-red-800 text-sm"
                                title="Delete"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="text-sm text-text-muted space-y-1">
                <div className="flex items-center gap-2">
                    <i className="fa-solid fa-clock w-4"></i>
                    <span>{startTime} - {endTime} ({event.duration} min)</span>
                </div>

                {event.location && (
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-location-dot w-4"></i>
                        <span>{event.location}</span>
                    </div>
                )}

                {event.description && (
                    <div className="flex items-start gap-2 mt-2">
                        <i className="fa-solid fa-align-left w-4 mt-0.5"></i>
                        <span className="text-xs">{event.description}</span>
                    </div>
                )}

                {event.invitees && event.invitees.length > 0 && (
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-users w-4"></i>
                        <span className="text-xs">{event.invitees.join(', ')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
