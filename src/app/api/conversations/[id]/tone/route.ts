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
    const { tone } = await request.json();

    if (!["professional", "casual", "concise"].includes(tone)) {
      return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      id,
      { tone },
      { new: true }
    );

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch {
    return NextResponse.json({ error: "Failed to update tone" }, { status: 500 });
  }
}
