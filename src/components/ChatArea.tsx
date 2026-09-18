"use client";

import { useState, useRef, useEffect } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  const handleSend = async (message: string) => {
    if (streaming) return;

    onNewMessage({ role: "user", content: message });
    setStreaming(true);
    setStreamContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message }),
      });

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
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
                setStreamContent(`Error: ${data.error}`);
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      setStreamContent("Failed to get response. Please try again.");
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
    <main className="flex-1 flex flex-col h-full min-w-0">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-secondary">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className="flex-1" />
        <ToneToggle value={tone} onChange={handleToneChange} />
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && !streaming && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-1">
                Start a conversation
              </h2>
              <p className="text-sm text-text-secondary max-w-xs">
                Send a message to begin chatting. Your conversation will appear here.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}

          {streaming && streamContent && (
            <ChatMessage role="assistant" content={streamContent} isStreaming />
          )}

          {streaming && !streamContent && (
            <div className="flex justify-start mb-4">
              <div className="bg-bg-ai-bubble px-4 py-3 rounded-2xl rounded-bl-md shadow-[var(--shadow-sm)]">
                <div className="flex gap-1.5">
                  <span className="typing-dot w-2 h-2 bg-stone-400 rounded-full" />
                  <span className="typing-dot w-2 h-2 bg-stone-400 rounded-full" />
                  <span className="typing-dot w-2 h-2 bg-stone-400 rounded-full" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSend={handleSend} disabled={streaming} />
    </main>
  );
}
