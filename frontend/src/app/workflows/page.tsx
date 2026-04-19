"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Cable, Mail, MessageSquareShare } from "lucide-react";

import { getWorkflows } from "@/api/workflows";
import { AppShell } from "@/components/layout/app-shell";
import { WorkflowList } from "@/components/workflow/workflow-list";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/authStore";

export default function WorkflowsPage() {
  const token = useAuthStore((state) => state.accessToken) ?? "";
  const workflows = useQuery({
    queryKey: ["workflows", token],
    queryFn: () => getWorkflows(token),
    enabled: Boolean(token)
  });

  return (
    <AppShell
      eyebrow="Workflow engine"
      title="Turn trusted document states into downstream action without losing auditability."
      subtitle="When documents cross a status or confidence threshold, DocIQ can route tasks, notify teams, and create downstream records with idempotent execution."
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {[
          { title: "Email routing", copy: "Notify AP or legal teams when approvals are ready.", icon: Mail },
          { title: "Webhook delivery", copy: "Push validated records into downstream systems.", icon: Cable },
          { title: "Slack or Teams", copy: "Escalate review events to the right operators.", icon: MessageSquareShare }
        ].map(({ title, copy, icon: Icon }) => (
          <Card key={title} className="p-5">
            <div className="relative z-10">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(200,147,74,0.08)] text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-lg font-semibold text-foreground">{title}</div>
              <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-accent">
                Actionable and audited
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <WorkflowList workflows={workflows.data?.items ?? []} />
    </AppShell>
  );
}
