import { cn } from "@/lib/utils";

export function StatusIndicator({ status }: { status: string }) {
  const tone =
    status.includes("FAILED") || status === "REJECTED"
      ? "border-[rgba(196,122,114,0.2)] bg-[rgba(196,122,114,0.12)] text-danger"
      : status.includes("REVIEW")
        ? "border-[rgba(220,180,110,0.18)] bg-[rgba(200,147,74,0.12)] text-accent"
        : status === "APPROVED" || status === "READY"
          ? "border-[rgba(122,184,138,0.18)] bg-[rgba(122,184,138,0.1)] text-success"
          : "border-[rgba(220,180,110,0.1)] bg-[rgba(255,255,255,0.02)] text-foreground";

  return (
    <span className={cn("inline-flex rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em]", tone)}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
