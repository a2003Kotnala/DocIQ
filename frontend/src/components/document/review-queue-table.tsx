import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { ConfidenceBadge } from "@/components/document/confidence-badge";
import { StatusIndicator } from "@/components/document/status-indicator";
import { Card } from "@/components/ui/card";
import { DocumentSummary } from "@/types/api";

export function ReviewQueueTable({ items }: { items: DocumentSummary[] }) {
  if (!items.length) {
    return (
      <Card className="p-8">
        <div className="relative z-10 flex flex-col items-start gap-3">
          <div className="section-label">Queue calm</div>
          <h3 className="font-display text-2xl text-foreground">No documents are waiting for human review.</h3>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            When low-confidence or failed-validation documents arrive, they will appear here with confidence, status, and direct review actions.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="app-table">
      <div className="app-table-header hidden grid-cols-[minmax(0,2.5fr)_1fr_1fr_1fr] gap-4 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted md:grid">
        <span>Document</span>
        <span>Status</span>
        <span>Confidence</span>
        <span>Action</span>
      </div>
      <div className="divide-y divide-white/5">
        {items.map((item) => (
          <div key={item.id} className="app-table-row grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,2.5fr)_1fr_1fr_1fr] md:px-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/8 bg-white/[0.03] text-sky-100">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-foreground">{item.original_filename}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{item.file_format.toUpperCase()}</div>
              </div>
            </div>
            <div className="flex items-center md:justify-start">
              <StatusIndicator status={item.status} />
            </div>
            <div className="flex items-center md:justify-start">
              <ConfidenceBadge confidence={item.overall_extraction_confidence ?? undefined} />
            </div>
            <div className="flex items-center">
              <Link
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-foreground transition hover:border-sky-300/20 hover:bg-sky-300/10"
                href={`/documents/${item.id}`}
              >
                Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
