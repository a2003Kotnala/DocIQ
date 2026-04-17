"use client";

import { useState } from "react";

import { SearchResults } from "@/components/search/search-results";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";

export default function SearchPage() {
  const [query, setQuery] = useState("invoice");
  const search = useSearch();

  return (
    <AppShell title="Semantic Search" subtitle="Retrieve validated evidence from the document corpus with tenant-aware access controls.">
      <Card className="p-5">
        <div className="flex gap-3">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search across documents, clauses, and extracted fields" />
          <Button onClick={() => search.mutate(query)}>Search</Button>
        </div>
      </Card>
      <SearchResults results={search.data?.results ?? []} />
    </AppShell>
  );
}

