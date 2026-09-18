"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`animate-fade-in flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`
          max-w-[80%] lg:max-w-[65%] px-4 py-3 text-sm leading-relaxed
          ${
            isUser
              ? "bg-bg-user-bubble text-white rounded-2xl rounded-br-md"
              : "bg-bg-ai-bubble text-text-primary rounded-2xl rounded-bl-md shadow-[var(--shadow-sm)]"
          }
        `}
      >
        <div className={isStreaming && !isUser ? "streaming-cursor" : ""}>
          {content.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < content.split("\n").length - 1 && <br />}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
