import { cn } from "@/lib/utils";

export function ConfidenceBadge({ confidence }: { confidence?: number | null }) {
  const tone =
    confidence === null || confidence === undefined
      ? "bg-white/5 text-muted"
      : confidence >= 0.9
        ? "bg-success/10 text-success border-success/30"
        : confidence >= 0.7
          ? "bg-warning/10 text-warning border-warning/30"
          : "bg-danger/10 text-danger border-danger/30";

  return (
    <span className={cn("rounded-full border px-2.5 py-1 text-xs font-medium", tone)}>
      {confidence === null || confidence === undefined ? "N/A" : `${Math.round(confidence * 100)}%`}
    </span>
  );
}

