import { apiRequest } from "@/api/client";
import { DocumentDetail, DocumentSummary, PaginatedResponse } from "@/types/api";

export function getDocuments(token: string, params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) search.set(key, String(value));
  });
  return apiRequest<PaginatedResponse<DocumentSummary>>(`/documents?${search.toString()}`, { token });
}

export function getDocument(token: string, documentId: string) {
  return apiRequest<DocumentDetail>(`/documents/${documentId}`, { token });
}

export function getReviewQueue(token: string) {
  return apiRequest<PaginatedResponse<DocumentSummary>>("/documents/review-queue", { token });
}

export function createUploadUrl(
  token: string,
  payload: {
    filename: string;
    file_size_bytes: number;
    file_format: string;
    tags?: string[];
    custom_metadata?: Record<string, unknown>;
  }
) {
  return apiRequest<{ document_id: string; upload_url: string; object_key: string }>("/documents/upload-url", {
    method: "POST",
    token,
    body: JSON.stringify(payload)
  });
}

export function confirmUpload(token: string, documentId: string) {
  return apiRequest(`/documents/${documentId}/confirm-upload`, {
    method: "POST",
    token
  });
}

