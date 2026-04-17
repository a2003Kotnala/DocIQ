import * as React from "react";

import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-12 w-full rounded-2xl border border-white/10 bg-[rgba(9,18,28,0.86)] px-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/40 focus:bg-[rgba(12,24,36,0.96)] focus:shadow-[0_0_0_4px_rgba(56,189,248,0.08)]",
        props.className
      )}
    />
  );
}
