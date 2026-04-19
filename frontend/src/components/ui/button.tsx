"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md border font-medium leading-none transition-[transform,background-color,border-color,box-shadow,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(224,173,108,0.35)] disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        primary:
          "border-[rgba(224,173,108,0.28)] bg-[linear-gradient(180deg,rgba(224,173,108,0.98),rgba(200,147,74,0.96))] text-[#140f0a] shadow-[0_14px_30px_rgba(200,147,74,0.16)] hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(232,184,121,1),rgba(208,152,78,0.96))]",
        secondary:
          "border-[rgba(220,180,110,0.16)] bg-[rgba(255,255,255,0.02)] text-muted hover:border-[rgba(220,180,110,0.28)] hover:bg-[rgba(220,180,110,0.07)] hover:text-foreground",
        ghost:
          "border-transparent bg-transparent text-muted hover:border-[rgba(220,180,110,0.12)] hover:bg-[rgba(220,180,110,0.05)] hover:text-foreground",
        danger:
          "border-[rgba(196,122,114,0.18)] bg-[rgba(196,122,114,0.12)] text-danger hover:border-[rgba(196,122,114,0.28)] hover:bg-[rgba(196,122,114,0.16)]"
      },
      size: {
        sm: "h-9 px-3 text-[11px]",
        md: "h-10 px-4 text-[11.5px]",
        lg: "h-11 px-5 text-[12px]",
        icon: "h-10 w-10 p-0"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({ className, variant, size, isLoading, disabled, children, ...props }: ButtonProps) {
  const resolvedDisabled = disabled || Boolean(isLoading);

  return (
    <button className={cn(buttonVariants({ variant, size }), className)} disabled={resolvedDisabled} {...props}>
      {isLoading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}
