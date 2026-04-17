import { cn } from "@/lib/utils";

export function StatusIndicator({ status }: { status: string }) {
  const tone =
    status.includes("FAILED") || status === "REJECTED"
      ? "border-orange-300/20 bg-orange-500/10 text-orange-200"
      : status.includes("REVIEW")
        ? "border-amber-300/20 bg-amber-400/10 text-amber-200"
        : status === "APPROVED" || status === "READY"
          ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
          : "border-sky-300/20 bg-sky-400/10 text-sky-200";

  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.04em]", tone)}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
