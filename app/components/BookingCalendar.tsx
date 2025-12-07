"use client";

import React, { useState } from "react";
import { format, addDays, startOfToday, isSameDay, addHours, isAfter } from "date-fns";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../utils/firebase";

export type BookingTheme = {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
    accentColor?: string;
    fontFamily?: string;
    headingFont?: string;
    bodyFont?: string;
    cardBackgroundColor?: string;
};

type BookingCalendarProps = {
    theme: BookingTheme;
};

// Mock slots generation (10am - 6pm, 30 min intervals)
const generateSlots = (date: Date) => {
    const slots = [];
    const startHour = 10;
    const endHour = 18;
    const current = new Date(date);
    current.setHours(startHour, 0, 0, 0);

    const now = new Date();
    const minimumBookingTime = addHours(now, 24);

    while (current.getHours() < endHour) {
        const slotTime = new Date(current);
        // Only add slot if it's more than 24 hours in the future
        if (isAfter(slotTime, minimumBookingTime)) {
            slots.push(slotTime);
        }
        current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
};

export default function BookingCalendar({ theme }: BookingCalendarProps) {
    const today = startOfToday();
    // Show 4 weeks (28 days)
    const nextDays = Array.from({ length: 28 }, (_, i) => addDays(today, i)).filter(
        (d) => d.getDay() !== 0 && d.getDay() !== 6 // Exclude Sun (0) and Sat (6)
    );

    // Default to the first available day in the list
    const [selectedDate, setSelectedDate] = useState<Date>(
        nextDays.length > 0 ? nextDays[0] : addDays(today, 1)
    );
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        meetingType: "Zoom",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // UX State
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const slots = generateSlots(selectedDate);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) return;

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "bookings"), {
                slot: Timestamp.fromDate(selectedSlot),
                ...formData,
                createdAt: Timestamp.now(),
                timezone: userTimezone,
            });
            setBookingSuccess(true);
            setShowForm(false);
        } catch (error) {
            console.error("Error booking slot: ", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div
                className="p-8 rounded-lg shadow-lg border-t-4 text-center animate-in fade-in zoom-in duration-300"
                style={{
                    borderColor: theme.primaryColor,
                    backgroundColor: theme.cardBackgroundColor || "#ffffff",
                    fontFamily: theme.bodyFont || theme.fontFamily,
                }}
            >
                <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-3xl"
                    style={{ backgroundColor: theme.primaryColor }}
                >
                    <i className="fas fa-check"></i>
                </div>
                <h2
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: theme.headingFont, color: theme.textColor }}
                >
                    Booking Confirmed!
                </h2>
                <p className="mb-6 opacity-80" style={{ color: theme.textColor }}>
                    You are booked for <strong>{selectedSlot ? format(selectedSlot, "PPpp") : ""}</strong>.
                </p>
                <button
                    onClick={() => {
                        setBookingSuccess(false);
                        setSelectedSlot(null);
                        setFormData({ name: "", email: "", phone: "", meetingType: "Zoom", message: "" });
                    }}
                    className="px-6 py-2 rounded-lg font-medium transition-transform active:scale-95"
                    style={{
                        backgroundColor: theme.borderColor,
                        color: theme.textColor,
                        opacity: 0.8,
                    }}
                >
                    Book Another
                </button>
            </div>
        );
    }

    if (showForm && selectedSlot) {
        return (
            <div
                className="p-6 rounded-lg shadow-lg border-t-4 transition-colors"
                style={{
                    borderColor: theme.primaryColor,
                    backgroundColor: theme.cardBackgroundColor || "#ffffff",
                    fontFamily: theme.bodyFont || theme.fontFamily,
                    color: theme.textColor,
                }}
            >
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => setShowForm(false)}
                        className="mr-3 opacity-70 hover:opacity-100 transition-opacity"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <h3 className="text-xl font-bold" style={{ fontFamily: theme.headingFont }}>
                        Complete Booking
                    </h3>
                </div>

                <div className="mb-6 p-4 rounded bg-gray-50 border border-gray-100">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-1">Time</p>
                    <p className="text-lg font-medium text-gray-800">{format(selectedSlot, "PPPP")}</p>
                    <p className="text-2xl font-bold text-gray-900">{format(selectedSlot, "h:mm a")}</p>
                </div>

                <form onSubmit={handleBook} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 opacity-90">Full Name</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border focus:ring-2 focus:outline-none"
                            style={{ borderColor: theme.borderColor, color: '#333' }} // Force dark text for inputs
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 opacity-90">Email Address</label>
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded border focus:ring-2 focus:outline-none"
                                style={{ borderColor: theme.borderColor, color: '#333' }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 opacity-90">Phone Number</label>
                            <input
                                required
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded border focus:ring-2 focus:outline-none"
                                style={{ borderColor: theme.borderColor, color: '#333' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 opacity-90">Meeting Preference</label>
                        <select
                            name="meetingType"
                            value={formData.meetingType}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded border focus:ring-2 focus:outline-none"
                            style={{ borderColor: theme.borderColor, color: '#333' }}
                        >
                            <option value="Zoom">Zoom Meeting</option>
                            <option value="Teams">Microsoft Teams</option>
                            <option value="Phone">Phone Call</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 opacity-90">Message (Optional)</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-2 rounded border focus:ring-2 focus:outline-none"
                            style={{ borderColor: theme.borderColor, color: '#333' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-6 mt-4 rounded-lg text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95 flex justify-center items-center"
                        style={{ backgroundColor: theme.primaryColor }}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center">
                                <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
                            </span>
                        ) : (
                            "Confirm Appointment"
                        )}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div
            className="p-6 rounded-lg shadow-lg border-t-4 transition-colors"
            style={{
                borderColor: theme.primaryColor,
                backgroundColor: theme.cardBackgroundColor || "#ffffff",
                fontFamily: theme.bodyFont || theme.fontFamily,
            }}
        >
            <h3
                className="text-xl font-semibold mb-4"
                style={{ color: theme.textColor, fontFamily: theme.headingFont }}
            >
                Select a Date
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-4">
                {nextDays.map((date) => {
                    const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => {
                                setSelectedDate(date);
                                setSelectedSlot(null);
                            }}
                            className={`flex flex-col items-center min-w-[60px] p-2 rounded-lg border transition-colors ${isSelected
                                    ? "text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                }`}
                            style={{
                                backgroundColor: isSelected ? theme.primaryColor : undefined,
                                borderColor: isSelected ? theme.primaryColor : theme.borderColor,
                                color: isSelected ? "#ffffff" : theme.textColor,
                            }}
                        >
                            <span className="text-xs font-bold uppercase">
                                {format(date, "EEE")}
                            </span>
                            <span className="text-lg font-bold">{format(date, "d")}</span>
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center justify-between mt-6 mb-4">
                <h3
                    className="text-xl font-semibold"
                    style={{ color: theme.textColor, fontFamily: theme.headingFont }}
                >
                    Available Slots
                </h3>
                <span
                    className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-500 border border-gray-200"
                    style={{ fontFamily: theme.bodyFont }}
                >
                    <i className="fas fa-globe mr-1"></i> {userTimezone}
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {slots.length > 0 ? (
                    slots.map((slot) => (
                        <button
                            key={slot.toISOString()}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-4 rounded border text-sm font-medium transition-all ${selectedSlot && slot.getTime() === selectedSlot.getTime()
                                    ? "text-white shadow-md transform scale-105"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                }`}
                            style={{
                                backgroundColor:
                                    selectedSlot && slot.getTime() === selectedSlot.getTime()
                                        ? theme.primaryColor
                                        : theme.cardBackgroundColor,
                                borderColor:
                                    selectedSlot && slot.getTime() === selectedSlot.getTime()
                                        ? theme.primaryColor
                                        : theme.borderColor,
                                color:
                                    selectedSlot && slot.getTime() === selectedSlot.getTime()
                                        ? "#ffffff"
                                        : theme.textColor,
                            }}
                        >
                            {format(slot, "h:mm a")}
                        </button>
                    ))
                ) : (
                    <div
                        className="col-span-2 md:col-span-3 py-10 text-center border-2 border-dashed rounded-lg opacity-60 flex flex-col items-center justify-center"
                        style={{ borderColor: theme.borderColor }}
                    >
                        <i className="fas fa-clock text-3xl mb-3" style={{ color: theme.primaryColor }}></i>
                        <p className="text-sm font-bold" style={{ color: theme.textColor }}>No slots available</p>
                        <p className="text-xs mt-1" style={{ color: theme.textColor }}>Please choose a future date (24h notice required).</p>
                    </div>
                )}
            </div>

            <div className="mt-8 border-t pt-6">
                <button
                    disabled={!selectedSlot}
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 px-6 rounded-lg text-white font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
                    style={{ backgroundColor: theme.primaryColor }}
                >
                    {selectedSlot
                        ? `Book ${format(selectedSlot, "h:mm a")}`
                        : "Select a time"}
                </button>
            </div>
        </div>
    );
}
