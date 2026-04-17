"use client";

import { useQuery } from "@tanstack/react-query";

import { getAnalyticsOverview } from "@/api/analytics";
import { getReviewQueue } from "@/api/documents";
import { OverviewCards } from "@/components/analytics/overview-cards";
import { ReviewQueueTable } from "@/components/document/review-queue-table";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
  const token = useAuthStore((state) => state.accessToken) ?? "";

  const overview = useQuery({
    queryKey: ["analytics-overview", token],
    queryFn: () => getAnalyticsOverview(token),
    enabled: Boolean(token)
  });

  const reviewQueue = useQuery({
    queryKey: ["review-queue-preview", token],
    queryFn: () => getReviewQueue(token),
    enabled: Boolean(token)
  });

  return (
    <AppShell title="Operations Overview" subtitle="Track throughput, confidence posture, and the documents that still need human judgment.">
      {overview.data ? <OverviewCards metrics={overview.data} /> : null}
      <div className="grid gap-4 xl:grid-cols-[1.3fr,0.7fr]">
        <Card className="p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">Confidence posture</div>
          <div className="mt-4 text-sm text-muted">
            Average extraction confidence: {Math.round((overview.data?.avg_extraction_confidence ?? 0) * 100)}%
          </div>
          <div className="mt-4 h-40 rounded-2xl border border-border bg-[#111521]" />
        </Card>
        <Card className="p-5">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">System health</div>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <div>API latency within target.</div>
            <div>OCR and extraction workers running.</div>
            <div>Queue depth visible in Prometheus/Grafana.</div>
          </div>
        </Card>
      </div>
      <div>
        <div className="mb-4 text-sm font-medium text-foreground">Review queue preview</div>
        <ReviewQueueTable items={reviewQueue.data?.items ?? []} />
      </div>
    </AppShell>
  );
}

