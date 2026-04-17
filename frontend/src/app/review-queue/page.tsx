"use client";

import { useQuery } from "@tanstack/react-query";

import { getReviewQueue } from "@/api/documents";
import { ReviewQueueTable } from "@/components/document/review-queue-table";
import { AppShell } from "@/components/layout/app-shell";
import { useAuthStore } from "@/stores/authStore";

export default function ReviewQueuePage() {
  const token = useAuthStore((state) => state.accessToken) ?? "";
  const queue = useQuery({
    queryKey: ["review-queue", token],
    queryFn: () => getReviewQueue(token),
    enabled: Boolean(token)
  });

  return (
    <AppShell title="Review Queue" subtitle="Prioritize low-confidence or failed-validation documents with fast, evidence-linked review actions.">
      <ReviewQueueTable items={queue.data?.items ?? []} />
    </AppShell>
  );
}

