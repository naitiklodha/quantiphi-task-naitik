"use client";

import ReactMarkdown from "react-markdown";

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
          ${
            isUser
              ? "bg-user-bubble text-user-bubble-fg rounded-2xl rounded-br-md"
              : "bg-ai-bubble text-ai-bubble-fg rounded-2xl rounded-bl-md shadow-sm border border-border"
          }
        `}
      >
        {isUser ? (
          <span>{content}</span>
        ) : (
          <div className={isStreaming ? "streaming-cursor" : ""}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                code: ({ className, children }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-muted text-[13px] font-mono">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={`${className} block p-3 rounded-lg bg-muted text-[13px] font-mono overflow-x-auto mb-2`}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <pre className="mb-2">{children}</pre>,
                h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary/30 pl-3 mb-2 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:no-underline">
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                hr: () => <hr className="my-3 border-border" />,
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-2">
                    <table className="border-collapse border border-border text-xs">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
                th: ({ children }) => <th className="border border-border px-2 py-1 text-left font-medium">{children}</th>,
                td: ({ children }) => <td className="border border-border px-2 py-1">{children}</td>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
