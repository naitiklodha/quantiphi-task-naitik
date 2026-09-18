"use client";

import { useState, useEffect, useCallback } from "react";
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
    const res = await fetch("/api/conversations");
    const data = await res.json();
    setConversations(data);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const loadConversation = async (id: string) => {
    const res = await fetch(`/api/conversations/${id}`);
    const data = await res.json();
    setActiveId(id);
    setMessages(data.messages || []);
    setTone(data.tone || "professional");
    setSidebarOpen(false);
  };

  const handleNewChat = async () => {
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
    <div className="flex h-screen">
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
        <main className="flex-1 flex items-center justify-center bg-bg-primary">
          <div className="text-center">
            <button
              onClick={handleNewChat}
              className="px-6 py-3 bg-bg-user-bubble text-white text-sm font-medium rounded-lg hover:bg-stone-700 transition-colors"
            >
              Start your first chat
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
