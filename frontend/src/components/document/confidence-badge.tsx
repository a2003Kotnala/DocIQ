import { cn } from "@/lib/utils";

export function ConfidenceBadge({ confidence }: { confidence?: number | null }) {
  const tone =
    confidence === null || confidence === undefined
      ? "border-white/10 bg-white/[0.04] text-muted"
      : confidence >= 0.9
        ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
        : confidence >= 0.7
          ? "border-amber-300/20 bg-amber-400/10 text-amber-200"
          : "border-orange-300/20 bg-orange-500/10 text-orange-200";

  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.04em]", tone)}>
      {confidence === null || confidence === undefined ? "N/A" : `${Math.round(confidence * 100)}% confidence`}
    </span>
  );
}
