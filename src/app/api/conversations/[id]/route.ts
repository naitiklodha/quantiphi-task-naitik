import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    return NextResponse.json(conversation);
  } catch {
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const conversation = await Conversation.findByIdAndDelete(id);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete conversation" }, { status: 500 });
  }
}
