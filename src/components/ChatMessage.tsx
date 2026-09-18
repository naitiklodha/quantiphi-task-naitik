"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`animate-fade-in flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
      role="article"
      aria-label={`${isUser ? "Your message" : "AI response"}`}
    >
      <div
        className={`
          max-w-[80%] lg:max-w-[70%] px-4 py-3 text-sm leading-relaxed
          focus:outline-none
          ${
            isUser
              ? "bg-user-bubble text-user-bubble-fg rounded-2xl rounded-br-md"
              : "bg-ai-bubble text-ai-bubble-fg rounded-2xl rounded-bl-md shadow-sm border border-border"
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
