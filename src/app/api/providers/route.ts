import { NextResponse } from "next/server";

export async function GET() {
  const providers = {
    gemini: { name: "Gemini", badge: "Free", available: !!process.env.GEMINI_API_KEY },
    openai: { name: "OpenAI", badge: "GPT-4o", available: !!process.env.OPENAI_API_KEY },
    claude: { name: "Claude", badge: "Sonnet", available: !!process.env.CLAUDE_API_KEY },
  };

  return NextResponse.json(providers);
}
