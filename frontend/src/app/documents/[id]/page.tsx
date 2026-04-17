"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { getDocument } from "@/api/documents";
import { DocumentViewer } from "@/components/document/document-viewer";
import { FieldList } from "@/components/document/field-list";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>();
  const token = useAuthStore((state) => state.accessToken) ?? "";
  const documentQuery = useQuery({
    queryKey: ["document", params.id, token],
    queryFn: () => getDocument(token, params.id),
    enabled: Boolean(token && params.id)
  });

  const document = documentQuery.data;

  return (
    <AppShell title={document?.original_filename ?? "Document Viewer"} subtitle="Trace every extracted field back to the exact evidence used to produce it.">
      <div className="grid gap-4 xl:grid-cols-[1.35fr,0.65fr]">
        <DocumentViewer pageCount={document?.page_count} />
        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-muted">Document summary</div>
            <div className="mt-3 text-sm text-foreground">Classification confidence: {Math.round((document?.classification_confidence ?? 0) * 100)}%</div>
            <div className="mt-2 text-sm text-muted">Validation status: {document?.validation_status ?? "Pending"}</div>
          </Card>
          <FieldList fields={document?.extracted_fields ?? []} validations={document?.validation_results ?? []} />
        </div>
      </div>
    </AppShell>
  );
}

