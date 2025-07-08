import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, description } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: "Missing or invalid messages." },
                { status: 400 }
            );
        }
        if (!description) {
            return NextResponse.json(
                { error: "Missing alter ego description." },
                { status: 400 }
            );
        }

        const lastMsg = messages[messages.length - 1].content || "(no message)";

        const prompt = `
You are an alter ego created for this user. You are them, but you have a completely different personality as described below. Your job is to reply as their alter ego, embodying this personality fully in everything you say.

Personality description:
"${description}"

Given this situation:
"${lastMsg}"

Respond in 2-3 sentences in a confident, vivid tone. Make sure your reply clearly shows this unique personality (e.g., if you are bold, extroverted, or stand up for yourself, answer that way). Use simple language that is easy to understand.
`;


        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(prompt);

        // ✅ Log the entire response object
        console.dir(result, { depth: null });

        // Try to read the most reliable property:
        const text = result.response.text().trim();

        return NextResponse.json({ reply: text || "No response generated." });
    } catch (err: any) {
        console.error("Error in /api/chat:", err);
        return NextResponse.json(
            { error: "Server error generating alter ego response." },
            { status: 500 }
        );
    }
}
