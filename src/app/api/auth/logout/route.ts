import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true, message: "Logget ut." });
  res.cookies.delete("aiprogram_session");
  return res;
}
