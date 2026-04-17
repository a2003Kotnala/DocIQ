import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({
  title,
  subtitle,
  eyebrow,
  actions,
  children
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="app-canvas flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
            <section className="hero-gradient rounded-[32px] border border-white/10 px-6 py-7 shadow-panel lg:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-4xl">
                  {eyebrow ? <div className="section-label">{eyebrow}</div> : null}
                  <h1 className="mt-4 font-display text-4xl leading-tight text-foreground lg:text-[3.25rem]">{title}</h1>
                  {subtitle ? <p className="mt-3 max-w-3xl text-sm leading-6 text-muted lg:text-[15px]">{subtitle}</p> : null}
                </div>
                {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
              </div>
            </section>
            <div className="flex flex-col gap-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
