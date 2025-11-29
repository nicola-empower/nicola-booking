import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { CalendarEvent } from '../types/calendar';

// Helper to convert Firestore data to CalendarEvent
const convertDocToEvent = (doc: any): CalendarEvent => {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        // Ensure dates are strings if stored as timestamps
        startTime: data.startTime?.toDate ? data.startTime.toDate().toISOString() : data.startTime,
        endTime: data.endTime?.toDate ? data.endTime.toDate().toISOString() : data.endTime,
    } as CalendarEvent;
};

export const createEvent = async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
    if (!db) throw new Error("Firestore not initialized");

    const docRef = await addDoc(collection(db, 'events'), {
        ...event,
        createdAt: Timestamp.now(),
    });

    return {
        id: docRef.id,
        ...event
    };
};

export const updateEvent = async (id: string, event: Partial<CalendarEvent>): Promise<void> => {
    if (!db) throw new Error("Firestore not initialized");
    const eventRef = doc(db, 'events', id);
    await updateDoc(eventRef, event);
};

export const deleteEvent = async (id: string): Promise<void> => {
    if (!db) throw new Error("Firestore not initialized");
    await deleteDoc(doc(db, 'events', id));
};

export const getEvents = async (): Promise<CalendarEvent[]> => {
    if (!db) return [];

    const querySnapshot = await getDocs(collection(db, 'events'));
    return querySnapshot.docs.map(convertDocToEvent);
};

export const getEventsByDate = async (date: string): Promise<CalendarEvent[]> => {
    if (!db) return [];

    const q = query(collection(db, 'events'), where("date", "==", date));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToEvent);
};

export const getEventsByDateRange = async (startDate: string, endDate: string): Promise<CalendarEvent[]> => {
    if (!db) return [];

    // For simplicity, we'll fetch all and filter, or use a range query if date format allows
    // Since date is YYYY-MM-DD string, we can use string comparison
    const q = query(
        collection(db, 'events'),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertDocToEvent);
};

export const saveDailyNote = async (date: string, content: string): Promise<void> => {
    if (!db) return;

    // Check if note exists
    const q = query(collection(db, 'dailyNotes'), where("date", "==", date));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const noteDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'dailyNotes', noteDoc.id), {
            content,
            updatedAt: Timestamp.now()
        });
    } else {
        await addDoc(collection(db, 'dailyNotes'), {
            date,
            content,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        });
    }
};

export const getDailyNote = async (date: string): Promise<string> => {
    if (!db) return '';

    const q = query(collection(db, 'dailyNotes'), where("date", "==", date));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().content;
    }
    return '';
};

export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};
