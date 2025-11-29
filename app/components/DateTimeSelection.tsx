'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '../types/booking';
import { getEventsByDate } from '../utils/eventManager';
import { getWorkHoursForDay, isTimeSlotAvailable, isSlotBookable } from '../utils/workHours';
import { formatDate } from '../utils/eventManager';
import DateCard from './DateCard';
import TimeSlot from './TimeSlot';

interface DateTimeSelectionProps {
    onSelectDate: (date: string, dayName: string) => void;
    onSelectTime: (time: string) => void;
    selectedDate: string | null;
    selectedTime: string | null;
    userRole: UserRole;
    onBack: () => void;
}

interface DateInfo {
    dayName: string;
    dayNumber: number;
    fullDate: string;
    date: Date;
    events: any[];
}

export default function DateTimeSelection({
    onSelectDate,
    onSelectTime,
    selectedDate,
    selectedTime,
    userRole,
    onBack,
}: DateTimeSelectionProps) {
    const [availableDates, setAvailableDates] = useState<DateInfo[]>([]);

    useEffect(() => {
        const generateDates = async () => {
            const datesList: DateInfo[] = [];
            const today = new Date();

            // Generate next 28 days (4 weeks)
            for (let i = 0; i < 28; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);

                // Skip weekends
                if (date.getDay() === 0 || date.getDay() === 6) continue;

                const dateStr = formatDate(date);
                const dayEvents = await getEventsByDate(dateStr);

                datesList.push({
                    date: date,
                    dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    dayNumber: date.getDate(),
                    fullDate: dateStr,
                    events: dayEvents
                });
            }

            setAvailableDates(datesList);

            // Select first date by default if not selected
            if (!selectedDate && datesList.length > 0) {
                onSelectDate(datesList[0].fullDate, datesList[0].dayName);
            }
        };

        generateDates();
    }, []); // Run once on mount

    const handleDateSelect = (dayName: string, fullDate: string) => {
        onSelectDate(fullDate, dayName);
    };

    const getTimeSlots = () => {
        if (!selectedDate) return [];

        const checkDate = new Date(selectedDate);
        return getWorkHoursForDay(checkDate);
    };

    const timeSlots = getTimeSlots();

    // Find events for the selected date
    const selectedDateEvents = availableDates.find(d => d.fullDate === selectedDate)?.events || [];

    return (
        <div className="animate-fadeIn">
            <button
                onClick={onBack}
                className="bg-transparent border-none text-text-muted cursor-pointer mb-5 flex items-center gap-1 hover:text-text-main"
            >
                <i className="fa-solid fa-arrow-left"></i> Back
            </button>

            <h2 className="text-2xl mb-6 text-secondary">Select Date & Time</h2>

            <div className="flex gap-2.5 mb-6 overflow-x-auto pb-1">
                {availableDates.map((date, index) => (
                    <DateCard
                        key={index}
                        dayName={date.dayName}
                        dateNum={date.dayNumber}
                        isActive={selectedDate === date.fullDate}
                        onClick={() => handleDateSelect(date.dayName, date.fullDate)}
                    />
                ))}
            </div>

            {selectedDate && (
                <>
                    <h3 className="text-sm mb-2.5 text-text-muted">Available Slots</h3>
                    <div className="grid grid-cols-3 gap-2.5">
                        {timeSlots.map((time) => {
                            // Use isSlotBookable to enforce 24h notice and other rules
                            const isAvailable = isSlotBookable(selectedDate, time, selectedDateEvents);
                            const blocked = !isAvailable;

                            return (
                                <TimeSlot
                                    key={time}
                                    time={time}
                                    isBlocked={blocked}
                                    isSelected={selectedTime === time}
                                    userRole={userRole}
                                    onClick={() => !blocked && onSelectTime(time)}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
