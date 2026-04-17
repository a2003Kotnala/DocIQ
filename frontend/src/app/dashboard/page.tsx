"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, FilePlus2, Shield, Sparkles, Workflow } from "lucide-react";

import { getAnalyticsOverview } from "@/api/analytics";
import { getReviewQueue } from "@/api/documents";
import { OverviewCards } from "@/components/analytics/overview-cards";
import { ReviewQueueTable } from "@/components/document/review-queue-table";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
  const token = useAuthStore((state) => state.accessToken) ?? "";

  const overview = useQuery({
    queryKey: ["analytics-overview", token],
    queryFn: () => getAnalyticsOverview(token),
    enabled: Boolean(token)
  });

  const reviewQueue = useQuery({
    queryKey: ["review-queue-preview", token],
    queryFn: () => getReviewQueue(token),
    enabled: Boolean(token)
  });

  const metrics = overview.data;
  const confidenceBars = [38, 54, 49, 70, 82, 76, 88];
  const throughputBars = [28, 42, 36, 51, 66, 58, 72];

  return (
    <AppShell
      eyebrow="Operations overview"
      title="Operational command for every document moving through your enterprise."
      subtitle="Track throughput, trust posture, review pressure, and evidence-backed automation from one intelligence surface."
      actions={
        <>
          <Link href="/documents/upload">
            <Button>
              <FilePlus2 className="h-4 w-4" />
              Upload documents
            </Button>
          </Link>
          <Link href="/review-queue">
            <Button variant="secondary">
              <ArrowUpRight className="h-4 w-4" />
              Open review queue
            </Button>
          </Link>
        </>
      }
    >
      {metrics ? <OverviewCards metrics={metrics} /> : null}

      <div className="grid gap-4 xl:grid-cols-[1.3fr,0.7fr]">
        <Card className="p-6">
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="metric-kicker">Confidence posture</div>
                <h2 className="mt-3 font-display text-2xl text-foreground">Extraction trust is visible before humans have to intervene.</h2>
              </div>
              <div className="rounded-2xl border border-sky-300/18 bg-sky-300/10 px-4 py-3 text-right">
                <div className="metric-kicker">Average confidence</div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {Math.round((metrics?.avg_extraction_confidence ?? 0) * 100)}%
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr,0.85fr]">
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <div className="metric-kicker">Weekly confidence contour</div>
                <div className="mt-6 flex h-48 items-end gap-3">
                  {confidenceBars.map((value, index) => (
                    <div key={`confidence-${index}`} className="flex flex-1 flex-col items-center gap-3">
                      <div
                        className="w-full rounded-full bg-[linear-gradient(180deg,rgba(135,232,255,0.95),rgba(14,165,233,0.2))]"
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
                        {["M", "T", "W", "T", "F", "S", "S"][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-[24px] border border-emerald-300/12 bg-emerald-400/8 p-5">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-emerald-200" />
                    <div className="font-semibold text-foreground">Validation and traceability are healthy</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Confidence, rule checks, and citation anchors remain attached to every extracted field before approval or routing.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="metric-kicker">Automation runway</div>
                  <div className="mt-4 flex items-center gap-3">
                    <Workflow className="h-5 w-5 text-sky-200" />
                    <div className="text-sm leading-6 text-muted">
                      Low-friction approvals happen when confidence and validation thresholds land within safe bands.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="relative z-10">
            <div className="metric-kicker">System health</div>
            <h2 className="mt-3 font-display text-2xl text-foreground">Signal quality across ingestion, review, and workflow execution.</h2>
            <div className="mt-6 space-y-4">
              {[
                ["API responsiveness", "Within latency target", "text-emerald-300"],
                ["Worker availability", "OCR, extraction, and validation online", "text-sky-300"],
                ["Observability", "Queues and retries visible in Grafana", "text-emerald-300"]
              ].map(([label, value, tone]) => (
                <div key={label} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground">{label}</div>
                    <span className={`status-dot ${tone}`} />
                  </div>
                  <div className="mt-2 text-sm leading-6 text-muted">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <div className="metric-kicker">Throughput contour</div>
              <div className="mt-5 flex h-28 items-end gap-2">
                {throughputBars.map((value, index) => (
                  <div key={`throughput-${index}`} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-full bg-[linear-gradient(180deg,rgba(34,197,94,0.9),rgba(34,197,94,0.15))]"
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-[10px] uppercase tracking-[0.16em] text-muted">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr,0.85fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="metric-kicker">Review queue preview</div>
              <div className="mt-2 text-lg font-semibold text-foreground">Documents that still need human judgement.</div>
            </div>
            <Link href="/review-queue" className="text-sm font-medium text-sky-100">
              View full queue
            </Link>
          </div>
          <ReviewQueueTable items={reviewQueue.data?.items ?? []} />
        </div>

        <Card className="p-6">
          <div className="relative z-10">
            <div className="metric-kicker">Operator guidance</div>
            <h2 className="mt-3 font-display text-2xl text-foreground">What high-performing teams do next.</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  icon: Sparkles,
                  title: "Escalate disagreement cases first",
                  copy: "Documents where rule extraction and LLM extraction diverge are the fastest source of quality gains."
                },
                {
                  icon: Shield,
                  title: "Approve only when confidence and validation align",
                  copy: "Use the evidence-linked review workspace to confirm low-confidence fields before triggering downstream systems."
                },
                {
                  icon: Workflow,
                  title: "Automate predictable approvals",
                  copy: "Stable document classes should graduate into workflow paths that eliminate repetitive human handling."
                }
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-sky-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{title}</div>
                      <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
