"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border-accent bg-accent px-4 py-2 text-white hover:bg-blue-500",
        secondary: "border-border bg-surface px-4 py-2 text-foreground hover:bg-[#23283a]",
        ghost: "border-transparent bg-transparent px-3 py-2 text-muted hover:bg-white/5 hover:text-foreground"
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

