import { cn } from "@/lib/utils";

export function StatusIndicator({ status }: { status: string }) {
  const tone = status.includes("FAILED") || status === "REJECTED"
    ? "bg-danger/10 text-danger border-danger/30"
    : status.includes("REVIEW")
      ? "bg-warning/10 text-warning border-warning/30"
      : status === "APPROVED" || status === "READY"
        ? "bg-success/10 text-success border-success/30"
        : "bg-accent/10 text-accent border-accent/30";

  return <span className={cn("rounded-full border px-2.5 py-1 text-xs font-medium", tone)}>{status}</span>;
}

