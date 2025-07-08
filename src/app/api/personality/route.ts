import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { uid, traits } = body;

        if (!uid || !traits) {
            return NextResponse.json(
                { error: "Missing uid or traits" },
                { status: 400 }
            );
        }

        const prompt = `
You are an alter ego generator.
Given the Big Five trait percentages, create an alter ego that is different from the user’s personality. The alter ego should have opposite or balancing traits. Output a short description in simple, clear language.

Extraversion: ${traits.EXTRAVERSION}%
Neuroticism: ${traits.NEUROTICISM}%
Agreeableness: ${traits.AGREEABLENESS}%
Conscientiousness: ${traits.CONSCIENTIOUSNESS}%
Openness: ${traits.OPENNESS}%

Instructions:

    1. Identify the main traits that are high or low.

    2. For each, imagine an opposite or complementary quality.

    3. Create a character whose personality balances or counters the user’s.

    4. Write the description in plain, easy-to-understand English.

    5. Include the alter ego’s name and a short explanation.

Example:
    INPUT:
    Traits Of User:
        Extraversion: 22%
        Neuroticism: 82%
        Agreeableness: 56%
        Conscientiousness: 82%
        Openness: 74%
    OUTPUT:
        ALTER EGO NAME: The Spontaneous Sage
        DESDRIPTION: A resilient, adventurous spirit who thrives on connection, novelty, and the thrill of the unknown.
`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const description = response.text().trim();

        await db.query(
            `
        INSERT INTO user_personality (uid, traits, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (uid) DO UPDATE SET traits = $2, description = $3
      `,
            [uid, traits, description]
        );

        return NextResponse.json({ success: true, description });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
