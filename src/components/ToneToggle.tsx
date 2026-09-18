"use client";

import { Badge } from "@/components/ui/badge";

interface ToneToggleProps {
  value: string;
  onChange: (tone: string) => void;
}

const tones = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "concise", label: "Concise" },
] as const;

export default function ToneToggle({ value, onChange }: ToneToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Response tone"
      className="flex items-center gap-1.5"
    >
      {tones.map((tone) => (
        <button
          key={tone.id}
          role="radio"
          aria-checked={value === tone.id}
          onClick={() => onChange(tone.id)}
          className={`
            px-3 py-1.5 text-xs font-medium rounded-full
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
            ${
              value === tone.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
            }
          `}
        >
          {tone.label}
        </button>
      ))}
    </div>
  );
}
