"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, AlertCircle, Loader2 } from "lucide-react";

interface ProviderSelectorProps {
  value: string;
  onChange: (provider: string) => void;
}

interface ProviderInfo {
  name: string;
  badge: string;
  available: boolean;
}

export default function ProviderSelector({ value, onChange }: ProviderSelectorProps) {
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState<Record<string, ProviderInfo>>({
    gemini: { name: "Gemini", badge: "Free", available: true },
    openai: { name: "OpenAI", badge: "GPT-4o", available: false },
    claude: { name: "Claude", badge: "Sonnet", available: false },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/providers")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const current = providers[value] || providers.gemini;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
        aria-label="Select AI provider"
      >
        {loading ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <>
            <span>{current.name}</span>
            <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 w-56 bg-background border border-border rounded-lg shadow-lg z-50 py-1">
            {Object.entries(providers).map(([id, provider]) => (
              <button
                key={id}
                onClick={() => {
                  if (provider.available) {
                    onChange(id);
                  }
                  setOpen(false);
                }}
                disabled={!provider.available}
                className={`
                  w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-colors
                  ${provider.available ? "hover:bg-muted cursor-pointer" : "opacity-50 cursor-not-allowed"}
                `}
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{provider.name}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {provider.badge}
                    </span>
                  </div>
                  {!provider.available && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      API key not configured
                    </p>
                  )}
                </div>
                {value === id && <Check size={14} className="text-primary" />}
              </button>
            ))}
            <div className="border-t border-border mt-1 pt-2 px-3 pb-2">
              <p className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                <AlertCircle size={10} className="mt-0.5 shrink-0" />
                Add API keys in .env.local to enable providers
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
