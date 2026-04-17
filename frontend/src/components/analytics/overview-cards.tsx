import { Card } from "@/components/ui/card";
import { AnalyticsOverview } from "@/types/api";

export function OverviewCards({ metrics }: { metrics: AnalyticsOverview }) {
  const items = [
    ["Processed Today", metrics.documents_processed_today],
    ["Processed This Month", metrics.documents_processed_month],
    ["Review Queue Depth", metrics.review_queue_depth],
    ["Corrections Recorded", metrics.corrections_recorded]
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <Card key={label} className="p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-muted">{label}</div>
          <div className="mt-4 font-display text-3xl text-foreground">{value}</div>
        </Card>
      ))}
    </div>
  );
}

