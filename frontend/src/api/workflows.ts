import { apiRequest } from "@/api/client";
import { WorkflowDefinition } from "@/types/api";

export function getWorkflows(token: string) {
  return apiRequest<{ items: WorkflowDefinition[] }>("/workflows", { token });
}

