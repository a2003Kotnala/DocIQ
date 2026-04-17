import { Card } from "@/components/ui/card";
import { WorkflowDefinition } from "@/types/api";

export function WorkflowList({ workflows }: { workflows: WorkflowDefinition[] }) {
  return (
    <div className="space-y-3">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium text-foreground">{workflow.name}</div>
              <div className="mt-2 text-sm text-muted">{workflow.description ?? "Document-triggered automation rule"}</div>
            </div>
            <div className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
              {workflow.is_active ? "Active" : "Disabled"}
            </div>
          </div>
          <div className="mt-4 text-xs text-muted">
            {workflow.actions.length} actions • {workflow.conditions.length} conditions
          </div>
        </Card>
      ))}
    </div>
  );
}

