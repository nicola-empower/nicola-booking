'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../utils/auth';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(username, password);
        if (success) {
            router.push('/admin');
        } else {
            setError('Invalid username or password');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-main p-5">
            <div className="glass-bg w-full max-w-md rounded-3xl shadow-glass p-10">
                <div className="text-center mb-8">
                    <div className="font-bold text-2xl text-primary mb-2 flex items-center justify-center gap-2.5">
                        <i className="fa-solid fa-bolt"></i> Empower Sync
                    </div>
                    <h1 className="text-xl text-secondary mb-2">Admin Login</h1>
                    <p className="text-sm text-text-muted">
                        Access your calendar and manage bookings
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-2 text-text-muted font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full py-3 px-4 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-primary"
                            placeholder="admin"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm mb-2 text-text-muted font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-3 px-4 border border-slate-300 rounded-xl bg-white focus:outline-none focus:border-primary"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            <i className="fa-solid fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white border-none rounded-xl font-semibold text-base cursor-pointer hover:bg-teal-700 flex justify-center items-center gap-2"
                    >
                        <i className="fa-solid fa-sign-in-alt"></i>
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-text-muted hover:text-primary"
                    >
                        <i className="fa-solid fa-arrow-left mr-1"></i>
                        Back to Client Booking
                    </a>
                </div>
            </div>
        </div>
    );
}
