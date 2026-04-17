import Link from "next/link";

import { ConfidenceBadge } from "@/components/document/confidence-badge";
import { StatusIndicator } from "@/components/document/status-indicator";
import { Card } from "@/components/ui/card";
import { DocumentSummary } from "@/types/api";

export function ReviewQueueTable({ items }: { items: DocumentSummary[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 border-b border-border/70 px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted">
        <span>Document</span>
        <span>Status</span>
        <span>Confidence</span>
        <span>Action</span>
      </div>
      <div className="divide-y divide-border/70">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-[2fr,1fr,1fr,1fr] items-center gap-4 px-5 py-4">
            <div>
              <div className="font-medium text-foreground">{item.original_filename}</div>
              <div className="text-xs text-muted">{item.file_format.toUpperCase()}</div>
            </div>
            <StatusIndicator status={item.status} />
            <ConfidenceBadge confidence={item.overall_extraction_confidence ?? undefined} />
            <Link className="text-sm text-accent" href={`/documents/${item.id}`}>
              Review
            </Link>
          </div>
        ))}
      </div>
    </Card>
  );
}

