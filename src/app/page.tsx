"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import ConversationSidebar from "@/components/ConversationSidebar";
import ChatArea from "@/components/ChatArea";

interface Conversation {
  _id: string;
  title: string;
  tone: string;
  updatedAt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tone, setTone] = useState("professional");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const loadConversation = async (id: string) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      const data = await res.json();
      setActiveId(id);
      setMessages(data.messages || []);
      setTone(data.tone || "professional");
      setSidebarOpen(false);
    } catch {}
  };

  const handleNewChat = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      });
      const data = await res.json();
      await fetchConversations();
      setActiveId(data._id);
      setMessages([]);
      setTone(data.tone);
      setSidebarOpen(false);
    } catch {}
  };

  const handleNewMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
    if (msg.role === "user") {
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeId
            ? { ...c, title: msg.content.slice(0, 50), updatedAt: new Date().toISOString() }
            : c
        )
      );
    }
  };

  const handleToneChange = (newTone: string) => {
    setTone(newTone);
    setConversations((prev) =>
      prev.map((c) => (c._id === activeId ? { ...c, tone: newTone } : c))
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={loadConversation}
        onNew={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {activeId ? (
        <ChatArea
          key={activeId}
          conversationId={activeId}
          messages={messages}
          tone={tone}
          onToneChange={handleToneChange}
          onNewMessage={handleNewMessage}
          onMenuClick={() => setSidebarOpen(true)}
        />
      ) : (
        <main className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <MessageSquarePlus size={28} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground mb-1">
                Start a conversation
              </h1>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Begin a new chat to get help from the AI assistant.
              </p>
            </div>
            <Button onClick={handleNewChat} className="gap-2">
              <MessageSquarePlus size={16} />
              New Chat
            </Button>
          </div>
        </main>
      )}
    </div>
  );
}
