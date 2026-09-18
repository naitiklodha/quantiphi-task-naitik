import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Tone } from "@/models/Conversation";

export type AIProvider = "openai" | "claude" | "gemini";

const TONE_INSTRUCTIONS: Record<Tone, string> = {
  professional:
    "Respond in a professional, formal tone. Use clear and precise language.",
  casual:
    "Respond in a casual, friendly tone. Be conversational and relaxed.",
  concise:
    "Respond in a concise, brief tone. Get straight to the point with minimal words.",
};

function getSystemPrompt(tone: Tone): string {
  return `You are a helpful AI assistant. ${TONE_INSTRUCTIONS[tone]}`;
}

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function getClaude() {
  return new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
}

function getGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  return genAI;
}

export async function* streamChat(
  messages: { role: "user" | "assistant"; content: string }[],
  tone: Tone,
  provider: AIProvider = "gemini"
): AsyncGenerator<string, void, unknown> {
  const systemPrompt = getSystemPrompt(tone);

  switch (provider) {
    case "openai":
      yield* streamOpenAI(messages, systemPrompt);
      break;
    case "claude":
      yield* streamClaude(messages, systemPrompt);
      break;
    case "gemini":
    default:
      yield* streamGemini(messages, systemPrompt);
      break;
  }
}

async function* streamOpenAI(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string
): AsyncGenerator<string, void, unknown> {
  const openai = getOpenAI();
  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}

async function* streamClaude(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string
): AsyncGenerator<string, void, unknown> {
  const claude = getClaude();
  const stream = claude.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

async function* streamGemini(
  messages: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string
): AsyncGenerator<string, void, unknown> {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
    systemInstruction: systemPrompt,
  });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessageStream(lastMessage.content);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
