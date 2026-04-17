import * as React from "react";

import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-border bg-[#111521] px-4 text-sm text-foreground outline-none transition focus:border-accent",
        props.className
      )}
    />
  );
}

