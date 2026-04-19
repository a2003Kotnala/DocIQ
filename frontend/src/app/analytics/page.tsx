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

  const performanceBars = [28, 36, 42, 55, 60, 72, 84];
  const accuracyBars = [52, 58, 64, 68, 76, 82, 90];

  return (
    <AppShell
      eyebrow="Business analytics"
      title="Measure throughput, accuracy, review pressure, and cost in one executive-grade analytics surface."
      subtitle="DocIQ exposes both operational and business outcomes so teams can improve extraction quality, reduce manual review load, and defend ROI."
    >
      {overview.data ? <OverviewCards metrics={overview.data} /> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-6">
          <div className="relative z-10">
            <div className="metric-kicker">Processing performance</div>
            <h2 className="mt-3 font-display text-2xl text-foreground">Latency and throughput remain visible as volume scales.</h2>
            <div className="mt-6 flex h-64 items-end gap-3">
              {performanceBars.map((value, index) => (
                <div key={`processing-${index}`} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full rounded-full bg-[linear-gradient(180deg,rgba(224,173,108,0.96),rgba(200,147,74,0.18))]"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-3)]">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="relative z-10">
            <div className="metric-kicker">Accuracy and feedback</div>
            <h2 className="mt-3 font-display text-2xl text-foreground">Correction volume feeds back into quality improvement.</h2>
            <div className="mt-6 flex h-64 items-end gap-3">
              {accuracyBars.map((value, index) => (
                <div key={`accuracy-${index}`} className="flex flex-1 flex-col items-center gap-3">
                  <div
                    className="w-full rounded-full bg-[linear-gradient(180deg,rgba(122,184,138,0.96),rgba(122,184,138,0.18))]"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-3)]">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
