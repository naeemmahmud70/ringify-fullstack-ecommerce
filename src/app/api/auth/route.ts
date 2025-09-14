import connectMongo from "@/lib/connect-mongo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  connectMongo();

  return NextResponse.json({ user: "check" });
}
