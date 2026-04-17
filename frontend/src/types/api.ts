export interface UserProfile {
  id: string;
  org_id: string;
  email: string;
  display_name?: string | null;
  permissions: string[];
}

export interface DocumentSummary {
  id: string;
  org_id: string;
  original_filename: string;
  file_format: string;
  status: string;
  validation_status?: string | null;
  overall_extraction_confidence?: number | null;
  created_at: string;
}

export interface ExtractedField {
  id: string;
  field_name: string;
  field_display_name?: string | null;
  raw_value?: string | null;
  normalized_value?: Record<string, unknown> | null;
  confidence: number;
  extraction_method?: string | null;
  source_page_number?: number | null;
  source_bbox?: Record<string, unknown> | null;
  source_text?: string | null;
  is_reviewed: boolean;
  is_corrected: boolean;
}

export interface ValidationResult {
  id: string;
  rule_id: string;
  status: string;
  severity?: string | null;
  message?: string | null;
}

export interface DocumentDetail extends DocumentSummary {
  page_count?: number | null;
  classification_confidence?: number | null;
  tags: string[];
  extracted_fields: ExtractedField[];
  validation_results: ValidationResult[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface SearchResult {
  chunk_text: string;
  document_id: string;
  document_name: string;
  page_number: number;
  relevance_score: number;
  highlighted_text: string;
  matched_fields: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  total_estimated: number;
  latency_ms: number;
  search_query_id: string;
}

export interface QAResponse {
  answer: string;
  confidence: "low" | "medium" | "high";
  citations: Array<{
    document_id: string;
    document_name: string;
    page_number: number;
    excerpt: string;
  }>;
  latency_ms: number;
}

export interface AnalyticsOverview {
  documents_processed_today: number;
  documents_processed_month: number;
  avg_processing_time_s: number;
  avg_extraction_confidence: number;
  review_queue_depth: number;
  auto_approval_rate: number;
  cost_estimate_month: number;
  corrections_recorded: number;
}

export interface WorkflowDefinition {
  id: string;
  org_id: string;
  name: string;
  description?: string | null;
  trigger_config: Record<string, unknown>;
  conditions: Array<Record<string, unknown>>;
  actions: Array<Record<string, unknown>>;
  is_active: boolean;
}

