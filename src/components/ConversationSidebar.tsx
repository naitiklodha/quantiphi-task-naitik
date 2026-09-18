"use client";

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
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed lg:relative z-30 h-full w-72 bg-bg-sidebar flex flex-col
          transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-4 border-b border-border-sidebar">
          <button
            onClick={onNew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-text-sidebar text-sm font-medium rounded-lg transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Chat
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {conversations.length === 0 && (
            <p className="text-text-sidebar-muted text-sm px-3 py-6 text-center">
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv._id}
              onClick={() => {
                onSelect(conv._id);
                onClose();
              }}
              className={`
                conv-item w-full text-left px-3 py-2.5 rounded-lg text-sm truncate
                ${
                  activeId === conv._id
                    ? "bg-bg-sidebar-hover text-text-sidebar"
                    : "text-text-sidebar-muted hover:bg-bg-sidebar-hover hover:text-text-sidebar"
                }
              `}
            >
              {conv.title}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border-sidebar">
          <p className="text-text-sidebar-muted text-xs">
            Powered by Gemini
          </p>
        </div>
      </aside>
    </>
  );
}
