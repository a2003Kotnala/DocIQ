"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

export function AppShell({
  title,
  subtitle,
  eyebrow,
  actions,
  children,
  wrapChildren = true
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  wrapChildren?: boolean;
}) {
  const router = useRouter();
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen);
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (accessToken) return;
    router.replace("/login");
  }, [accessToken, hasHydrated, router]);

  if (!hasHydrated || !accessToken) {
    return (
      <main className="app-canvas grid min-h-screen place-items-center px-6 py-10">
        <div className="panel-surface card-glow w-full max-w-lg rounded-2xl p-8">
          <div className="relative z-10 space-y-4">
            <div className="section-label">DocIQ</div>
            <div className="font-display text-3xl text-foreground">Restoring your workspace</div>
            <p className="text-sm leading-6 text-muted">
              Authenticating into your tenant-scoped console and preparing the command center.
            </p>
            <div className="flex items-center gap-3 pt-1 text-sm text-muted">
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              <span>Loading…</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="shell">
      {mobileSidebarOpen ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/45 backdrop-blur-[1px] md:hidden"
          onClick={closeMobileSidebar}
          type="button"
        />
      ) : null}

      <Sidebar />

      <div className="main">
        <Header />
        <main className="content">
          <section className="ed-header">
            <div>
              {eyebrow ? <div className="eh-eyebrow">{eyebrow}</div> : null}
              <h1 className="eh-h1">{title}</h1>
              {subtitle ? <p className="eh-p">{subtitle}</p> : null}
            </div>
            {actions ? <div className="eh-btns">{actions}</div> : null}
          </section>

          {wrapChildren ? <div className="space-y-6 px-5 py-6 lg:px-8 lg:py-8">{children}</div> : children}

          <footer className="footer">
            <div className="footer-l">DocIQ &nbsp;·&nbsp; Last refreshed just now</div>
            <div className="footer-r">
              <a href="/settings">Platform settings</a>
              <a href="#">Documentation</a>
              <a href="#">Support</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
