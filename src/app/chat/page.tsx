"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./chat.css";
import { auth } from "@/lib/firebase";

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>(
        []
    );
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [traits, setTraits] = useState<any>(null);
    const [loadingDescription, setLoadingDescription] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [hasLoadedMessages, setHasLoadedMessages] = useState(false);
    const router = useRouter();
    const bottomRef = useRef<HTMLDivElement>(null);

    // Wait until mounted to prevent SSR issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Make sure Firebase auth is ready
    useEffect(() => {
        if (!isMounted) return;
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push("/login");
                return;
            }

            // Fetch personality
            try {
                const res = await fetch(`/api/personality/${user.uid}`);
                if (res.status === 404) {
                    router.push("/quiz");
                    return;
                }

                const data = await res.json();
                setDescription(data.description || "");
                setTraits(data.traits || {});

                // ✅ Load chat memory
                const stored = localStorage.getItem("alterEgoMessages");
                if (stored) {
                    console.log("Loaded messages from localStorage");
                    setMessages(JSON.parse(stored));
                }
            } catch (err) {
                console.error("Failed to fetch personality:", err);
            } finally {
                setLoadingDescription(false);
                setHasLoadedMessages(true);
            }
        });

        return () => unsubscribe();
    }, [isMounted, router]);

    // Save messages to localStorage *only after initial load*
    useEffect(() => {
        if (!hasLoadedMessages) return;
        localStorage.setItem("alterEgoMessages", JSON.stringify(messages));
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        console.log("Updated messages in localStorage:", messages);
    }, [messages, hasLoadedMessages]);

    const sendMessage = async () => {
        if (!input.trim() || !traits) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setLoading(true);
        setInput("");

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: newMessages,
                traits,
                description,
            }),
        });

        const data = await res.json();
        setMessages([...newMessages, { role: "bot", content: data.reply }]);
        setLoading(false);
    };

    if (loadingDescription || !isMounted) {
        return (
            <main className="chat-container">
                <header className="chat-header">
                    <h1>Loading your Alter Ego...</h1>
                </header>
            </main>
        );
    }

    return (
        <main className="chat-container">
            <header className="chat-header">
                <h1 className="glitch" data-text={`ALTER EGO`}>
                    ALTER EGO
                </h1>
                <p className="alter-ego-description">{description}</p>
                <button
                    onClick={() => router.push("/quiz")}
                    className="send-button"
                >
                    Update Quiz
                </button>
            </header>
            <section className="chat-messages">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`chat-bubble ${msg.role === "user" ? "user" : "bot"}`}
                    >
                        {msg.content}
                    </div>
                ))}
                {loading && (
                    <div className="chat-bubble bot">Your alter ego is thinking...</div>
                )}
                <div ref={bottomRef} />
            </section>
            <footer className="chat-input-container">
                <input
                    className="chat-input"
                    placeholder="Describe your situation..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="send-button" onClick={sendMessage}>
                    Send
                </button>
            </footer>
        </main>
    );
}
