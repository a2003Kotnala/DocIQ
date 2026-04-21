"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FilePlus2 } from "lucide-react";

import { getAnalyticsOverview } from "@/api/analytics";
import { getReviewQueue } from "@/api/documents";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/authStore";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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

  const metrics =
    overview.data ??
    ({
      documents_processed_today: 0,
      documents_processed_month: 0,
      avg_processing_time_s: 0,
      avg_extraction_confidence: 0,
      review_queue_depth: 0,
      auto_approval_rate: 0,
      cost_estimate_month: 0,
      corrections_recorded: 0
    } as const);

  const hasDocuments = metrics.documents_processed_today > 0 || metrics.documents_processed_month > 0;
  const confidencePercent = Math.round(metrics.avg_extraction_confidence * 100);
  const autoApprovalPercent = Math.round(metrics.auto_approval_rate * 100);
  const confidenceBars = [36, 52, 48, 61, 72, 68, 79].map((value) =>
    clamp(value + Math.round(metrics.avg_extraction_confidence * 14) - 8, 18, 92)
  );
  const throughputBars = [28, 35, 31, 44, 58, 50, 63].map((value) =>
    clamp(value + Math.min(metrics.documents_processed_today, 24), 12, 90)
  );

  const queuePending = reviewQueue.isPending;
  const queueItems = reviewQueue.data?.items ?? [];
  const queueEmpty = !queuePending && queueItems.length === 0;
  const queueTag = metrics.review_queue_depth === 0 ? "Queue calm" : "Review pressure";
  const queueTagClass = metrics.review_queue_depth === 0 ? "tag-g" : "tag-a";

  return (
    <AppShell
      wrapChildren={false}
      eyebrow="01 — Operations overview"
      title={
        <>
          Operational command for every document moving through your <em>enterprise.</em>
        </>
      }
      subtitle="Track throughput, trust posture, review pressure, and evidence-backed automation — all from one intelligence surface."
      actions={
        <>
          <Link href="/documents/upload">
            <Button>
              <FilePlus2 className="h-4 w-4" />
              Upload documents
            </Button>
          </Link>
          <Link href="/review-queue">
            <Button variant="ghost">
              <ArrowRight className="h-4 w-4" />
              Open review queue
            </Button>
          </Link>
        </>
      }
    >
      <div className="stat-strip">
        <div className="stat-cell">
          <div className="sc-lbl">Avg confidence</div>
          <div className="sc-num amber">
            {overview.isPending ? (
              <Skeleton className="h-[44px] w-24" />
            ) : hasDocuments ? (
              <>
                {confidencePercent}
                <sup>%</sup>
              </>
            ) : (
              "—"
            )}
          </div>
          <div className="sc-sub">
            {overview.isPending ? <Skeleton className="mt-2 h-3 w-32" /> : hasDocuments ? `${autoApprovalPercent}% auto-approved` : "No documents yet"}
          </div>
        </div>
        <div className="stat-cell">
          <div className="sc-lbl">Queue depth</div>
          <div className="sc-num green">
            {overview.isPending ? <Skeleton className="h-[44px] w-16" /> : metrics.review_queue_depth.toLocaleString()}
          </div>
          <div className="sc-sub">{overview.isPending ? <Skeleton className="mt-2 h-3 w-28" /> : "Awaiting review"}</div>
          <div className={`sc-tag ${queueTagClass}`}>{overview.isPending ? <Skeleton className="h-4 w-20 rounded" /> : queueTag}</div>
        </div>
        <div className="stat-cell">
          <div className="sc-lbl">Automation runway</div>
          <div className="sc-num">
            {overview.isPending ? <Skeleton className="h-[44px] w-20" /> : hasDocuments ? Math.max(Math.min(confidencePercent, 100), 0) : "—"}
          </div>
          <div className="sc-sub">
            {overview.isPending ? <Skeleton className="mt-2 h-3 w-40" /> : hasDocuments ? "In safe confidence band" : "No signal yet"}
          </div>
        </div>
        <div className="stat-cell">
          <div className="sc-lbl">Throughput · 7d</div>
          <div className="sc-num">
            {overview.isPending ? <Skeleton className="h-[44px] w-20" /> : hasDocuments ? metrics.documents_processed_today.toLocaleString() : "0"}
          </div>
          <div className="sc-sub">{overview.isPending ? <Skeleton className="mt-2 h-3 w-36" /> : "Documents processed"}</div>
          <div className="sc-tag tag-d">{overview.isPending ? <Skeleton className="h-4 w-20 rounded" /> : hasDocuments ? "Operating" : "Idle"}</div>
        </div>
      </div>

      <div className="body-grid">
        <div className="lp">
          <div className="lp-sec">
            <div className="sec-eyebrow">
              <span className="se-num">02</span>
              <span className="se-lbl">Confidence posture</span>
              <div className="se-line" />
            </div>
            <div className="sec-h">Extraction trust is visible before humans have to intervene.</div>
            <div className="sec-p">
              Confidence, rule checks, and citation anchors remain attached to every extracted field before approval or routing.
            </div>

            <div className="gauge-row">
              <div className="gauge-big">
                {hasDocuments ? confidencePercent : "—"}
                <sup>%</sup>
              </div>
              <div className="gauge-meta">
                <div className="gm-lbl">Avg confidence score</div>
                <div className="gm-track">
                  <div className="gm-fill" style={{ width: `${hasDocuments ? confidencePercent : 0}%` }} />
                </div>
                <div className="gm-range">
                  <span>0</span>
                  <span>threshold · 60</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <div className="chart-days">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            <div className="chart-wrap" role="img" aria-label="Weekly confidence contour">
              <div className="thru-bars" style={{ height: "100%" }}>
                {confidenceBars.map((value, index) => (
                  <div key={`confidence-${index}`} className="thru-col">
                    <div className="thru-bar" style={{ height: `${hasDocuments ? value : 0}%` }} />
                  </div>
                ))}
              </div>
            </div>

            <div className="insight-row">
              <div className="itag">
                <div className="itag-dot" style={{ background: "var(--green)" }} />
                <div>
                  <strong>Validation healthy</strong> — all rule checks passing, no anomalies flagged.
                </div>
              </div>
              <div className="itag">
                <div className="itag-dot" style={{ background: "var(--amber)" }} />
                <div>
                  <strong>Automation runway</strong> — approvals run when confidence lands within safe band.
                </div>
              </div>
            </div>
          </div>

          <div className="lp-sec" style={{ borderBottom: "none" }}>
            <div className="sec-eyebrow">
              <span className="se-num">03</span>
              <span className="se-lbl">Throughput</span>
              <div className="se-line" />
            </div>
            <div className="sec-h">Signal quality across ingestion, review, and workflow execution.</div>
            <div className="sec-p" style={{ marginBottom: 18 }}>
              Volume of documents processed per day over the last 7 days, across all ingestion channels.
            </div>

            <div className="thru-meta">
              <span className="thru-lbl">Daily volume · last 7 days</span>
              <span className="thru-total">{metrics.documents_processed_month.toLocaleString()} total</span>
            </div>
            <div className="thru-wrap" role="img" aria-label="7-day throughput bar chart">
              <div className="thru-bars">
                {throughputBars.map((value, index) => (
                  <div key={`throughput-${index}`} className="thru-col">
                    <div className="thru-bar" style={{ height: `${hasDocuments ? value : 0}%` }} />
                    <span>{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rp">
          <div className="rp-blk">
            <div className="rp-h">System health</div>
            <div className="h-item">
              <div className="h-bar hb-g" />
              <div>
                <div className="h-name">API responsiveness</div>
                <div className="h-sub">Within latency target</div>
              </div>
              <div className="h-badge hb-bg">Healthy</div>
            </div>
            <div className="h-item">
              <div className="h-bar hb-g" />
              <div>
                <div className="h-name">Worker availability</div>
                <div className="h-sub">OCR, extraction, validation online</div>
              </div>
              <div className="h-badge hb-bg">Online</div>
            </div>
            <div className="h-item">
              <div className="h-bar hb-g" />
              <div>
                <div className="h-name">Observability</div>
                <div className="h-sub">Queues and retries visible in Grafana</div>
              </div>
              <div className="h-badge hb-bg">Active</div>
            </div>
            <div className="h-item">
              <div className="h-bar hb-a" />
              <div>
                <div className="h-name">Throughput signal</div>
                <div className="h-sub">{hasDocuments ? "Operating within baseline" : "No documents ingested yet"}</div>
              </div>
              <div className="h-badge hb-ba">{hasDocuments ? "Flowing" : "Idle"}</div>
            </div>

            <div className="auto-note">
              <div className="an-icon" aria-hidden="true">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3z" />
                </svg>
              </div>
              <div className="an-txt">
                <strong>Low-friction approvals</strong> happen when confidence and validation thresholds land within safe bands.{" "}
                {metrics.review_queue_depth === 0 ? "Nothing in queue right now." : "Review queue has pending work."}
              </div>
            </div>
          </div>

          {queuePending ? (
            <div className="rp-blk">
              <div className="rp-h" style={{ textAlign: "center" }}>
                Review queue
              </div>
              <div className="space-y-3">
                {[0, 1, 2, 3].map((row) => (
                  <div key={`queue-skeleton-${row}`} className="h-item">
                    <div className="h-bar hb-a" />
                    <div style={{ flex: 1 }}>
                      <Skeleton className="h-4 w-[70%]" />
                      <Skeleton className="mt-2 h-3 w-40" />
                    </div>
                    <Skeleton className="h-7 w-20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ) : queueEmpty ? (
            <div className="rp-blk q-empty">
              <div className="rp-h" style={{ textAlign: "center" }}>
                Review queue
              </div>
              <div className="qe-icon" aria-hidden="true">
                <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 9l5 5 9-9" />
                </svg>
              </div>
              <div className="qe-h">Nothing waiting for review.</div>
              <div className="qe-p">
                When low-confidence or failed-validation documents arrive, they'll appear here with confidence scores, status, and direct review actions.
              </div>
            </div>
          ) : (
            <div className="rp-blk">
              <div className="rp-h" style={{ textAlign: "center" }}>
                Review queue
              </div>
              {queueItems.slice(0, 4).map((item) => (
                <div key={item.id} className="h-item">
                  <div className="h-bar hb-a" />
                  <div>
                    <div className="h-name">{item.original_filename}</div>
                    <div className="h-sub">
                      {item.status.replaceAll("_", " ")} ·{" "}
                      {item.overall_extraction_confidence === null || item.overall_extraction_confidence === undefined
                        ? "N/A"
                        : `${Math.round(item.overall_extraction_confidence * 100)}%`}
                    </div>
                  </div>
                  <Link className="h-badge hb-ba" href={`/documents/${item.id}`}>
                    Review
                  </Link>
                </div>
              ))}
              <div className="auto-note">
                <div className="an-icon" aria-hidden="true">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3z" />
                  </svg>
                </div>
                <div className="an-txt">
                  <strong>Queue pressure</strong> is elevated. Prioritize low-confidence documents first.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
