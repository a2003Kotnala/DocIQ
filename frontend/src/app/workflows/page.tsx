"use client";

import { useQuery } from "@tanstack/react-query";

import { getWorkflows } from "@/api/workflows";
import { AppShell } from "@/components/layout/app-shell";
import { WorkflowList } from "@/components/workflow/workflow-list";
import { useAuthStore } from "@/stores/authStore";

export default function WorkflowsPage() {
  const token = useAuthStore((state) => state.accessToken) ?? "";
  const workflows = useQuery({
    queryKey: ["workflows", token],
    queryFn: () => getWorkflows(token),
    enabled: Boolean(token)
  });

  return (
    <AppShell title="Workflow Builder" subtitle="Turn validated document events into emails, routing, and downstream system actions.">
      <WorkflowList workflows={workflows.data?.items ?? []} />
    </AppShell>
  );
}

