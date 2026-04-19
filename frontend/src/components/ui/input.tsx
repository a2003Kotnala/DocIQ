import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-[rgba(220,180,110,0.14)] bg-[rgba(255,255,255,0.02)] px-4 text-sm text-foreground outline-none transition placeholder:text-[color:var(--text-3)] focus:border-[rgba(224,173,108,0.4)] focus:bg-[rgba(255,255,255,0.03)] focus:shadow-[0_0_0_4px_rgba(200,147,74,0.12)] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    />
  );
});
