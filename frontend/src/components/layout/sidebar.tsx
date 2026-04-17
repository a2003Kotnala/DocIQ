"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileStack,
  Gauge,
  GitBranchPlus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

const navGroups = [
  {
    label: "Command",
    items: [
      { href: "/dashboard", label: "Operations", icon: Gauge, hint: "Live posture" },
      { href: "/analytics", label: "Analytics", icon: Activity, hint: "SLAs and ROI" }
    ]
  },
  {
    label: "Documents",
    items: [
      { href: "/documents", label: "Corpus", icon: FileStack, hint: "All ingested files" },
      { href: "/review-queue", label: "Review Queue", icon: ShieldCheck, hint: "Human decisions" }
    ]
  },
  {
    label: "Intelligence",
    items: [
      { href: "/search", label: "Search", icon: Search, hint: "Dense + sparse retrieval" },
      { href: "/assistant", label: "Assistant", icon: Sparkles, hint: "Cited answers only" },
      { href: "/workflows", label: "Workflows", icon: GitBranchPlus, hint: "Event automations" },
      { href: "/settings", label: "Settings", icon: Settings2, hint: "Schemas and controls" }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const organization = useAuthStore((state) => state.organization);

  return (
    <aside
      className={cn(
        "glass-surface sticky top-0 flex h-screen flex-col border-r border-white/10 px-4 py-5 transition-all duration-300",
        collapsed ? "w-24" : "w-[302px]"
      )}
    >
      <div className="border-b soft-divider px-2 pb-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-sky-300/20 bg-sky-300/10 text-sm font-semibold text-sky-100 shadow-[0_0_30px_rgba(56,189,248,0.18)]">
            DQ
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <div className="font-display text-lg tracking-[0.16em] text-foreground">DOCIQ</div>
              <p className="truncate text-xs text-muted">{organization?.name ?? "Enterprise Document Intelligence"}</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="scrollbar-thin mt-5 flex-1 space-y-6 overflow-y-auto pr-1">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-2">
            {!collapsed ? <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{group.label}</div> : null}
            <div className="space-y-1">
              {group.items.map(({ href, label, icon: Icon, hint }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200",
                      active
                        ? "bg-[linear-gradient(135deg,rgba(56,189,248,0.18),rgba(255,255,255,0.03))] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                        : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-all duration-200",
                        active
                          ? "border-sky-300/25 bg-sky-300/10 text-sky-100"
                          : "border-white/5 bg-white/[0.025] text-slate-400 group-hover:border-white/10 group-hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    {!collapsed ? (
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{label}</div>
                        <div className={cn("text-xs", active ? "text-sky-100/70" : "text-muted")}>{hint}</div>
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[24px] border border-emerald-300/12 bg-[linear-gradient(180deg,rgba(18,40,48,0.72),rgba(10,20,31,0.92))] p-4">
        {collapsed ? (
          <div className="grid place-items-center">
            <Settings2 className="h-5 w-5 text-emerald-300" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-foreground">Trust Layer</div>
              <span className="status-dot bg-emerald-400 text-emerald-400" />
            </div>
            <p className="mt-2 text-xs leading-5 text-muted">
              Confidence, validation, and cited evidence stay visible from ingestion through workflow execution.
            </p>
            <Link
              href="/settings"
              className="mt-4 inline-flex items-center rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              Platform settings
            </Link>
          </>
        )}
      </div>
    </aside>
  );
}
