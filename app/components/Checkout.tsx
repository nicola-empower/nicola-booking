'use client';

import { useState } from 'react';

interface CheckoutProps {
    onComplete: () => void;
    onBack: () => void;
}

export default function Checkout({ onComplete, onBack }: CheckoutProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = () => {
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            onComplete();
        }, 1500);
    };

    return (
        <div className="animate-fadeIn">
            <button
                onClick={onBack}
                className="bg-transparent border-none text-text-muted cursor-pointer mb-5 flex items-center gap-1 hover:text-text-main"
            >
                <i className="fa-solid fa-arrow-left"></i> Back
            </button>

            <h2 className="text-2xl mb-6 text-secondary">
                Confirm Booking
            </h2>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="mb-4">
                    <label className="block text-xs mb-2 text-text-muted font-medium">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        className={`w-full py-3 px-3 border rounded-lg bg-white ${error ? 'border-red-500' : 'border-slate-300'}`}
                        placeholder="you@example.com"
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <p className="text-xs text-text-muted mt-4">
                    <i className="fa-solid fa-info-circle mr-1"></i>
                    You will receive a confirmation email with your booking details.
                </p>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full py-4 bg-primary text-white border-none rounded-xl font-semibold text-base cursor-pointer mt-5 flex justify-center items-center gap-2.5 hover:bg-teal-700 disabled:opacity-70"
            >
                {isProcessing ? (
                    <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i> Processing...
                    </>
                ) : (
                    'Confirm Booking'
                )}
            </button>
        </div>
    );
}
