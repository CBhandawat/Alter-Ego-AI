"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import "@/app/chat/chat.css"; // Imports glitch + chat-container styles

export default function LoginPage() {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            if (isSignup) {
                // Create new user
                await createUserWithEmailAndPassword(auth, email, password);
                router.push("/quiz");
            } else {
                // Login existing user
                const cred = await signInWithEmailAndPassword(auth, email, password);
                const uid = cred.user.uid;

                // Check if personality already exists
                const res = await fetch(`/api/personality/${uid}`);
                if (res.status === 200) {
                    router.push("/chat");
                } else {
                    router.push("/quiz");
                }
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main className="chat-container">
            <header className="chat-header">
                <h1 className="glitch" data-text="ALTER EGO">
                    ALTER EGO
                </h1>
                <p className="alter-ego-description">Unlock your hidden persona</p>
            </header>

            <div className="flex flex-col items-center justify-center flex-grow p-4">
                <form
                    onSubmit={handleSubmit}
                    className="relative bg-gray-950 bg-opacity-90 backdrop-blur-sm border border-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6 animate-fadeIn"
                >
                    {error && (
                        <p className="text-red-500 bg-red-900 bg-opacity-30 p-2 rounded text-sm text-center">
                            {error}
                        </p>
                    )}

                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 transition duration-200"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 transition duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded bg-emerald-600 hover:bg-emerald-700 font-semibold transition duration-200 shadow-md hover:shadow-emerald-500/40"
                    >
                        {isSignup ? "Create Your Alter Ego" : "Login to Alter Ego"}
                    </button>

                    <p
                        className="mt-2 text-center text-sm text-gray-400 cursor-pointer hover:text-emerald-400 transition"
                        onClick={() => setIsSignup(!isSignup)}
                    >
                        {isSignup
                            ? "Already have an account? Log in"
                            : "Don’t have an account? Sign up"}
                    </p>

                    <div className="absolute inset-0 rounded-2xl pointer-events-none border border-emerald-500 opacity-10"></div>
                </form>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
            `}</style>
        </main>
    );
}
