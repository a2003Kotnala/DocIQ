"use client";

import { ExtractedField, ValidationResult } from "@/types/api";
import { ConfidenceBadge } from "@/components/document/confidence-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDocumentViewerStore } from "@/stores/documentViewerStore";

export function FieldList({
  fields,
  validations
}: {
  fields: ExtractedField[];
  validations: ValidationResult[];
}) {
  const selectField = useDocumentViewerStore((state) => state.selectField);

  return (
    <div className="space-y-3">
      {fields.map((field) => {
        const validation = validations.find((item) => item.rule_id.toLowerCase().includes(field.field_name.toLowerCase()));
        return (
          <Card key={field.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">{field.field_display_name ?? field.field_name}</div>
                <div className="mt-2 font-mono text-sm text-foreground">{field.raw_value ?? "No value"}</div>
                <div className="mt-2 text-xs text-muted">{validation?.message ?? field.source_text ?? "Traceable extraction available."}</div>
              </div>
              <ConfidenceBadge confidence={field.confidence} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="secondary" onClick={() => selectField(field.id, field.source_bbox ?? null)}>
                Highlight Source
              </Button>
              <span className="text-xs text-muted">{field.extraction_method ?? "hybrid"} extraction</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

