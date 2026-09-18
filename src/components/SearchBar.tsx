"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  conversations: { _id: string; title: string }[];
  onSelect: (id: string) => void;
}

export default function SearchBar({ conversations, onSelect }: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  const filtered = query
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase())
      )
    : conversations;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-sidebar-muted bg-sidebar-hover rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
      >
        <Search size={14} />
        <span>Search conversations...</span>
        <kbd className="ml-auto px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-3 py-2 bg-sidebar-hover rounded-lg border border-white/10">
        <Search size={14} className="text-sidebar-muted shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conversations..."
          className="flex-1 bg-transparent text-xs text-sidebar-fg placeholder:text-sidebar-muted outline-none"
        />
        <button
          onClick={() => {
            setOpen(false);
            setQuery("");
          }}
          className="text-sidebar-muted hover:text-sidebar-fg cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-sidebar-hover rounded-lg border border-white/10 max-h-60 overflow-y-auto z-50 shadow-lg">
          {filtered.length === 0 ? (
            <p className="px-3 py-3 text-xs text-sidebar-muted text-center">
              No matches found
            </p>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv._id}
                onClick={() => {
                  onSelect(conv._id);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full text-left px-3 py-2.5 text-xs text-sidebar-fg hover:bg-white/10 transition-colors cursor-pointer first:rounded-t-lg last:rounded-b-lg"
              >
                {conv.title}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
