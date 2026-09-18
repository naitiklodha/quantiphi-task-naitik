"use client";

import { useState } from "react";
import { Check, ChevronDown, AlertCircle } from "lucide-react";

interface ProviderSelectorProps {
  value: string;
  onChange: (provider: string) => void;
}

const providers = [
  { id: "gemini", name: "Gemini", badge: "Free", available: true },
  { id: "openai", name: "OpenAI", badge: "GPT-4o", available: !!process.env.NEXT_PUBLIC_OPENAI_AVAILABLE },
  { id: "claude", name: "Claude", badge: "Sonnet", available: !!process.env.NEXT_PUBLIC_CLAUDE_AVAILABLE },
];

export default function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  const [open, setOpen] = useState(false);
  const current = providers.find((p) => p.id === value) || providers[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
      >
        <span>{current.name}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg z-50 py-1">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => {
                  onChange(provider.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{provider.name}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {provider.badge}
                    </span>
                  </div>
                </div>
                {value === provider.id && <Check size={14} className="text-primary" />}
              </button>
            ))}
            <div className="border-t border-border mt-1 pt-1 px-3 pb-2">
              <p className="text-[10px] text-muted-foreground flex items-start gap-1">
                <AlertCircle size={10} className="mt-0.5 shrink-0" />
                OpenAI & Claude need API keys in .env.local
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
