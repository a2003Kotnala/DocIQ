"use client";

import { MapPinned, Sparkles } from "lucide-react";

import { ExtractedField, ValidationResult } from "@/types/api";
import { ConfidenceBadge } from "@/components/document/confidence-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDocumentViewerStore } from "@/stores/documentViewerStore";

export function FieldList({
  fields,
  validations
}: {
  fields: ExtractedField[];
  validations: ValidationResult[];
}) {
  const selectField = useDocumentViewerStore((state) => state.selectField);
  const selectedFieldId = useDocumentViewerStore((state) => state.selectedFieldId);

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const validation = validations.find((item) => item.rule_id.toLowerCase().includes(field.field_name.toLowerCase()));
        return (
          <Card
            key={field.id}
            className={cn(
              "p-4 transition",
              selectedFieldId === field.id ? "border-[rgba(224,173,108,0.35)] bg-[rgba(200,147,74,0.06)]" : ""
            )}
          >
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="metric-kicker">{field.field_display_name ?? field.field_name}</div>
                  <div className="mt-3 rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-3 font-mono text-sm text-foreground">
                    {field.raw_value ?? "No value"}
                  </div>
                  <div className="mt-3 text-sm leading-6 text-muted">
                    {validation?.message ?? field.source_text ?? "Traceable extraction available for review."}
                  </div>
                </div>
                <ConfidenceBadge confidence={field.confidence} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => selectField(field.id, field.source_bbox ?? null)}>
                  <MapPinned className="h-4 w-4" />
                  Highlight source
                </Button>
                <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 text-xs text-muted">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  {field.extraction_method ?? "hybrid"} extraction
                </span>
                {field.source_page_number ? (
                  <span className="inline-flex items-center rounded-full border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--text-3)]">
                    Page {field.source_page_number}
                  </span>
                ) : null}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
