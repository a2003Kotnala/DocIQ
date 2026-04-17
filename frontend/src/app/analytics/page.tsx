"use client";

import { useQuery } from "@tanstack/react-query";

import { getAnalyticsOverview } from "@/api/analytics";
import { OverviewCards } from "@/components/analytics/overview-cards";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

export default function AnalyticsPage() {
  const token = useAuthStore((state) => state.accessToken) ?? "";
  const overview = useQuery({
    queryKey: ["analytics-overview-page", token],
    queryFn: () => getAnalyticsOverview(token),
    enabled: Boolean(token)
  });

  return (
    <AppShell title="Analytics" subtitle="Measure throughput, accuracy, review effort, and operational cost across the full pipeline.">
      {overview.data ? <OverviewCards metrics={overview.data} /> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="h-80 p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">Processing performance</div>
          <div className="mt-4 h-56 rounded-2xl border border-border bg-[#111521]" />
        </Card>
        <Card className="h-80 p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">Accuracy and feedback trends</div>
          <div className="mt-4 h-56 rounded-2xl border border-border bg-[#111521]" />
        </Card>
      </div>
    </AppShell>
  );
}

