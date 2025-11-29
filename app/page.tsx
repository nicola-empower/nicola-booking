'use client';

import { useState } from 'react';
import { UserRole } from './types/booking';
import Sidebar from './components/Sidebar';
import DateTimeSelection from './components/DateTimeSelection';
import Checkout from './components/Checkout';
import SuccessMessage from './components/SuccessMessage';

export default function Home() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<UserRole>('client');

    const handleSelectDate = (date: string) => {
        setSelectedDate(date);
    };

    const handleSelectTime = (time: string) => {
        setSelectedTime(time);
        setTimeout(() => setCurrentStep(2), 400);
    };

    const handleComplete = () => {
        setCurrentStep(3);
    };

    const handleReset = () => {
        setCurrentStep(1);
        setSelectedDate(null);
        setSelectedTime(null);
    };

    const handleToggleRole = () => {
        const newRole: UserRole = userRole === 'client' ? 'admin' : 'client';
        setUserRole(newRole);
        alert(
            `Switched to ${newRole.toUpperCase()} view.\nRe-select a date to see hidden availability.`
        );
    };

    return (
        <div className="glass-bg w-full max-w-[1000px] min-h-[600px] rounded-3xl shadow-glass grid grid-cols-[350px_1fr] overflow-hidden max-[800px]:grid-cols-1">
            <div className="max-[800px]:hidden">
                <Sidebar
                    selectedService={null}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    userRole={userRole}
                    onToggleRole={handleToggleRole}
                />
            </div>

            <div className="p-10 relative">
                {currentStep === 1 && (
                    <DateTimeSelection
                        onSelectDate={handleSelectDate}
                        onSelectTime={handleSelectTime}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        userRole={userRole}
                        onBack={() => { }} // No back button on first step
                    />
                )}

                {currentStep === 2 && (
                    <Checkout
                        onComplete={handleComplete}
                        onBack={() => setCurrentStep(1)}
                    />
                )}

                {currentStep === 3 && <SuccessMessage onReset={handleReset} />}
            </div>
        </div>
    );
}
