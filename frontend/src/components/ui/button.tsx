"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-[11.5px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/35 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-[rgba(224,173,108,0.28)] bg-[linear-gradient(180deg,rgba(224,173,108,0.98),rgba(200,147,74,0.96))] text-[#140f0a] shadow-[0_14px_30px_rgba(200,147,74,0.16)] hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(232,184,121,1),rgba(208,152,78,0.96))]",
        secondary:
          "border-[rgba(220,180,110,0.16)] bg-[rgba(255,255,255,0.02)] text-muted hover:border-[rgba(220,180,110,0.28)] hover:bg-[rgba(220,180,110,0.07)] hover:text-foreground",
        ghost:
          "border-transparent bg-transparent px-2.5 py-2 text-muted hover:border-[rgba(220,180,110,0.12)] hover:bg-[rgba(220,180,110,0.05)] hover:text-foreground",
        danger:
          "border-[rgba(196,122,114,0.18)] bg-[rgba(196,122,114,0.12)] text-danger hover:border-[rgba(196,122,114,0.28)] hover:bg-[rgba(196,122,114,0.16)]"
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
