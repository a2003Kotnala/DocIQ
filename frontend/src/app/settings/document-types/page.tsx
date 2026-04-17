import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function DocumentTypesPage() {
  return (
    <AppShell title="Document Types" subtitle="Configure extraction schemas, thresholds, and validation rules per document class.">
      <Card className="p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-muted">Schema editor</div>
        <p className="mt-3 text-sm text-muted">
          Invoice, contract, KYC, and custom document-type schemas are stored in the backend and surfaced here for controlled administration.
        </p>
      </Card>
    </AppShell>
  );
}

