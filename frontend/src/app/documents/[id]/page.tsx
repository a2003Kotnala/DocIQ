"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, ClipboardCheck, ScanSearch } from "lucide-react";

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
    <AppShell
      eyebrow="Review workspace"
      title={document?.original_filename ?? "Document viewer"}
      subtitle="Trace every extracted field back to exact evidence, review validation signals, and keep approvals grounded in source context."
    >
      <div className="grid gap-4 xl:grid-cols-[1.3fr,0.7fr]">
        <DocumentViewer pageCount={document?.page_count} />
        <div className="space-y-4">
          <Card className="p-5">
            <div className="relative z-10">
              <div className="metric-kicker">Document summary</div>
              <div className="mt-5 grid gap-3">
                {[
                  {
                    label: "Classification confidence",
                    value: `${Math.round((document?.classification_confidence ?? 0) * 100)}%`,
                    icon: ScanSearch
                  },
                  { label: "Validation status", value: document?.validation_status ?? "Pending", icon: ClipboardCheck },
                  {
                    label: "Field review readiness",
                    value: `${document?.extracted_fields.length ?? 0} extracted fields`,
                    icon: BadgeCheck
                  }
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-[22px] border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(200,147,74,0.08)] text-accent">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.16em] text-muted">{label}</div>
                        <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          <div>
            <div className="mb-4">
              <div className="metric-kicker">Extracted fields</div>
              <div className="mt-2 text-lg font-semibold text-foreground">Evidence-linked output for human confirmation.</div>
            </div>
            <FieldList fields={document?.extracted_fields ?? []} validations={document?.validation_results ?? []} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
