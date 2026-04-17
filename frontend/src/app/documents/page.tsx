"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getDocuments } from "@/api/documents";
import { ConfidenceBadge } from "@/components/document/confidence-badge";
import { StatusIndicator } from "@/components/document/status-indicator";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

export default function DocumentsPage() {
  const token = useAuthStore((state) => state.accessToken) ?? "";
  const documents = useQuery({
    queryKey: ["documents", token],
    queryFn: () => getDocuments(token, { page: 1, page_size: 20 }),
    enabled: Boolean(token)
  });

  return (
    <AppShell title="Documents" subtitle="Browse all ingested documents with confidence and validation status visible at a glance.">
      <div className="flex justify-end">
        <Link href="/documents/upload">
          <Button>Upload Documents</Button>
        </Link>
      </div>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 border-b border-border/70 px-5 py-4 text-xs uppercase tracking-[0.18em] text-muted">
          <span>Name</span>
          <span>Status</span>
          <span>Confidence</span>
          <span>Open</span>
        </div>
        <div className="divide-y divide-border/70">
          {(documents.data?.items ?? []).map((document) => (
            <div key={document.id} className="grid grid-cols-[2fr,1fr,1fr,1fr] items-center gap-4 px-5 py-4">
              <div>
                <div className="font-medium text-foreground">{document.original_filename}</div>
                <div className="text-xs text-muted">{document.file_format.toUpperCase()}</div>
              </div>
              <StatusIndicator status={document.status} />
              <ConfidenceBadge confidence={document.overall_extraction_confidence ?? undefined} />
              <Link className="text-sm text-accent" href={`/documents/${document.id}`}>
                View
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

