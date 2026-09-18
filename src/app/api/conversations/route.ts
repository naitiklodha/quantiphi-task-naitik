import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET() {
  try {
    await dbConnect();
    const conversations = await Conversation.find({})
      .select("title tone createdAt updatedAt")
      .sort({ updatedAt: -1 });
    return NextResponse.json(conversations);
  } catch {
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { title } = await request.json();
    const conversation = await Conversation.create({
      title: title || "New Chat",
    });
    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("POST /api/conversations error:", error);
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 });
  }
}
