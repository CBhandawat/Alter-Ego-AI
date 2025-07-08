"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
    const router = useRouter();
    const [dominant, setDominant] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("personalityAnswers");
        if (!stored) {
            router.push("/quiz");
            return;
        }
        // Dummy scoring logic (replace with real classifier)
        const answers = JSON.parse(stored);
        const sum = answers.reduce((a: number, b: number) => a + b, 0);
        if (sum % 5 === 0) setDominant("AGRY (Agreeableness)");
        else if (sum % 5 === 1) setDominant("OPEN (Openness)");
        else if (sum % 5 === 2) setDominant("NEURO (Neuroticism)");
        else if (sum % 5 === 3) setDominant("EXTRA (Extraversion)");
        else setDominant("CONS (Conscientiousness)");
    }, [router]);

    const handleContinue = () => {
        router.push("/chat");
    };

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-center max-w-lg">
                <h1 className="text-3xl font-bold mb-4">🎉 Congratulations!</h1>
                <p className="mb-6">
                    Your alter ego identity is:
                    <br />
                    <span className="text-indigo-400 text-2xl font-semibold">
                        {dominant} 😈
                    </span>
                </p>
                <button
                    onClick={handleContinue}
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded font-semibold transition"
                >
                    Enter Your Alter Ego
                </button>
            </div>
        </main>
    );
}
