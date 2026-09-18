import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { streamChat, AIProvider } from "@/lib/ai-providers";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { conversationId, message } = await request.json();

    if (!conversationId || !message?.trim()) {
      return Response.json(
        { error: "conversationId and message are required" },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return Response.json({ error: "Conversation not found" }, { status: 404 });
    }

    conversation.messages.push({
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    });

    if (conversation.messages.length === 1) {
      conversation.title = message.trim().slice(0, 50);
    }

    const provider = (process.env.AI_PROVIDER as AIProvider) || "gemini";

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        try {
          for await (const chunk of streamChat(
            conversation.messages.map((m) => ({ role: m.role, content: m.content })),
            conversation.tone,
            provider
          )) {
            fullResponse += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk })}\n\n`));
          }

          conversation.messages.push({
            role: "assistant",
            content: fullResponse,
            timestamp: new Date(),
          });
          await conversation.save();

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Stream failed";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return Response.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
