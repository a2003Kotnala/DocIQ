import { cn } from "@/lib/utils";

export function Card({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("glass-surface rounded-2xl border border-border/80", className)}>{children}</div>;
}

