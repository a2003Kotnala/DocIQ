"use client";

import Link from "next/link";
import { FileText, Gauge, Search, ShieldCheck, Sparkles, Workflow } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/uiStore";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/review-queue", label: "Review Queue", icon: ShieldCheck },
  { href: "/search", label: "Search", icon: Search },
  { href: "/assistant", label: "Assistant", icon: Sparkles },
  { href: "/workflows", label: "Workflows", icon: Workflow }
];

export function Sidebar() {
  const collapsed = useUiStore((state) => state.sidebarCollapsed);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border/70 bg-[#10141f]/92 px-3 py-5 transition-all",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="px-3 pb-6">
        <div className="font-display text-lg tracking-[0.24em] text-foreground">DOCIQ</div>
        {!collapsed ? <p className="mt-2 text-xs text-muted">Precision document intelligence for enterprise operations.</p> : null}
      </div>
      <nav className="space-y-2">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted transition hover:bg-white/5 hover:text-foreground"
          >
            <Icon className="h-4 w-4" />
            {!collapsed ? <span>{label}</span> : null}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-accent/20 bg-accent/10 p-4 text-xs text-muted">
        {!collapsed ? "Confidence-first review and cited retrieval are built into every workflow." : "AI"}
      </div>
    </aside>
  );
}

