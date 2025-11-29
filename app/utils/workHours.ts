// Work hours: 10am-6pm Mon-Fri
// Lunch break: 12pm-12:30pm daily

export const WORK_START_HOUR = 10;
export const WORK_END_HOUR = 18;
export const LUNCH_START_HOUR = 12;
export const LUNCH_START_MINUTE = 0;
export const LUNCH_END_HOUR = 12;
export const LUNCH_END_MINUTE = 30;

export const WORK_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday

export function isWithinWorkHours(date: Date): boolean {
    const day = date.getDay();
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Check if it's a work day
    if (!WORK_DAYS.includes(day)) {
        return false;
    }

    // Check if within work hours
    if (hour < WORK_START_HOUR || hour >= WORK_END_HOUR) {
        return false;
    }

    return true;
}

export function isLunchTime(date: Date): boolean {
    const hour = date.getHours();
    const minute = date.getMinutes();

    if (hour === LUNCH_START_HOUR && minute >= LUNCH_START_MINUTE && minute < LUNCH_END_MINUTE) {
        return true;
    }

    return false;
}

export function getWorkHoursForDay(date: Date): string[] {
    const slots: string[] = [];

    // Check if it's a work day
    if (!WORK_DAYS.includes(date.getDay())) {
        return slots;
    }

    // Generate hourly slots from 10am to 6pm
    for (let hour = WORK_START_HOUR; hour < WORK_END_HOUR; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return slots;
}

export function isTimeSlotAvailable(
    date: string,
    time: string,
    events: any[]
): boolean {
    // Parse the date and time
    const [hours, minutes] = time.split(':').map(Number);
    const checkDate = new Date(date);
    checkDate.setHours(hours, minutes, 0, 0);

    // Check work hours
    if (!isWithinWorkHours(checkDate)) {
        return false;
    }

    // Check lunch time
    if (isLunchTime(checkDate)) {
        return false;
    }

    // Check if there's an event at this time
    const hasEvent = events.some(event => {
        const eventStart = new Date(event.startTime);
        const eventEnd = new Date(event.endTime);
        return checkDate >= eventStart && checkDate < eventEnd;
    });

    return !hasEvent;
}

export function isSlotBookable(
    date: string,
    time: string,
    events: any[]
): boolean {
    // 1. Basic availability (work hours, lunch, events)
    if (!isTimeSlotAvailable(date, time, events)) {
        return false;
    }

    // 2. 24-hour notice rule
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (slotDate < twentyFourHoursFromNow) {
        return false;
    }

    return true;
}
