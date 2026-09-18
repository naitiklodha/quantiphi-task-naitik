"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import SearchBar from "./SearchBar";

interface Conversation {
  _id: string;
  title: string;
  tone: string;
  updatedAt: string;
}

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-label="Conversation history"
        className={`
          fixed lg:relative z-30 h-full w-72
          bg-sidebar-bg text-sidebar-fg
          flex flex-col
          transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold tracking-tight">Conversations</h1>
          <Button
            size="sm"
            onClick={onNew}
            className="h-8 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            aria-label="Start new conversation"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">New</span>
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pb-3">
          <SearchBar conversations={conversations} onSelect={onSelect} />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-4" />

        {/* Conversation list */}
        <ScrollArea className="flex-1 px-2 py-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare size={24} className="text-sidebar-muted mb-2" />
              <p className="text-sidebar-muted text-xs">
                No conversations yet. Start one to begin.
              </p>
            </div>
          ) : (
            <nav className="space-y-0.5" role="list">
              {conversations.map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => {
                    onSelect(conv._id);
                    onClose();
                  }}
                  role="listitem"
                  aria-current={activeId === conv._id ? "page" : undefined}
                  className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm cursor-pointer
                    transition-colors duration-100
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-sidebar-bg
                    ${
                      activeId === conv._id
                        ? "bg-sidebar-active text-white font-medium"
                        : "text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-fg"
                    }
                  `}
                >
                  <span className="truncate block">{conv.title}</span>
                </button>
              ))}
            </nav>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-sidebar-muted text-[10px] uppercase tracking-wider">
            Powered by Gemini
          </p>
        </div>
      </aside>
    </>
  );
}
