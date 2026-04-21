"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ScanEye } from "lucide-react";

import { getReviewQueue } from "@/api/documents";
import { ReviewQueueTable } from "@/components/document/review-queue-table";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";

export default function ReviewQueuePage() {
  const token = useAuthStore((state) => state.accessToken) ?? "";
  const queue = useQuery({
    queryKey: ["review-queue", token],
    queryFn: () => getReviewQueue(token),
    enabled: Boolean(token)
  });
  const isPending = queue.isPending;

  return (
    <AppShell
      eyebrow="Human review"
      title="Prioritize the documents where confidence, validation, or extraction disagreement still requires judgment."
      subtitle="Human-in-the-loop review stays first-class: evidence is visible, corrections are captured, and every decision becomes feedback."
      actions={
        <Link href="/assistant">
          <Button variant="secondary">
            <ScanEye className="h-4 w-4" />
            Ask assistant
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
        <Card className="p-6">
          <div className="relative z-10">
            <div className="metric-kicker">Review posture</div>
            <h2 className="mt-3 font-display text-2xl text-foreground">Focus on the highest-risk decisions first.</h2>
            <div className="mt-6 space-y-4">
              {[
                "Low-confidence extractions should be validated before downstream records are created.",
                "Rule-vs-LLM disagreements surface high-learning-value examples for the feedback loop.",
                "Rejected or corrected documents create the strongest retraining signals."
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[22px] border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-4 text-sm leading-6 text-muted"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="relative z-10">
            <div className="metric-kicker">Queue depth</div>
            {isPending ? (
              <div className="mt-4 max-w-[220px] space-y-2">
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
            ) : (
              <div className="mt-3 text-5xl font-display text-foreground">{queue.data?.total ?? queue.data?.items.length ?? 0}</div>
            )}
            <p className="mt-3 text-sm leading-6 text-muted">
              Documents currently sit in the review queue when extraction confidence is too low, validation rules fail, or classification needs human confirmation.
            </p>
          </div>
        </Card>
      </div>
      <ReviewQueueTable items={queue.data?.items ?? []} isLoading={isPending} />
    </AppShell>
  );
}
