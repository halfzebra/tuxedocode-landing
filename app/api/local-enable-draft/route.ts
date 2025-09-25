import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // This endpoint is intended for local use only
  if (process.env.VERCEL_ENV || process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 });
  }

  (await draftMode()).enable();
  return NextResponse.json({ draft: true });
}
