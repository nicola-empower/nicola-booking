'use client';

import { useState, useEffect } from 'react';
import { CalendarView, CalendarEvent } from '../../types/calendar';
import { getEventsByDate, getEventsByDateRange, formatDate } from '../../utils/eventManager';
import EventCard from './EventCard';

interface CalendarGridProps {
    view: CalendarView;
    currentDate: Date;
    onDateSelect: (date: string) => void;
    onTimeSelect?: (date: string, time: string) => void;
    onEventClick: (event: CalendarEvent) => void;
    selectedDate?: string;
}

export default function CalendarGrid({
    view,
    currentDate,
    onDateSelect,
    onTimeSelect,
    onEventClick,
    selectedDate
}: CalendarGridProps) {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const getWeekStart = (date: Date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    };

    const loadEvents = async () => {
        let fetchedEvents: CalendarEvent[] = [];
        if (view === 'month') {
            const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            fetchedEvents = await getEventsByDateRange(formatDate(start), formatDate(end));
        } else if (view === 'week') {
            const start = getWeekStart(currentDate);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            fetchedEvents = await getEventsByDateRange(formatDate(start), formatDate(end));
        } else {
            fetchedEvents = await getEventsByDate(formatDate(currentDate));
        }
        setEvents(fetchedEvents);
    };

    useEffect(() => {
        loadEvents();
    }, [currentDate, view]);

    if (view === 'month') {
        return <MonthView
            currentDate={currentDate}
            events={events}
            onDateSelect={onDateSelect}
            onEventClick={onEventClick}
            selectedDate={selectedDate}
        />;
    }

    if (view === 'week') {
        return <WeekView
            currentDate={currentDate}
            events={events}
            onTimeSelect={onTimeSelect}
            onEventClick={onEventClick}
        />;
    }

    return <DayView
        currentDate={currentDate}
        events={events}
        onTimeSelect={onTimeSelect}
        onEventClick={onEventClick}
    />;
}

// Month View Component
function MonthView({ currentDate, events, onDateSelect, onEventClick, selectedDate }: any) {
    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const days = getDaysInMonth();
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Week day headers */}
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                {weekDays.map(day => (
                    <div key={day} className="p-3 text-center font-semibold text-sm text-text-muted">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
                {days.map((day, index) => {
                    if (!day) {
                        return <div key={`empty-${index}`} className="min-h-[100px] border-b border-r border-slate-200 bg-slate-50/50"></div>;
                    }

                    const date = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                    const dayEvents = events.filter((e: CalendarEvent) => e.date === date);
                    const isSelected = selectedDate === date;
                    const isToday = date === formatDate(new Date());

                    return (
                        <div
                            key={day}
                            onClick={() => onDateSelect(date)}
                            className={`
                min-h-[100px] border-b border-r border-slate-200 p-2 cursor-pointer hover:bg-slate-50 transition-colors
                ${isSelected ? 'bg-teal-50 ring-2 ring-primary ring-inset' : ''}
                ${isToday ? 'bg-blue-50' : ''}
              `}
                        >
                            <div className={`
                text-sm font-semibold mb-1
                ${isToday ? 'text-blue-600' : 'text-text-main'}
              `}>
                                {day}
                            </div>
                            <div className="space-y-1">
                                {dayEvents.slice(0, 3).map((event: CalendarEvent) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        onClick={() => onEventClick(event)}
                                        compact
                                    />
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-xs text-text-muted">+{dayEvents.length - 3} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Week View Component
function WeekView({ currentDate, events, onTimeSelect, onEventClick }: any) {
    const getWeekDays = () => {
        const start = new Date(currentDate);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const weekDays = getWeekDays();
    const hours = Array.from({ length: 8 }, (_, i) => i + 10); // 10am to 6pm

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-auto">
            <div className="grid grid-cols-8 min-w-[800px]">
                {/* Time column header */}
                <div className="bg-slate-50 border-b border-r border-slate-200 p-3"></div>

                {/* Day headers */}
                {weekDays.map(day => (
                    <div key={day.toISOString()} className="bg-slate-50 border-b border-r border-slate-200 p-3 text-center">
                        <div className="font-semibold text-sm">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-xs text-text-muted">{day.getDate()}</div>
                    </div>
                ))}

                {/* Time slots */}
                {hours.map(hour => (
                    <>
                        <div key={`time-${hour}`} className="border-b border-r border-slate-200 p-2 text-xs text-text-muted bg-slate-50">
                            {hour}:00
                        </div>
                        {weekDays.map(day => {
                            const date = formatDate(day);
                            const timeEvents = events.filter((e: CalendarEvent) => {
                                const eventStart = new Date(e.startTime);
                                return e.date === date && eventStart.getHours() === hour;
                            });

                            return (
                                <div
                                    key={`${date}-${hour}`}
                                    onClick={() => onTimeSelect && onTimeSelect(date, `${hour}:00`)}
                                    className="border-b border-r border-slate-200 p-1 hover:bg-slate-50 cursor-pointer min-h-[60px]"
                                >
                                    {timeEvents.map((event: CalendarEvent) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            onClick={() => onEventClick(event)}
                                            compact
                                        />
                                    ))}
                                </div>
                            );
                        })}
                    </>
                ))}
            </div>
        </div>
    );
}

// Day View Component
function DayView({ currentDate, events, onTimeSelect, onEventClick }: any) {
    const hours = Array.from({ length: 8 }, (_, i) => i + 10); // 10am to 6pm
    const date = formatDate(currentDate);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-1">
                {hours.map(hour => {
                    const timeEvents = events.filter((e: CalendarEvent) => {
                        const eventStart = new Date(e.startTime);
                        return e.date === date && eventStart.getHours() === hour;
                    });

                    return (
                        <div key={hour} className="flex border-b border-slate-200 min-h-[80px]">
                            <div className="w-20 p-4 text-sm text-text-muted border-r border-slate-200 bg-slate-50">
                                {hour}:00
                            </div>
                            <div
                                className="flex-1 p-2 hover:bg-slate-50 cursor-pointer"
                                onClick={() => onTimeSelect && onTimeSelect(date, `${hour}:00`)}
                            >
                                <div className="grid grid-cols-1 gap-2">
                                    {timeEvents.map((event: CalendarEvent) => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            onClick={() => onEventClick(event)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
