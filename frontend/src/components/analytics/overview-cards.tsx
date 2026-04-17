import { ArrowUpRight, Clock3, ScanSearch, ShieldCheck } from "lucide-react";

import { Card } from "@/components/ui/card";
import { AnalyticsOverview } from "@/types/api";

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export function OverviewCards({ metrics }: { metrics: AnalyticsOverview }) {
  const items = [
    {
      label: "Processed today",
      value: metrics.documents_processed_today.toLocaleString(),
      detail: `${metrics.documents_processed_month.toLocaleString()} this month`,
      icon: ScanSearch,
      bars: [24, 42, 36, 54, 62, 70]
    },
    {
      label: "Average confidence",
      value: formatPercent(metrics.avg_extraction_confidence),
      detail: `${formatPercent(metrics.auto_approval_rate)} auto-approved`,
      icon: ShieldCheck,
      bars: [44, 50, 64, 58, 72, 86]
    },
    {
      label: "Review queue",
      value: metrics.review_queue_depth.toLocaleString(),
      detail: `${metrics.corrections_recorded.toLocaleString()} corrections captured`,
      icon: ArrowUpRight,
      bars: [80, 62, 48, 54, 36, 28]
    },
    {
      label: "Average latency",
      value: `${Math.round(metrics.avg_processing_time_s)}s`,
      detail: `$${metrics.cost_estimate_month.toFixed(2)} monthly estimate`,
      icon: Clock3,
      bars: [30, 38, 42, 46, 52, 60]
    }
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
      {items.map(({ label, value, detail, icon: Icon, bars }) => (
        <Card key={label} className="p-5 lg:p-6">
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="metric-kicker">{label}</div>
                <div className="mt-4 font-display text-4xl text-foreground">{value}</div>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-sky-300/18 bg-sky-300/10 text-sky-100">
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div className="text-sm text-muted">{detail}</div>
              <div className="stat-sparkline w-24">
                {bars.map((height, index) => (
                  <span key={`${label}-${index}`} style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
