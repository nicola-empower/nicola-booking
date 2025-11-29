'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '../utils/auth';
import { CalendarView, CalendarEvent } from '../types/calendar';
import { getEventsByDate, deleteEvent, formatDate } from '../utils/eventManager';
import CalendarGrid from '../components/admin/CalendarGrid';
import ViewSwitcher from '../components/admin/ViewSwitcher';
import EventForm from '../components/admin/EventForm';
import EventCard from '../components/admin/EventCard';
import DailyNotes from '../components/admin/DailyNotes';

export default function AdminPage() {
    const router = useRouter();
    const [view, setView] = useState<CalendarView>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
    const [showEventForm, setShowEventForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [initialTime, setInitialTime] = useState<string>('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        const fetchTodayEvents = async () => {
            const events = await getEventsByDate(selectedDate);
            setTodayEvents(events);
        };
        fetchTodayEvents();
    }, [selectedDate, refreshKey]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
    };

    const handleTimeSelect = (date: string, time: string) => {
        setSelectedDate(date);
        setInitialTime(time);
        setShowEventForm(true);
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event);
        setShowEventForm(true);
        setSelectedEvent(null);
    };

    const handleDeleteEvent = async (event: CalendarEvent) => {
        if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
            await deleteEvent(event.id);
            setSelectedEvent(null);
            setRefreshKey(prev => prev + 1);
        }
    };

    const handleFormClose = () => {
        setShowEventForm(false);
        setEditingEvent(null);
        setInitialTime('');
    };

    const handleFormSave = () => {
        setRefreshKey(prev => prev + 1);
    };

    const navigateMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const navigateWeek = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
    };

    const navigateDay = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + direction);
        setCurrentDate(newDate);
        setSelectedDate(formatDate(newDate));
    };

    const handleNavigate = (direction: number) => {
        if (view === 'month') navigateMonth(direction);
        else if (view === 'week') navigateWeek(direction);
        else navigateDay(direction);
    };

    return (
        <div className="min-h-screen bg-gradient-main p-5">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="glass-bg rounded-3xl shadow-glass p-6 mb-5">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div>
                            <div className="font-bold text-2xl text-primary mb-1 flex items-center gap-2.5">
                                <i className="fa-solid fa-bolt"></i> Empower Sync
                            </div>
                            <p className="text-sm text-text-muted">Admin Dashboard</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href="/"
                                className="px-4 py-2 text-sm text-text-muted hover:text-primary flex items-center gap-2"
                            >
                                <i className="fa-solid fa-eye"></i>
                                View Client Side
                            </a>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 text-sm flex items-center gap-2"
                            >
                                <i className="fa-solid fa-sign-out-alt"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Controls */}
                <div className="glass-bg rounded-3xl shadow-glass p-6 mb-5">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleNavigate(-1)}
                                className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                            >
                                <i className="fa-solid fa-chevron-left"></i>
                            </button>

                            <h2 className="text-xl font-semibold text-text-main min-w-[200px] text-center">
                                {view === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                {view === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                {view === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </h2>

                            <button
                                onClick={() => handleNavigate(1)}
                                className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
                            >
                                <i className="fa-solid fa-chevron-right"></i>
                            </button>

                            <button
                                onClick={() => {
                                    setCurrentDate(new Date());
                                    setSelectedDate(formatDate(new Date()));
                                }}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
                            >
                                Today
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <ViewSwitcher currentView={view} onViewChange={setView} />

                            <button
                                onClick={() => setShowEventForm(true)}
                                className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-teal-700 flex items-center gap-2"
                            >
                                <i className="fa-solid fa-plus"></i>
                                Add Event
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Calendar */}
                    <div className="lg:col-span-2">
                        <CalendarGrid
                            key={refreshKey}
                            view={view}
                            currentDate={currentDate}
                            onDateSelect={handleDateSelect}
                            onTimeSelect={handleTimeSelect}
                            onEventClick={handleEventClick}
                            selectedDate={selectedDate}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* Daily Notes */}
                        <DailyNotes date={selectedDate} />

                        {/* Selected Event Details */}
                        {selectedEvent && (
                            <div className="glass-bg rounded-2xl p-4 shadow-sm">
                                <h3 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                                    <i className="fa-solid fa-info-circle text-primary"></i>
                                    Event Details
                                </h3>
                                <EventCard
                                    event={selectedEvent}
                                    onClick={() => { }}
                                    onEdit={() => handleEditEvent(selectedEvent)}
                                    onDelete={() => handleDeleteEvent(selectedEvent)}
                                />
                            </div>
                        )}

                        {/* Today's Events */}
                        <div className="glass-bg rounded-2xl p-4 shadow-sm">
                            <h3 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                                <i className="fa-solid fa-calendar-check text-primary"></i>
                                Events for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </h3>

                            {todayEvents.length === 0 ? (
                                <p className="text-sm text-text-muted text-center py-4">
                                    No events scheduled
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {todayEvents.map(event => (
                                        <EventCard
                                            key={event.id}
                                            event={event}
                                            onClick={() => handleEventClick(event)}
                                            onEdit={() => handleEditEvent(event)}
                                            onDelete={() => handleDeleteEvent(event)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Form Modal */}
            {showEventForm && (
                <EventForm
                    onClose={handleFormClose}
                    onSave={handleFormSave}
                    editEvent={editingEvent}
                    initialDate={selectedDate}
                    initialTime={initialTime}
                />
            )}
        </div>
    );
}
