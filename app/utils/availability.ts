// Life events schedule - mimics internal Google Calendar
export const lifeEvents: Record<string, string[]> = {
    'Mon': ['08:00', '09:00', '15:00', '16:00'], // School Drop/Pickup
    'Tue': ['14:00', '15:00'], // Physio
    'Wed': [], // Free
    'Thu': ['09:00', '10:00', '11:00', '12:00'], // Web Build Block
    'Fri': ['13:00', '14:00', '15:00', '16:00']  // Early finish / Kids
};

export const baseTimeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00'
];

export function isTimeBlocked(dayName: string, time: string): boolean {
    const blocked = lifeEvents[dayName] || [];
    return blocked.includes(time);
}

export function generateDates() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const dates = [];

    for (let i = 0; i < 5; i++) {
        const today = new Date();
        today.setDate(today.getDate() + i + 1); // Start tomorrow
        const dayIndex = today.getDay() - 1; // Convert to 0-4 (Mon-Fri)
        const dayName = days[dayIndex >= 0 && dayIndex < 5 ? dayIndex : 0];

        dates.push({
            dayName,
            dateNum: today.getDate(),
            fullDate: today.toLocaleDateString(),
        });
    }

    return dates;
}
