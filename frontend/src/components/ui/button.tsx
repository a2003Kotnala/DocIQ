"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl border text-sm font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/40 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-sky-300/30 bg-[linear-gradient(180deg,rgba(96,210,255,0.96),rgba(14,165,233,0.92))] px-4 py-2.5 text-slate-950 shadow-[0_14px_40px_rgba(14,165,233,0.24)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(14,165,233,0.32)]",
        secondary:
          "border-white/10 bg-white/[0.04] px-4 py-2.5 text-slate-100 hover:border-white/20 hover:bg-white/[0.07]",
        ghost: "border-transparent bg-transparent px-3 py-2.5 text-slate-300 hover:bg-white/[0.05] hover:text-white",
        danger:
          "border-orange-300/25 bg-orange-500/12 px-4 py-2.5 text-orange-100 hover:border-orange-300/40 hover:bg-orange-500/18"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}
