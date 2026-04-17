"use client";

import { Bell, Command, PanelLeftClose, PanelLeftOpen, Shield, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore((state) => state.organization);
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,13,20,0.72)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={toggleSidebar}>
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-semibold text-foreground">{organization?.name ?? "DocIQ Command Center"}</div>
              <div className="hidden rounded-full border border-emerald-300/15 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200 md:inline-flex">
                All systems traceable
              </div>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Tenant isolation active
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Human review in the loop
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-muted lg:flex">
            <Command className="h-3.5 w-3.5 text-sky-200" />
            Search, review, and workflow actions
          </div>
          <Button variant="ghost" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(135,232,255,0.7)]" />
          </Button>
          <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,37,55,0.92),rgba(10,20,31,0.92))] px-3 py-2.5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(180deg,rgba(135,232,255,0.2),rgba(56,189,248,0.16))] text-sm font-semibold text-sky-100">
                {(user?.display_name ?? user?.email ?? "A").slice(0, 1).toUpperCase()}
              </div>
              <div className="hidden min-w-0 sm:block">
                <div className="truncate text-sm font-medium text-foreground">{user?.display_name ?? "Analyst"}</div>
                <div className="truncate text-xs text-muted">{user?.email ?? "No active session"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
