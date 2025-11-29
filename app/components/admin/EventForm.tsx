'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent, EventType, EVENT_COLORS } from '../../types/calendar';
import { createEvent, updateEvent } from '../../utils/eventManager';
import { formatDate, formatTime } from '../../utils/eventManager';

interface EventFormProps {
    onClose: () => void;
    onSave: () => void;
    editEvent?: CalendarEvent | null;
    initialDate?: string;
    initialTime?: string;
}

export default function EventForm({ onClose, onSave, editEvent, initialDate, initialTime }: EventFormProps) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<EventType>('event');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('10:00');
    const [duration, setDuration] = useState(60);
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [invitees, setInvitees] = useState('');

    useEffect(() => {
        if (editEvent) {
            setTitle(editEvent.title);
            setType(editEvent.type);
            setDate(editEvent.date);
            setStartTime(formatTime(new Date(editEvent.startTime)));
            setDuration(editEvent.duration);
            setLocation(editEvent.location || '');
            setDescription(editEvent.description || '');
            setInvitees(editEvent.invitees?.join(', ') || '');
        } else {
            if (initialDate) setDate(initialDate);
            if (initialTime) setStartTime(initialTime);
        }
    }, [editEvent, initialDate, initialTime]);

    const calculateEndTime = () => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const start = new Date(date);
        start.setHours(hours, minutes, 0, 0);
        const end = new Date(start.getTime() + duration * 60000);
        return end.toISOString();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const [hours, minutes] = startTime.split(':').map(Number);
        const start = new Date(date);
        start.setHours(hours, minutes, 0, 0);

        const eventData = {
            title,
            type,
            date,
            startTime: start.toISOString(),
            endTime: calculateEndTime(),
            duration,
            location: location || undefined,
            description: description || undefined,
            invitees: invitees ? invitees.split(',').map(e => e.trim()).filter(e => e) : undefined,
            color: EVENT_COLORS[type],
        };

        if (editEvent) {
            await updateEvent(editEvent.id, eventData);
        } else {
            await createEvent(eventData);
        }

        onSave();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-text-main">
                            {editEvent ? 'Edit Event' : 'Create New Event'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-text-muted hover:text-text-main text-2xl"
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                            Event Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full py-3 px-4 border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                            placeholder="e.g., Team Meeting"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                            Event Type *
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['event', 'task', 'appointment'] as EventType[]).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`
                    py-3 px-4 rounded-xl border-2 font-medium capitalize transition-all
                    ${type === t
                                            ? 'border-current text-white'
                                            : 'border-slate-300 text-text-muted hover:border-slate-400'
                                        }
                  `}
                                    style={type === t ? { backgroundColor: EVENT_COLORS[t], borderColor: EVENT_COLORS[t] } : {}}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Date *
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full py-3 px-4 border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-2">
                                Start Time *
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full py-3 px-4 border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                            Duration (minutes) *
                        </label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full py-3 px-4 border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                        >
                            <option value={15}>15 minutes</option>
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>1 hour</option>
                            <option value={90}>1.5 hours</option>
                            <option value={120}>2 hours</option>
                            <option value={180}>3 hours</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full py-3 px-4 border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                            placeholder="e.g., Zoom, Office, Coffee Shop"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full py-3 px-4 border border-slate-300 rounded-xl focus:outline-none focus:border-primary resize-none"
                            placeholder="Add notes or details about this event..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-2">
                            Invitees (comma-separated emails)
                        </label>
                        <input
                            type="text"
                            value={invitees}
                            onChange={(e) => setInvitees(e.target.value)}
                            className="w-full py-3 px-4 border border-slate-300 rounded-xl focus:outline-none focus:border-primary"
                            placeholder="email1@example.com, email2@example.com"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 border border-slate-300 rounded-xl text-text-muted hover:bg-slate-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-primary text-white rounded-xl hover:bg-teal-700 font-medium"
                        >
                            {editEvent ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
