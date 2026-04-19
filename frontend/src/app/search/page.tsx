"use client";

import { useState } from "react";
import { Search, ShieldCheck } from "lucide-react";

import { SearchResults } from "@/components/search/search-results";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";

export default function SearchPage() {
  const [query, setQuery] = useState("invoice exceptions above approval threshold");
  const search = useSearch();

  return (
    <AppShell
      eyebrow="Semantic retrieval"
      title="Search your enterprise corpus with citation-first results and tenant-aware retrieval."
      subtitle="Dense retrieval, sparse matching, reranking, and metadata filters keep answers grounded in your own document estate."
    >
      <Card className="p-5 lg:p-6">
        <div className="relative z-10 flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex-1">
            <div className="metric-kicker">Search prompt</div>
            <div className="mt-3 flex gap-3">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search across documents, clauses, extracted fields, and evidence spans"
              />
              <Button onClick={() => search.mutate(query)}>
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
          <div className="rounded-[24px] border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-4 py-4 xl:w-[320px]">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              Retrieval posture
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              Results are constrained to authorized documents and surfaced with page-level evidence.
            </p>
          </div>
        </div>
      </Card>
      <SearchResults results={search.data?.results ?? []} />
    </AppShell>
  );
}
