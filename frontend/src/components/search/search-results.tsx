import Link from "next/link";

import { Card } from "@/components/ui/card";
import { SearchResult } from "@/types/api";

export function SearchResults({ results }: { results: SearchResult[] }) {
  return (
    <div className="space-y-3">
      {results.map((result) => (
        <Card key={`${result.document_id}-${result.page_number}-${result.highlighted_text.slice(0, 12)}`} className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-medium text-foreground">{result.document_name}</div>
              <div className="text-xs text-muted">Page {result.page_number}</div>
            </div>
            <div className="text-xs text-muted">score {result.relevance_score.toFixed(2)}</div>
          </div>
          <p className="mt-3 text-sm text-muted">{result.highlighted_text}</p>
          <div className="mt-4">
            <Link className="text-sm text-accent" href={`/documents/${result.document_id}`}>
              Open document
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}

