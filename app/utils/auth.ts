import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

export async function login(username: string, password: string): Promise<boolean> {
    try {
        // For now, we assume the username is an email. If it's just 'admin', we can append a domain or handle it.
        // Since the user provided 'admin' previously, let's assume they will use an email for Firebase.
        // Or we can map 'admin' to a specific email if needed, but better to expect email.
        // However, to keep it simple for the user who might still try 'admin', let's check.

        const email = username.includes('@') ? username : `${username}@empower.com`;

        if (auth) {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Login error:", error);
        return false;
    }
}

export async function logout(): Promise<void> {
    if (auth) {
        await signOut(auth);
    }
}

export function isAuthenticated(): boolean {
    // This is a synchronous check which might not be accurate for Firebase as it's async.
    // However, for the immediate UI check it might suffice if we subscribe to state changes.
    // But a better approach for Next.js is to use a context or hook. 
    // For now, let's return true if there is a current user, but this is tricky.
    // We'll rely on the component state listener mostly.
    if (auth?.currentUser) return true;
    return false;
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
    if (auth) {
        return onAuthStateChanged(auth, callback);
    }
    return () => { };
}
