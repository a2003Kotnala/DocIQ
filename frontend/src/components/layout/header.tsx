"use client";

import { usePathname } from "next/navigation";
import { Bell, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

export function Header() {
  const pathname = usePathname();
  const collapsed = useUiStore((state) => state.desktopSidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);
  const currentPage =
    pathname === "/dashboard"
      ? "Command Center"
      : pathname
          .split("/")
          .filter(Boolean)
          .slice(-1)[0]
          ?.replace(/-/g, " ")
          .replace(/\b\w/g, (match) => match.toUpperCase()) ?? "Workspace";

  return (
    <header className="topbar">
      <div className="tb-crumb">
        <button
          aria-label={collapsed ? "Open sidebar" : "Collapse sidebar"}
          className="tb-btn"
          onClick={toggleSidebar}
          type="button"
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </button>
        <span>DocIQ</span>
        <span className="sep">/</span>
        <span className="cur">{currentPage}</span>
      </div>
      <div className="tb-right">
        <div className="chip chip-a">
          <span className="chip-dot" />
          Tenant isolation active
        </div>
        <div className="chip chip-g">
          <span className="chip-dot" />
          Human review in loop
        </div>
        <button aria-label="Notifications" className="tb-btn" type="button">
          <Bell />
        </button>
        <button aria-label="Account menu" className="tb-btn" type="button">
          {(user?.display_name ?? user?.email ?? "A").slice(0, 1).toUpperCase()}
        </button>
      </div>
    </header>
  );
}
