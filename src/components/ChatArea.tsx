"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Menu, AlertCircle } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ToneToggle from "./ToneToggle";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatAreaProps {
  conversationId: string;
  messages: Message[];
  tone: string;
  onToneChange: (tone: string) => void;
  onNewMessage: (msg: Message) => void;
  onMenuClick: () => void;
}

export default function ChatArea({
  conversationId,
  messages,
  tone,
  onToneChange,
  onNewMessage,
  onMenuClick,
}: ChatAreaProps) {
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  const handleSend = async (message: string) => {
    if (streaming) return;
    setError(null);

    onNewMessage({ role: "user", content: message });
    setStreaming(true);
    setStreamContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) {
              fullText += data.chunk;
              setStreamContent(fullText);
            }
            if (data.done) {
              onNewMessage({ role: "assistant", content: fullText });
              setStreamContent("");
            }
            if (data.error) {
              setError(data.error);
              setStreamContent("");
            }
          } catch {}
        }
      }
    } catch (err) {
      setError("Failed to get response. Check your connection and try again.");
      setStreamContent("");
    } finally {
      setStreaming(false);
    }
  };

  const handleToneChange = async (newTone: string) => {
    onToneChange(newTone);
    try {
      await fetch(`/api/conversations/${conversationId}/tone`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone: newTone }),
      });
    } catch {}
  };

  return (
    <main className="flex-1 flex flex-col h-full min-w-0 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </Button>
        <div className="flex-1" />
        <ToneToggle value={tone} onChange={handleToneChange} />
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.length === 0 && !streaming && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-primary"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                How can I help you?
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Ask anything. Your conversation will appear here.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}

          {streaming && streamContent && (
            <ChatMessage role="assistant" content={streamContent} isStreaming />
          )}

          {streaming && !streamContent && !error && (
            <div className="flex justify-start mb-3">
              <div className="bg-ai-bubble border border-border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex gap-1.5">
                  <span className="typing-dot w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                  <span className="typing-dot w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                  <span className="typing-dot w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-3 animate-fade-in"
              role="alert"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto h-6 text-destructive hover:text-destructive/80"
              >
                Dismiss
              </Button>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={streaming} />
    </main>
  );
}
