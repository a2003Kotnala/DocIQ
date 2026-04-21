"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, FilePlus2, FileText } from "lucide-react";

import { getDocuments } from "@/api/documents";
import { ConfidenceBadge } from "@/components/document/confidence-badge";
import { StatusIndicator } from "@/components/document/status-indicator";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";

export default function DocumentsPage() {
  const token = useAuthStore((state) => state.accessToken) ?? "";
  const documents = useQuery({
    queryKey: ["documents", token],
    queryFn: () => getDocuments(token, { page: 1, page_size: 20 }),
    enabled: Boolean(token)
  });

  const items = documents.data?.items ?? [];
  const isPending = documents.isPending;

  return (
    <AppShell
      eyebrow="Corpus"
      title="Tenant-scoped document inventory with confidence, status, and evidence posture visible at a glance."
      subtitle="Every file keeps its processing status, extraction confidence, and approval readiness attached from ingestion through review."
      actions={
        <Link href="/documents/upload">
          <Button>
            <FilePlus2 className="h-4 w-4" />
            Upload documents
          </Button>
        </Link>
      }
    >
      <Card className="p-5 lg:p-6">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="metric-kicker">Corpus status</div>
            {isPending ? (
              <div className="mt-3 max-w-[340px] space-y-2">
                <Skeleton className="h-7 w-[260px]" />
                <Skeleton className="h-4 w-[220px]" />
              </div>
            ) : (
              <div className="mt-3 text-2xl font-display text-foreground">{documents.data?.total ?? 0} documents in scope</div>
            )}
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Operational teams can scan high-risk documents first, then open evidence-linked detail views for review, correction, and approval.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {isPending
              ? [0, 1, 2].map((index) => (
                  <div
                    key={`corpus-skeleton-${index}`}
                    className="rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-3"
                  >
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-3 h-6 w-10" />
                  </div>
                ))
              : [
                  ["Queued", items.filter((doc) => doc.status.includes("PENDING")).length],
                  ["In review", items.filter((doc) => doc.status.includes("REVIEW")).length],
                  ["Ready", items.filter((doc) => doc.status === "READY" || doc.status === "APPROVED").length]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
                    <div className="metric-kicker">{label}</div>
                    <div className="mt-2 text-xl font-semibold text-foreground">{value}</div>
                  </div>
                ))}
          </div>
        </div>
      </Card>

      {isPending ? (
        <div className="app-table">
          <div className="app-table-header hidden grid-cols-[minmax(0,2.6fr)_1fr_1fr_auto] gap-4 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-3)] md:grid">
            <span>Name</span>
            <span>Status</span>
            <span>Confidence</span>
            <span>Open</span>
          </div>
          <div className="divide-y divide-[rgba(220,180,110,0.08)]">
            {[0, 1, 2, 3, 4, 5].map((row) => (
              <div
                key={`doc-row-skeleton-${row}`}
                className="app-table-row grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,2.6fr)_1fr_1fr_auto] md:px-6"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="h-11 w-11 rounded-2xl" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-9 w-28 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : items.length === 0 ? (
        <Card className="p-10">
          <div className="relative z-10 text-center">
            <div className="section-label">Corpus empty</div>
            <div className="mt-4 font-display text-3xl text-foreground">Upload your first document.</div>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">
              Once documents are ingested, you’ll see processing status, extraction confidence, validation posture, and review readiness here.
            </p>
            <div className="mt-7 flex justify-center">
              <Link href="/documents/upload">
                <Button>
                  <FilePlus2 className="h-4 w-4" />
                  Upload documents
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="app-table">
          <div className="app-table-header hidden grid-cols-[minmax(0,2.6fr)_1fr_1fr_auto] gap-4 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-3)] md:grid">
            <span>Name</span>
            <span>Status</span>
            <span>Confidence</span>
            <span>Open</span>
          </div>
          <div className="divide-y divide-[rgba(220,180,110,0.08)]">
            {items.map((document) => (
              <div
                key={document.id}
                className="app-table-row grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,2.6fr)_1fr_1fr_auto] md:px-6"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(200,147,74,0.08)] text-accent">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">{document.original_filename}</div>
                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-muted">{document.file_format.toUpperCase()}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <StatusIndicator status={document.status} />
                </div>
                <div className="flex items-center">
                  <ConfidenceBadge confidence={document.overall_extraction_confidence ?? undefined} />
                </div>
                <div className="flex items-center">
                  <Link
                    className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-sm font-medium text-foreground transition hover:border-[rgba(220,180,110,0.22)] hover:bg-[rgba(220,180,110,0.05)]"
                    href={`/documents/${document.id}`}
                  >
                    View
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
