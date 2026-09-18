"use client";

interface ToneToggleProps {
  value: string;
  onChange: (tone: string) => void;
}

const tones = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "concise", label: "Concise" },
];

export default function ToneToggle({ value, onChange }: ToneToggleProps) {
  return (
    <div className="flex gap-1 p-1 bg-stone-100 rounded-lg">
      {tones.map((tone) => (
        <button
          key={tone.id}
          data-active={value === tone.id}
          onClick={() => onChange(tone.id)}
          className="tone-btn px-3 py-1.5 text-xs font-medium rounded-md text-stone-500 hover:text-stone-700"
        >
          {tone.label}
        </button>
      ))}
    </div>
  );
}
