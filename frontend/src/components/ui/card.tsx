import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  variant = "panel",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "panel" | "glass";
}) {
  const variantClass = variant === "glass" ? "glass-surface" : "panel-surface";

  return (
    <div {...props} className={cn(variantClass, "card-glow rounded-2xl", className)}>
      {children}
    </div>
  );
}
