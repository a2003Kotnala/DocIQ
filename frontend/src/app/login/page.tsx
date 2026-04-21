"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LockKeyhole, ScanText, ShieldCheck } from "lucide-react";

import { login } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const [form, setForm] = useState({ email: "admin@dociq.test", password: "password123", org_slug: "seed-org" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) return;
    router.replace("/dashboard");
  }, [accessToken, hasHydrated, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await login(form);
      setSession({
        accessToken: response.access_token,
        organization: response.organization,
        user: response.user
      });
      router.push("/dashboard");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Login failed");
    }
  }

  if (!hasHydrated || accessToken) {
    return (
      <main className="app-canvas grid min-h-screen place-items-center px-6 py-10">
        <div className="panel-surface card-glow w-full max-w-lg rounded-2xl p-8">
          <div className="relative z-10 space-y-4">
            <div className="section-label">DocIQ</div>
            <div className="font-display text-3xl text-foreground">Preparing your workspace</div>
            <p className="text-sm leading-6 text-muted">Checking your session and loading the command center.</p>
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
    <main className="app-canvas grid min-h-screen lg:grid-cols-[1.1fr,0.9fr]">
      <section className="flex flex-col justify-between px-8 py-10 lg:px-14 lg:py-14">
        <div>
          <div className="section-label">DocIQ platform</div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight text-foreground lg:text-7xl">
            Enterprise document intelligence without losing control, traceability, or trust.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
            Ingest documents, extract structured intelligence, validate every field, route exceptions to humans, and automate downstream action from one system.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Traceable extraction", copy: "Every extracted value links back to source evidence.", icon: ScanText },
            { title: "Review-first operations", copy: "Human approval stays built into the workflow.", icon: ShieldCheck },
            {
              title: "Secure by default",
              copy: "Tenant boundaries, auditability, and access controls are visible.",
              icon: LockKeyhole
            }
          ].map(({ title, copy, icon: Icon }) => (
            <Card key={title} className="p-5">
              <div className="relative z-10">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(200,147,74,0.08)] text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-lg font-semibold text-foreground">{title}</div>
                <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10 lg:px-10">
        <Card className="w-full max-w-xl p-8 lg:p-10">
          <div className="relative z-10">
            <div className="section-label">Sign in</div>
            <div className="mt-5">
              <div className="font-display text-3xl text-foreground">Enter the DocIQ workspace</div>
              <p className="mt-3 text-sm leading-6 text-muted">Authenticate into the tenant-scoped operations console and continue from the command center.</p>
            </div>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <Input placeholder="Email" value={form.email} onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))} />
              <Input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(event) => setForm((state) => ({ ...state, password: event.target.value }))}
              />
              <Input
                placeholder="Org Slug"
                value={form.org_slug}
                onChange={(event) => setForm((state) => ({ ...state, org_slug: event.target.value }))}
              />
              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button className="w-full justify-center" type="submit">
                Sign in to DocIQ
              </Button>
            </form>
            <div className="mt-6 rounded-[22px] border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-4 text-sm leading-6 text-muted">
              Seeded access is prefilled for local development so you can move directly into review, search, and workflow flows.
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
