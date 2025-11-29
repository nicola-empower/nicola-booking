'use client';

import { useState, useEffect } from 'react';
import { getDailyNote, saveDailyNote } from '../../utils/eventManager';

interface DailyNotesProps {
    date: string;
}

export default function DailyNotes({ date }: DailyNotesProps) {
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadNote = async () => {
            const noteContent = await getDailyNote(date);
            setNote(noteContent);
        };
        loadNote();
    }, [date]);

    const handleSave = async () => {
        setIsSaving(true);
        await saveDailyNote(date, note);
        setTimeout(() => setIsSaving(false), 500);
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-text-main flex items-center gap-2">
                    <i className="fa-solid fa-note-sticky text-amber-500"></i>
                    Daily Notes
                </h3>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="text-sm px-3 py-1 bg-primary text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <i className="fa-solid fa-circle-notch fa-spin mr-1"></i>
                            Saving...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-save mr-1"></i>
                            Save
                        </>
                    )}
                </button>
            </div>

            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes for this day..."
                className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:border-primary"
                rows={4}
            />
        </div>
    );
}
