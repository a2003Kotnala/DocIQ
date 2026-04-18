"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
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
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen);
  const closeMobileSidebar = useUiStore((state) => state.closeMobileSidebar);

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
