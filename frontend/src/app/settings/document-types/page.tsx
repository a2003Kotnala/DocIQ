import { Braces, CheckCheck, Layers3 } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function DocumentTypesPage() {
  return (
    <AppShell
      eyebrow="Schema control"
      title="Configure extraction schemas, validation rules, and approval thresholds by document class."
      subtitle="Invoice, contract, KYC, and custom taxonomies can evolve independently while still flowing through the same trusted platform."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {[
          {
            title: "Extraction schema",
            copy: "Field definitions, aliases, positional hints, and extraction methods stay configurable instead of hardcoded.",
            icon: Braces
          },
          {
            title: "Validation logic",
            copy: "Cross-field rules, external reference checks, and severity posture stay configurable per document type.",
            icon: CheckCheck
          },
          {
            title: "Threshold strategy",
            copy: "Auto-approve and review thresholds can differ across document classes based on risk and operational tolerance.",
            icon: Layers3
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
    </AppShell>
  );
}
