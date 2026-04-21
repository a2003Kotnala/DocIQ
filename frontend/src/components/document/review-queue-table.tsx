import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

import { ConfidenceBadge } from "@/components/document/confidence-badge";
import { StatusIndicator } from "@/components/document/status-indicator";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentSummary } from "@/types/api";

export function ReviewQueueTable({ items, isLoading = false }: { items: DocumentSummary[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="app-table">
        <div className="app-table-header hidden grid-cols-[minmax(0,2.5fr)_1fr_1fr_1fr] gap-4 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-3)] md:grid">
          <span>Document</span>
          <span>Status</span>
          <span>Confidence</span>
          <span>Action</span>
        </div>
        <div className="divide-y divide-[rgba(220,180,110,0.08)]">
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={`review-row-skeleton-${row}`}
              className="app-table-row grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,2.5fr)_1fr_1fr_1fr] md:px-6"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-[72%]" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex items-center md:justify-start">
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <div className="flex items-center md:justify-start">
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <Card className="rounded-none border-x-0 border-b-0 border-t-0 p-8 shadow-none">
        <div className="relative z-10 flex flex-col items-start gap-3">
          <div className="section-label">Queue calm</div>
          <h3 className="font-display text-3xl font-medium text-foreground">No documents are waiting for human review.</h3>
          <p className="max-w-2xl text-sm leading-6 text-muted">
            When low-confidence or failed-validation documents arrive, they will appear here with confidence, status, and direct review actions.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="app-table">
      <div className="app-table-header hidden grid-cols-[minmax(0,2.5fr)_1fr_1fr_1fr] gap-4 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-3)] md:grid">
        <span>Document</span>
        <span>Status</span>
        <span>Confidence</span>
        <span>Action</span>
      </div>
      <div className="divide-y divide-[rgba(220,180,110,0.08)]">
        {items.map((item) => (
          <div key={item.id} className="app-table-row grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,2.5fr)_1fr_1fr_1fr] md:px-6">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[rgba(220,180,110,0.1)] bg-[rgba(200,147,74,0.06)] text-accent">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground">{item.original_filename}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--text-3)]">
                  {item.file_format.toUpperCase()}
                </div>
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
                className="inline-flex items-center gap-2 rounded-md border border-[rgba(220,180,110,0.12)] px-3 py-2 text-sm text-foreground transition hover:border-[rgba(220,180,110,0.2)] hover:bg-[rgba(220,180,110,0.05)]"
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
