import { NextResponse } from "next/server";
import connectMongo from "../../../../lib/connect-mongo";

export async function GET(req: Request) {
  connectMongo();

  return NextResponse.json({ user: "check" });
}
