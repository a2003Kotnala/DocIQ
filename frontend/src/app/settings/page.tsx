import { KeyRound, Link2, Shield, SlidersHorizontal } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell
      eyebrow="Platform controls"
      title="Tenant-level configuration for access, schemas, providers, and operational policy."
      subtitle="DocIQ exposes the administrative controls that determine how identity, integrations, document classes, and downstream behavior are governed."
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {[
          {
            title: "Identity and access",
            copy: "OIDC, RBAC, restricted document policies, session boundaries, and audit visibility live here.",
            icon: KeyRound
          },
          {
            title: "Integrations",
            copy: "ERP hooks, webhooks, model providers, vector search settings, and external validation references live here.",
            icon: Link2
          },
          {
            title: "Policy",
            copy: "Tenant defaults for confidence thresholds, review routing, retention, and automation controls are governed here.",
            icon: Shield
          },
          {
            title: "Platform tuning",
            copy: "Control extraction behavior, validation posture, notification behavior, and workspace defaults without hardcoding them.",
            icon: SlidersHorizontal
          }
        ].map(({ title, copy, icon: Icon }) => (
          <Card key={title} className="p-5">
            <div className="relative z-10">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-sky-100">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-lg font-semibold text-foreground">{title}</div>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
