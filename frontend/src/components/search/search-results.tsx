import Link from "next/link";
import { ArrowUpRight, ScanSearch } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SearchResult } from "@/types/api";

export function SearchResults({ results }: { results: SearchResult[] }) {
  if (!results.length) {
    return (
      <Card className="p-8">
        <div className="relative z-10">
          <div className="section-label">Search ready</div>
          <h3 className="mt-4 font-display text-2xl text-foreground">Run a query to retrieve grounded evidence.</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Dense retrieval, sparse matching, and reranking bring back document evidence with page-level traceability and confidence-aware ranking.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={`${result.document_id}-${result.page_number}-${result.highlighted_text.slice(0, 12)}`} className="p-5 lg:p-6">
          <div className="relative z-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-sky-100">
                    <ScanSearch className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-foreground">{result.document_name}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">Page {result.page_number}</div>
                  </div>
                </div>
                <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-200/90">{result.highlighted_text}</p>
              </div>
              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right">
                <div className="metric-kicker">Relevance</div>
                <div className="mt-2 text-xl font-semibold text-foreground">{Math.round(result.relevance_score * 100)}</div>
              </div>
            </div>
            {result.matched_fields.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.matched_fields.map((field) => (
                  <span key={`${result.document_id}-${field}`} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-muted">
                    {field}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="mt-5">
              <Link
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-foreground transition hover:border-sky-300/20 hover:bg-sky-300/10"
                href={`/documents/${result.document_id}`}
              >
                Open document
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
