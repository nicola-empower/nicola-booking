export type EventType = 'event' | 'task' | 'appointment';
export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent {
    id: string;
    title: string;
    type: EventType;
    startTime: string; // ISO string
    endTime: string; // ISO string
    date: string; // YYYY-MM-DD
    duration: number; // minutes
    location?: string;
    description?: string;
    invitees?: string[];
    color: string;
}

export interface DailyNote {
    date: string; // YYYY-MM-DD
    content: string;
}

export const EVENT_COLORS: Record<EventType, string> = {
    event: '#3b82f6',      // Blue
    task: '#10b981',       // Green
    appointment: '#8b5cf6' // Purple
};
