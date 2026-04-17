"use client";

import { Bell, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore((state) => state.organization);
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <header className="glass-surface flex h-16 items-center justify-between border-b border-border/70 px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={toggleSidebar}>
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
        <div>
          <div className="text-sm font-medium text-foreground">{organization?.name ?? "DocIQ Workspace"}</div>
          <div className="text-xs text-muted">Traceable extraction, validation, and review</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="rounded-xl border border-border bg-[#111521] px-3 py-2 text-sm">
          <div className="text-foreground">{user?.display_name ?? user?.email ?? "Analyst"}</div>
          <div className="text-xs text-muted">{user?.email ?? "No active session"}</div>
        </div>
      </div>
    </header>
  );
}

