import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const { provider } = await request.json();

    if (!["gemini", "openai", "claude"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    // Check if the required API key is set
    if (provider === "openai" && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local" },
        { status: 400 }
      );
    }
    if (provider === "claude" && !process.env.CLAUDE_API_KEY) {
      return NextResponse.json(
        { error: "Claude API key not configured. Add CLAUDE_API_KEY to .env.local" },
        { status: 400 }
      );
    }
    if (provider === "gemini" && !process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Add GEMINI_API_KEY to .env.local" },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { provider },
      { new: true }
    );

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch {
    return NextResponse.json({ error: "Failed to update provider" }, { status: 500 });
  }
}
