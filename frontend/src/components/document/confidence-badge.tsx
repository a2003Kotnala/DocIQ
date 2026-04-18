import { cn } from "@/lib/utils";

export function ConfidenceBadge({ confidence }: { confidence?: number | null }) {
  const tone =
    confidence === null || confidence === undefined
      ? "border-[rgba(220,180,110,0.08)] bg-[rgba(255,255,255,0.02)] text-muted"
      : confidence >= 0.9
        ? "border-[rgba(122,184,138,0.18)] bg-[rgba(122,184,138,0.1)] text-success"
        : confidence >= 0.7
          ? "border-[rgba(220,180,110,0.18)] bg-[rgba(200,147,74,0.12)] text-accent"
          : "border-[rgba(196,122,114,0.2)] bg-[rgba(196,122,114,0.12)] text-danger";

  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em]", tone)}>
      {confidence === null || confidence === undefined ? "N/A" : `${Math.round(confidence * 100)}% confidence`}
    </span>
  );
}
