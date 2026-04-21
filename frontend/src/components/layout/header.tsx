"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, PanelLeftClose, PanelLeftOpen, Settings2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const collapsed = useUiStore((state) => state.desktopSidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const clearSession = useAuthStore((state) => state.clearSession);
  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore((state) => state.organization);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Account menu" className="tb-btn" type="button">
              {(user?.display_name ?? user?.email ?? "A").slice(0, 1).toUpperCase()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
            <div className="px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-3)]">
                Signed in
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl border border-[rgba(220,180,110,0.12)] bg-[rgba(200,147,74,0.08)] text-sm font-semibold text-accent">
                  {(user?.display_name ?? user?.email ?? "A").slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">{user?.display_name ?? "Account"}</div>
                  <div className="truncate text-xs text-muted">{user?.email ?? "admin@dociq.test"}</div>
                </div>
              </div>

              {organization ? (
                <div className="mt-4 rounded-xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-2">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-3)]">
                    Organization
                  </div>
                  <div className="mt-1 text-sm text-foreground">{organization.name}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{organization.slug}</div>
                </div>
              ) : null}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={() => router.push("/settings")}>
              <Settings2 className="h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                clearSession();
                router.replace("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
