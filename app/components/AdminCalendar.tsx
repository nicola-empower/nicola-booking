"use client";

import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../utils/firebase";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface BookingData {
    id: string;
    slot: Timestamp;
    name: string;
    email: string;
    phone: string;
    meetingType: string;
    message: string;
}

interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: BookingData;
}

const AdminCalendar = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        const q = query(collection(db, "bookings"), orderBy("slot", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedEvents: Event[] = snapshot.docs.map((doc) => {
                const data = doc.data() as BookingData;
                const startDate = data.slot.toDate();
                return {
                    id: doc.id,
                    title: `${data.name} (${data.meetingType})`,
                    start: startDate,
                    end: addMinutes(startDate, 30), // All slots are 30 mins
                    resource: { ...data, id: doc.id },
                };
            });
            setEvents(fetchedEvents);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="h-[700px] w-full p-4 bg-white rounded-lg shadow-md flex flex-col relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Admin Schedule</h2>

            <div className="flex-grow">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                    defaultView={Views.AGENDA}
                    onSelectEvent={(event) => setSelectedEvent(event)}
                    eventPropGetter={(event) => ({
                        style: {
                            backgroundColor: "#E91E63", // Empower Pink
                            borderRadius: "4px",
                        },
                    })}
                />
            </div>

            {selectedEvent && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Client</label>
                                <p className="text-lg font-medium">{selectedEvent.resource.name}</p>
                                <p className="text-sm text-gray-600">{selectedEvent.resource.email}</p>
                                <p className="text-sm text-gray-600">{selectedEvent.resource.phone}</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Time & Type</label>
                                <p className="text-md">
                                    {format(selectedEvent.start, "PPP p")}
                                </p>
                                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                                    {selectedEvent.resource.meetingType}
                                </span>
                            </div>

                            {selectedEvent.resource.message && (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Message</label>
                                    <p className="text-sm bg-gray-50 p-3 rounded border border-gray-100 text-gray-700">
                                        {selectedEvent.resource.message}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t flex justify-end">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCalendar;
