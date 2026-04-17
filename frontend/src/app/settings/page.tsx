import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AppShell title="Settings" subtitle="Manage tenant-level controls for schemas, integrations, permissions, and operational policies.">
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">Identity and access</div>
          <p className="mt-3 text-sm text-muted">OIDC, role definitions, restricted document policies, and audit visibility live here.</p>
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">Integrations</div>
          <p className="mt-3 text-sm text-muted">ERP hooks, webhooks, vector search settings, and model/provider visibility live here.</p>
        </Card>
      </div>
    </AppShell>
  );
}

