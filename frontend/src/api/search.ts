import { apiRequest } from "@/api/client";
import { QAResponse, SearchResponse } from "@/types/api";

export function searchDocuments(token: string, payload: Record<string, unknown>) {
  return apiRequest<SearchResponse>("/search", {
    method: "POST",
    token,
    body: JSON.stringify(payload)
  });
}

export function askQuestion(token: string, payload: Record<string, unknown>) {
  return apiRequest<QAResponse>("/qa/ask", {
    method: "POST",
    token,
    body: JSON.stringify(payload)
  });
}

