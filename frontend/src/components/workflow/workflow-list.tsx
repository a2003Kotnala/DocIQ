import { ArrowRight, GitBranchPlus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkflowDefinition } from "@/types/api";

export function WorkflowList({ workflows, isLoading = false }: { workflows: WorkflowDefinition[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-2">
        {[0, 1, 2, 3].map((row) => (
          <Card key={`workflow-skeleton-${row}`} className="p-5 lg:p-6">
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((cell) => (
                  <div key={`workflow-skel-cell-${row}-${cell}`} className="rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="mt-3 h-6 w-10" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!workflows.length) {
    return (
      <Card className="p-8">
        <div className="relative z-10">
          <div className="section-label">Automation staging</div>
          <h3 className="mt-4 font-display text-2xl text-foreground">No workflow definitions have been published yet.</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Once you connect document conditions to downstream actions, workflows will appear here with trigger depth, action count, and runtime posture.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="p-5 lg:p-6">
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(200,147,74,0.08)] text-accent">
                  <GitBranchPlus className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">{workflow.name}</div>
                  <div className="mt-2 text-sm leading-6 text-muted">{workflow.description ?? "Document-triggered automation rule"}</div>
                </div>
              </div>
              <div
                className={
                  workflow.is_active
                    ? "rounded-full border border-[rgba(122,184,138,0.24)] bg-[rgba(122,184,138,0.12)] px-3 py-1.5 text-xs font-semibold text-success"
                    : "rounded-full border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 text-xs font-semibold text-muted"
                }
              >
                {workflow.is_active ? "Active" : "Draft"}
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-4">
                <div className="metric-kicker">Trigger</div>
                <div className="mt-2 text-xl font-semibold text-foreground">1</div>
              </div>
              <div className="rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-4">
                <div className="metric-kicker">Conditions</div>
                <div className="mt-2 text-xl font-semibold text-foreground">{workflow.conditions.length}</div>
              </div>
              <div className="rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-4">
                <div className="metric-kicker">Actions</div>
                <div className="mt-2 text-xl font-semibold text-foreground">{workflow.actions.length}</div>
              </div>
            </div>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
              Workflow posture visible
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
