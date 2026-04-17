import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid-shell flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 px-6 py-6">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-2xl text-foreground">{title}</h1>
              {subtitle ? <p className="max-w-3xl text-sm text-muted">{subtitle}</p> : null}
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

