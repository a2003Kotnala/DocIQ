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
  const collapsed = useUiStore((state) => state.desktopSidebarCollapsed);
  const mobileOpen = useUiStore((state) => state.mobileSidebarOpen);
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar);
  const organization = useAuthStore((state) => state.organization);

  return (
    <aside
      className={cn(
        "sidebar fixed inset-y-0 left-0 z-40 h-screen transform transition-transform duration-300 md:relative md:z-auto md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "collapsed" : ""
      )}
    >
      <div className="logo">
        <div className="logo-row">
          <div className="logo-mark">DQ</div>
          {!collapsed ? <div className="logo-name">DocIQ</div> : null}
        </div>
        {!collapsed ? <div className="logo-sub">{organization?.name ?? "Enterprise Document Intelligence"}</div> : null}
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label}>
            <div className="nav-group">
              {!collapsed ? <div className="nav-group-label">{group.label}</div> : null}
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobileSidebar}
                    className={cn("nav-item", active ? "active" : "")}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="ni" size={13} strokeWidth={1.4} />
                    {!collapsed ? label : null}
                  </Link>
                );
              })}
            </div>
            {groupIndex < navGroups.length - 1 ? <div className="nav-rule" /> : null}
          </div>
        ))}
      </div>

      <div className="sidebar-foot">
        {!collapsed ? (
          <div className="trust-tag">
            <div className="tt-head">
              <span className="tt-dot" />
              Trust layer active
            </div>
            <div className="tt-body">Confidence, validation, and cited evidence stay visible from ingestion to execution.</div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
