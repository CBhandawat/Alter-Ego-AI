import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { uid: string } }
) {
    try {
        const { uid } = await params;

        const result = await db.query(
            `SELECT traits, description FROM user_personality WHERE uid = $1`,
            [uid]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "No personality found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
