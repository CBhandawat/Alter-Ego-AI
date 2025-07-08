"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { questions } from "@/data/questions";
import Lottie from "lottie-react";


export default function QuizPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
    const [error, setError] = useState("");
    const [fade, setFade] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleAnswer = (value: number) => {
        setError("");
        const updated = [...answers];
        updated[currentQuestion] = value;
        setAnswers(updated);
    };

    const handleNext = () => {
        if (answers[currentQuestion] === 0) {
            setError("Please answer this question before continuing.");
            return;
        }
        setError("");
        setFade(false);
        setTimeout(() => {
            setCurrentQuestion((prev) => prev + 1);
            setFade(true);
        }, 200);
    };

    const handleSubmit = async () => {
        if (answers.includes(0)) {
            alert("Please answer all questions before submitting.");
            return;
        }

        setSubmitting(true);

        const sums: Record<string, number> = {};
        const counts: Record<string, number> = {};

        questions.forEach((q, i) => {
            if (!sums[q.trait]) {
                sums[q.trait] = 0;
                counts[q.trait] = 0;
            }
            const raw = answers[i];
            const score = q.reverse ? 6 - raw : raw;
            sums[q.trait] += score;
            counts[q.trait] += 1;
        });

        const traits: Record<string, number> = {};
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in.");
            return;
        }
        const uid = user.uid;
        Object.keys(sums).forEach((trait) => {
            const maxScore = counts[trait] * 5;
            const pct = Math.round((sums[trait] / maxScore) * 100);
            traits[trait] = pct;
        });

        try {
            const res = await fetch("/api/personality", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ uid, traits }),
            });

            if (res.ok) {
                // Show welcome modal
                setShowWelcome(true);
            } else {
                const errorData = await res.json();
                console.error("API error:", errorData);
                alert("Error saving your personality. Please try again.");
            }
        } catch (err) {
            console.error("Network error:", err);
            alert("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <main className="chat-container relative">
            <header className="chat-header">
                <h1 className="glitch" data-text="ALTER EGO">
                    ALTER EGO
                </h1>
                <p className="alter-ego-description">
                    Answer these questions honestly to discover your hidden persona.
                </p>
            </header>

            {submitting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50">
                    <h2 className="glitch text-2xl mb-4" data-text="Loading your Alter Ego...">
                        Loading your Alter Ego...
                    </h2>
                    <div className="flex gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-3 w-5 rounded bg-emerald-500"
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: "1s",
                                    animationIterationCount: "infinite",
                                    animationName: "pulseBox"
                                }}
                            />
                        ))}
                    </div>
                    <style jsx>{`
      @keyframes pulseBox {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
      }
    `}</style>
                </div>
            )}


            {showWelcome && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 z-50">
                    <Lottie
                        animationData={require("@/lottie/alter_ego.json")}
                        loop
                        style={{ height: "200px", width: "200px" }}
                    />
                    <h2
                        className="glitch text-2xl mt-4"
                        data-text="Welcome to Your Alter Ego"
                    >
                        Welcome to Your Alter Ego
                    </h2>
                    <button
                        onClick={() => router.push("/chat")}
                        className="mt-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded font-semibold transition"
                    >
                        Continue
                    </button>
                </div>
            )}

            <section className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
                <div className="w-full max-w-4xl bg-gray-900 rounded-xl p-8 shadow-lg">
                    <div className="mb-4">
                        <div className="text-sm mb-2">
                            Progress: {currentQuestion + 1} / {questions.length}
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <div
                        className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-center">
                            {questions[currentQuestion].text}
                        </h2>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    onClick={() => handleAnswer(value)}
                                    className={`py-3 rounded text-lg transition ${answers[currentQuestion] === value
                                        ? "bg-emerald-600"
                                        : "bg-gray-800 hover:bg-gray-700"
                                        }`}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>
                        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    </div>
                    {currentQuestion < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded font-semibold transition"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded font-semibold transition"
                        >
                            Submit
                        </button>
                    )}
                    <p className="text-xs text-gray-500 mt-6 text-center">
                        <strong>Scale (1–5):</strong> 1 - Strongly Disagree, 5 - Strongly Agree
                    </p>
                </div>
            </section>
        </main>
    );
}
