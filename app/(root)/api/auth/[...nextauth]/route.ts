import { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function GET(request: NextRequest, context: { params: Promise<{ nextauth: string[]; }>; }) {
    return auth(request as never, context as never);
}

export async function POST(request: NextRequest, context: { params: Promise<{ nextauth: string[]; }>; }) {
    return auth(request as never, context as never);
}