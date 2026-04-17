# DocIQ — Enterprise AI Document Intelligence Platform
## Complete Technical & Product Blueprint

---

# 1. Executive Summary

DocIQ is a production-grade enterprise platform that transforms unstructured organizational documents into structured, searchable, validated, and actionable intelligence. It is built for mid-to-large enterprises that process high volumes of documents — invoices, contracts, KYC packets, compliance forms, reports — and currently rely on manual review, fragile RPA scripts, or disconnected OCR tools that produce raw text dumps with no semantic understanding.

**The core value proposition:** DocIQ does not just extract text from documents. It understands what the document *means*, what data *matters*, whether that data is *trustworthy*, and what *action* should happen next.

**Who is it for:** Accounts payable teams drowning in invoices, legal departments reviewing contracts, compliance officers processing KYC, HR teams handling onboarding paperwork, and operations teams dealing with any high-volume document workflow.

**Why it is valuable:**
- A typical enterprise AP team processes 50,000–500,000 invoices per year at an average manual cost of $12–$15 per invoice. DocIQ can reduce processing costs by 70–80%.
- KYC document review currently takes 2–5 days per client. DocIQ reduces this to minutes with a human verification fallback.
- Contract analysis that takes a paralegal 4–6 hours can be surfaced as a structured risk summary in under 2 minutes.
- The platform is not a point solution; it is an extensible AI backbone that can be trained on organization-specific document types and workflows.

---

# 2. Core Product Vision

## The Real-World Business Problem

Every enterprise has a document problem. Documents arrive via email, web upload, scanner, fax, API feed, and third-party systems. They are heterogeneous — some PDFs are digital-native with clean text layers, others are scanned paper with skew and noise. Some are templated (invoice from Vendor A always looks the same), others are free-form (contracts negotiated clause by clause).

The standard response is a combination of: people manually keying data into ERP systems, rules-based automation that breaks when formats change, and generic OCR tools that return character soup without structure. None of this scales. None of this learns. None of this integrates with downstream systems meaningfully.

## Target Users and Personas

**1. The Operations Analyst (Primary User)**
Role: Processes documents day-to-day, reviews extraction results, corrects errors, approves or rejects documents. Needs speed, accuracy, and a clear review interface. Hates false positives and mystery errors.

**2. The Compliance Officer**
Role: Needs audit trails, validation evidence, chain-of-custody on document handling. Needs to produce evidence that documents were processed correctly. Cares deeply about data retention policies and access control.

**3. The IT/Platform Engineer (Integrator)**
Role: Connects DocIQ to downstream systems — ERP, CRM, HRMS, contract lifecycle management tools. Needs a clean REST API, webhook system, and well-documented schema.

**4. The Data/AI Team**
Role: Wants to extend extraction models, create new document types, monitor model accuracy, and feed corrections back into training.

**5. The C-Suite/Finance Sponsor**
Role: Needs an ROI dashboard, processing SLA metrics, cost-per-document trending, and error rates.

## Primary Document Types Supported

| Category | Examples |
|---|---|
| Financial | Invoices, receipts, purchase orders, bank statements, expense claims |
| Legal | Contracts, NDAs, MSAs, SLAs, amendments, side letters |
| Identity/KYC | Passports, national IDs, driver's licenses, utility bills, bank letters |
| Compliance | Regulatory filings, audit reports, certificates, licenses |
| HR | Offer letters, employment agreements, payslips, tax forms (W-2, 1099) |
| Operations | Delivery notes, packing slips, customs declarations, bills of lading |
| Medical | Prescriptions, lab reports, insurance claims, referral letters |
| Internal | Meeting minutes, memos, policy documents, SOPs |

## Key Use Cases

1. **Invoice-to-Pay Automation**: Ingest invoice → extract header (vendor, date, number) + line items → validate against PO → route for approval → post to ERP
2. **Contract Intelligence**: Upload contract → extract parties, dates, obligations, risk clauses, termination terms → flag anomalies → store in searchable repository
3. **KYC Document Processing**: Upload identity documents → extract personal details → validate against expected format → check for tampering signals → push to verification workflow
4. **Regulatory Compliance Archive**: Ingest compliance filings → classify → extract key dates and obligations → alert on upcoming deadlines → produce audit reports
5. **Cross-Document Q&A**: "What are the payment terms across all our active contracts with Vendor X?" → semantic search + LLM synthesis → cited answer

## Why DocIQ Is Different from a Basic OCR Tool or Chatbot

A basic OCR tool returns text. DocIQ returns **meaning**. Specifically:

- OCR tools do not classify documents. DocIQ knows whether a document is an invoice, a contract, or a passport, and applies document-specific extraction rules.
- OCR tools do not validate. DocIQ checks whether extracted values are consistent, plausible, and match expectations.
- A basic chatbot can answer questions but cannot *cite evidence from your own document corpus* with confidence scores.
- DocIQ creates a continuously improving pipeline: every human correction becomes a training signal.
- DocIQ has a trust layer with anomaly detection, not just a raw data dump.
- DocIQ has a full workflow engine that turns document data into business actions.

---

# 3. Product Principles

**1. Accuracy Over Flashy UI**
Every design decision that trades extraction accuracy for visual polish is the wrong decision. The product earns trust by being right. A beautiful dashboard that shows wrong numbers will be abandoned.

**2. Traceability by Default**
Every extracted value must be traceable to its source: the exact bounding box on the exact page of the exact document version. Users should be able to click an extracted field and see the document region it came from, highlighted. This is non-negotiable for enterprise compliance.

**3. Confidence-First Design**
The system must communicate uncertainty clearly. A field extracted with 60% confidence must look different from one at 98%. Users should never be misled into trusting a low-confidence result. The UI surfaces confidence as a first-class citizen.

**4. Human-in-the-Loop by Architecture**
The system is not a black box that replaces humans. It is an accelerator for human judgment. Every pipeline must have a fallback to human review. Every model decision must be correctable. The system learns from corrections.

**5. Enterprise Readiness From Day One**
Multi-tenancy, RBAC, audit logs, encryption, and SLA-aware processing are not afterthoughts. They are in the design from the first commit.

**6. Modularity**
The AI pipeline stages are independently deployable and replaceable. Adding a new document type should not require rewriting the extraction engine. The workflow engine is decoupled from the extraction pipeline.

**7. Observability as a Feature**
Processing time per stage, extraction confidence distribution, error rates by document type, and human correction rates are all first-class metrics. The operations team can see exactly where the pipeline is struggling.

**8. Minimal Blast Radius**
A failure in the workflow engine must not take down document ingestion. A slow OCR job must not block the search API. Services fail independently and degrade gracefully.

**9. Future AI Extensibility**
The platform must be able to absorb new AI capabilities — multimodal models, fine-tuned extractors, specialized classifiers — without architectural surgery.

---

# 4. End-to-End User Journey

This section traces the complete lifecycle of a document from upload to final output, in precise sequential order.

## Step 1: Upload

**Actor:** Operations Analyst via web UI, or an external system via REST API, or an email ingestion trigger.

**What happens:**
- User drags a file (or batch of files) into the upload center. Supported formats: PDF, PNG, JPG, TIFF, DOCX, XLSX, HTML.
- Client validates file type and size (max configurable, default 50 MB per file) before sending.
- File is uploaded directly to a pre-signed S3 URL (bypassing the API server for large file performance). The API server generates the pre-signed URL and associates a `document_id`.
- The raw file is stored at `s3://dociq-raw/{org_id}/{year}/{month}/{document_id}/{original_filename}`.
- An `IngestJob` record is created in PostgreSQL with status `PENDING`.
- A message is enqueued to the `document.ingestion` topic on Redis Streams (or RabbitMQ in higher-scale deployments).
- The UI immediately shows the document in a "Processing" state with a progress indicator.

**Error cases:**
- Corrupted file: rejected at upload validation with a clear error message.
- Unsupported format: rejected immediately.
- Network failure: pre-signed URL approach means partial uploads can be retried from the client.

## Step 2: Preprocessing

**Actor:** Preprocessing Worker (Python service)

**What happens:**
- Worker picks up the message from the queue.
- Downloads the raw file from S3.
- For PDFs: checks whether the PDF has a text layer (digital-native) or is image-only (scanned). This is determined by extracting text via PyMuPDF and checking whether the text density is above a threshold (e.g., 20 characters per page average). Digital-native PDFs skip OCR.
- For image-only PDFs and raw image files: each page is extracted as a high-resolution PNG (300 DPI minimum) using PyMuPDF for PDFs and PIL/Pillow for images.
- Preprocessing steps applied per page image:
  - **Deskew**: Detect and correct rotation using Leptonica (via pytesseract's OSD) or a custom CNN-based angle predictor for complex skew. Documents from scanners often arrive at 1–5 degree skew; contracts can arrive rotated 90 degrees.
  - **Denoising**: Apply OpenCV fastNlMeansDenoising to reduce scanner noise, salt-and-pepper artifacts, and background texture. Threshold: only if signal-to-noise ratio is below a computed metric.
  - **Binarization**: Adaptive thresholding (OpenCV adaptiveThreshold with ADAPTIVE_THRESH_GAUSSIAN_C) to produce clean black-and-white images for OCR. Sauvola thresholding for documents with uneven lighting.
  - **Shadow removal**: For mobile-captured documents, detect and remove shadow gradients using a background subtraction approach.
  - **Contrast enhancement**: CLAHE (Contrast Limited Adaptive Histogram Equalization) for low-contrast documents.
- Preprocessed page images are stored to S3 at `s3://dociq-processed/{org_id}/{document_id}/pages/`.
- A `DocumentPage` record is created per page with status `PREPROCESSED`.
- The document status is updated to `OCR_PENDING`.
- A new message is enqueued for the OCR stage.

## Step 3: OCR

**Actor:** OCR Worker

**What happens:**
- For digital-native PDFs: PyMuPDF extracts text with full positional data (character bounding boxes). This is fast (milliseconds) and highly accurate.
- For image-based pages: PaddleOCR (with the PP-OCRv4 model) performs OCR. PaddleOCR is chosen because it handles multi-language text, table structures, and dense layouts better than Tesseract 5 for modern documents. Tesseract 5 is retained as a fallback for simple single-column text.
- PaddleOCR returns: text lines, confidence scores per character, and bounding boxes in (x, y, width, height) format.
- The raw OCR output is stored as a structured JSON object per page in PostgreSQL (`ocr_outputs` table): text content, bounding boxes, line groupings, and per-character confidences.
- Page-level OCR confidence is computed as the mean confidence of all character-level predictions. Pages with mean confidence below 0.70 are flagged for potential quality issues.
- A `page_ocr_confidence` score is stored per page.
- The overall document OCR confidence is the weighted average across pages.
- Document status → `LAYOUT_ANALYSIS_PENDING`.

## Step 4: Layout Analysis

**Actor:** Layout Analysis Worker

**What happens:**
- The layout analysis stage understands the *structure* of each page: what is a header, paragraph, table, form field, signature block, or footer.
- **Tool:** Microsoft's LayoutLMv3 or, preferably, the PaddleOCR PP-StructureV2 pipeline, which integrates OCR + layout detection in one pass. For production, the Unstructured.io library is used as an orchestration layer that wraps these models and normalizes output.
- The layout model produces a list of `LayoutElement` objects per page: type (Title, Header, Table, ListItem, NarrativeText, FormField, Image, Signature), bounding box, and text content.
- Table detection: Tables are identified and their structure (rows, columns, cell content) is extracted using the PaddlePaddle table recognition module or camelot-py for digital PDFs. Cell content is normalized into a 2D array with row/column indices.
- Form field detection: For structured forms (e.g., W-2s, KYC forms), key-value pairs within form regions are extracted using form understanding models. The output is a flat list of `{label: value, label_bbox: [...], value_bbox: [...], confidence: 0.92}` entries.
- All layout elements are stored per page in the `document_pages` table as a JSONB column.
- Document status → `EXTRACTION_PENDING`.

## Step 5: Document Classification

**Actor:** Classification Worker (runs in parallel with or immediately after Layout Analysis)

**What happens:**
- A multi-modal classifier determines the document type from a predefined taxonomy (Invoice, Contract, KYC_Passport, KYC_DriverLicense, Bank Statement, etc.). The taxonomy is per-organization and extensible.
- The classifier uses a fine-tuned DistilBERT or DeBERTa model trained on text features (first 512 tokens) combined with layout features (element type distribution, page count, keyword presence).
- Output: `{document_type: "invoice", confidence: 0.97, alternative: [{type: "purchase_order", confidence: 0.02}]}`
- If confidence is below 0.75, a `CLASSIFICATION_REVIEW` flag is set and the document is placed in the human review queue for type assignment. The assigned type is then stored back and the pipeline resumes.
- The document's `document_type_id` field is updated in the `documents` table.

## Step 6: Structured Data Extraction

**Actor:** Extraction Worker

**What happens:**
- With the document type now known, the extraction engine loads the **ExtractionSchema** for that document type. An ExtractionSchema is an organization-configurable definition of what fields to extract, their data types, whether they are required, and extraction hints.
- Two extraction modes operate simultaneously and their results are merged:

**Mode A: Rule-Based Extraction**
- For known vendors or document templates, regex patterns and positional rules are applied. For example, "Vendor A invoices always have the invoice number at line 3, right-aligned, matching pattern `INV-\d{6}`".
- This is fast and highly accurate for templated documents.

**Mode B: LLM-Based Extraction**
- The document text (with layout context) is sent to a structured extraction prompt against GPT-4o-mini (for cost efficiency) or a self-hosted Mistral 7B fine-tuned on the organization's documents.
- The LLM is given the ExtractionSchema as a JSON Schema and instructed to return a structured JSON response.
- The prompt includes layout hints (e.g., "The table starting at position [x, y] contains line items") to prevent the LLM from hallucinating values.
- The LLM returns: field name, extracted value, the text span it was sourced from, and its own confidence estimate.

**Merging:**
- Rule-based results are trusted at higher confidence than LLM results when they agree.
- When they disagree, the conflict is flagged for review.
- Final extracted fields are stored in the `extracted_fields` table with source (rule/llm), bounding box reference, confidence score, and raw value.

- Document status → `VALIDATION_PENDING`.

## Step 7: Validation

**Actor:** Validation Worker

**What happens:**
- Each extracted field is validated against the rules defined in the document type's ValidationSchema.
- Validation categories:
  1. **Format validation**: Is the invoice date a valid date? Is the amount a valid number? Is the tax ID in the correct format?
  2. **Range validation**: Is the invoice amount within plausible bounds (e.g., not negative, not above $10M without special flag)?
  3. **Cross-field consistency**: Total = Sum(line items)? Invoice date <= Due date? Does the currency code match the amount format?
  4. **External reference validation**: Does the PO number referenced in the invoice exist in the connected ERP system? Is the vendor ID known?
  5. **Duplicate detection**: Is there another document in the system with the same (vendor_id, invoice_number) combination?
  6. **Anomaly detection**: Is the invoice amount more than 3 standard deviations from the mean invoice amount for this vendor? Is the payment terms field present but different from the master vendor record?

- Validation results are stored per field and per document in the `validation_results` table.
- A document-level validation status is computed: `PASSED`, `PASSED_WITH_WARNINGS`, `FAILED`, `REVIEW_REQUIRED`.
- Documents with `FAILED` or `REVIEW_REQUIRED` status go to the human review queue.
- Documents with `PASSED` or `PASSED_WITH_WARNINGS` can proceed to workflow automation.

## Step 8: Embedding Generation and Storage

**Actor:** Embedding Worker (runs asynchronously after extraction)

**What happens:**
- The full document text (post-OCR, layout-normalized) is chunked into overlapping segments. Chunking strategy: semantic chunking using a sliding window of 512 tokens with 64-token overlap, with hard breaks at section boundaries identified by the layout analysis.
- Each chunk is embedded using `text-embedding-3-small` (OpenAI) or `nomic-embed-text` (self-hosted, free). The embedding model choice is configurable per deployment.
- Each chunk embedding is stored in Qdrant (vector database) with payload metadata: `document_id`, `org_id`, `page_number`, `chunk_index`, `document_type`, `extracted_date`, `text_preview`.
- A dense index (for semantic search) and a sparse index (BM25 for keyword matching) are maintained in Qdrant's hybrid search mode.
- Document status → `READY`.

## Step 9: Human Review (Conditional)

**Actor:** Operations Analyst in the Review Queue UI

**What happens:**
- Documents that require review appear in the Review Queue, sorted by priority (failed validations first, then low-confidence documents, then classification reviews).
- The reviewer sees the document in a split-pane view: original document on the left, extracted fields on the right. Low-confidence fields are highlighted in amber.
- The reviewer can:
  - Accept a field value (increases confidence).
  - Correct a field value (old value, new value, and correction reason stored).
  - Reject the document (with reason).
  - Reclassify the document type.
  - Add comments.
- All corrections are stored in the `feedback_entries` table.
- Upon approval, the document status moves to `APPROVED` and the workflow trigger fires.

## Step 10: Workflow Trigger

**Actor:** Workflow Engine

**What happens:**
- When a document reaches `APPROVED` status (or `PASSED` for auto-approve configured workflows), the Workflow Engine evaluates which workflows are applicable based on document type, field values, and organizational rules.
- Example: An invoice with an amount > $10,000 triggers the "Manager Approval" workflow. An invoice <= $10,000 triggers the "Auto-Post to ERP" workflow.
- The Workflow Engine creates a `WorkflowRun` record and begins executing action steps: send webhook to ERP, notify approver via email, create a task in the connected ticketing system.
- Each action is logged. Failures are retried with exponential backoff.

## Step 11: Semantic Search and Q&A

**Actor:** Any authenticated user

**What happens:**
- The user types a natural language query into the search bar or the Q&A assistant.
- For search: the query is embedded and a hybrid search (dense + sparse) is executed against Qdrant, filtered by the user's `org_id` and any document type or date filters applied.
- Top-k chunks (k=10–20) are retrieved and re-ranked using a cross-encoder model.
- Results are returned with source citations (document name, page number, highlighted excerpt).
- For Q&A: the top-k retrieved chunks are assembled into a context window and sent to GPT-4o with a system prompt instructing it to answer using only the provided context and to cite sources.
- The response includes: the answer text, confidence level, and inline citations linking back to specific document pages.

## Step 12: Feedback Capture

**Actor:** Any user who interacts with extracted data or Q&A results

**What happens:**
- On any extracted field, users can click a "thumbs up" or "flag" to mark accuracy.
- On Q&A responses, users can rate the answer and provide free-text corrections.
- All feedback is stored in `feedback_entries` with full context (model version used, chunk IDs, extracted field IDs).
- Feedback is aggregated and surfaced in the Admin Analytics dashboard.
- High-error fields and document types are automatically prioritized for model retraining signals.

---

# 5. System Architecture

## Architecture Philosophy: Modular Monolith First

DocIQ should start as a **modular monolith**, not a microservices architecture. Here is the exact reasoning:

A microservices architecture for a v1 system with a team of 3–8 engineers introduces: network overhead, distributed tracing complexity, service discovery, inter-service authentication, and deployment coordination — before the product has found its shape. The extraction pipeline alone will go through multiple iterations of stage reordering, parameter tuning, and model swapping. Doing this across 8 deployed services is expensive friction.

A modular monolith deploys as one application but is internally structured as independent modules with clear boundaries: each module has its own services, repositories, and interfaces. Modules communicate through well-defined internal interfaces, not network calls. This means transitioning to microservices later is a matter of extracting modules and wrapping them with HTTP or gRPC interfaces — structural work, not rewrites.

**When to split into services (Phase 3–4):**
- The OCR/preprocessing workers become their own service first, because they are compute-intensive and need independent scaling.
- The Embedding Worker is extracted next (GPU dependency).
- The Workflow Engine is extracted when it becomes complex enough to warrant its own deployment lifecycle.

## Architecture Diagram Description

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                  │
│  Web App (React)  │  Mobile (future)  │  External APIs/Webhooks │
└────────────┬────────────────────────────────────────────────────┘
             │ HTTPS
┌────────────▼────────────────────────────────────────────────────┐
│                    API GATEWAY / LOAD BALANCER                  │
│              (Nginx / AWS ALB / Cloudflare)                     │
└────────────┬────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────────────┐
│                    FASTAPI APPLICATION SERVER                   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │  Auth Module │  │ Doc Module   │  │  Search/Q&A Module     │ │
│  │  (JWT+RBAC)  │  │ (CRUD+Upload)│  │  (Qdrant + LLM)        │ │
│  └──────────────┘  └──────────────┘  └────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │ Workflow Mod │  │ Analytics Mod│  │  Feedback Module       │ │
│  │              │  │              │  │                        │ │
│  └──────────────┘  └──────────────┘  └────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │ Enqueue Jobs
┌────────────────────────▼────────────────────────────────────────┐
│                     MESSAGE QUEUE (Redis Streams / RabbitMQ)    │
│  Topics: document.ingestion │ ocr.queue │ extraction.queue      │
│          embedding.queue │ validation.queue │ workflow.queue     │
└──────┬──────────┬──────────────┬──────────────┬─────────────────┘
       │          │              │              │
┌──────▼──┐ ┌────▼──────┐ ┌─────▼────┐  ┌─────▼──────────────────┐
│Preproc  │ │OCR Worker │ │Extraction│  │  Embedding Worker      │
│Worker   │ │(PaddleOCR)│ │Worker    │  │  (GPU-bound)           │
│(OpenCV) │ │           │ │(LLM+Rule)│  │                        │
└──────┬──┘ └────┬──────┘ └─────┬────┘  └─────┬──────────────────┘
       │         │              │              │
┌──────▼─────────▼──────────────▼──────────────▼──────────────────┐
│                  DATA LAYER                                      │
│                                                                  │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐  │
│  │  PostgreSQL 16      │    │  Qdrant (Vector DB)             │  │
│  │  - Primary OLTP DB  │    │  - Dense + Sparse indices       │  │
│  │  - All core tables  │    │  - Filtered search by org       │  │
│  │  - JSONB for flex   │    │  - Payload metadata             │  │
│  └─────────────────────┘    └─────────────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐  │
│  │  Redis              │    │  AWS S3 / MinIO (Self-hosted)   │  │
│  │  - Queue backbone   │    │  - Raw files (immutable)        │  │
│  │  - Rate limiting    │    │  - Processed pages              │  │
│  │  - Session cache    │    │  - Thumbnails                   │  │
│  └─────────────────────┘    └─────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   OBSERVABILITY STACK                           │
│   Prometheus + Grafana │ Sentry (errors) │ OpenTelemetry traces │
│   Structured JSON logs → CloudWatch / Loki                      │
└─────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

**API Server (FastAPI):**
- Handles all HTTP requests from the web client and external integrators.
- Generates pre-signed S3 URLs for uploads.
- Creates database records and enqueues messages.
- Does NOT do any heavy computation synchronously.
- Enforces RBAC on every endpoint.
- Maximum response time target: 200ms for read endpoints, 500ms for write endpoints that trigger async work.

**Workers:**
- Independent Python processes (or containers) that consume messages from the queue.
- Each worker type is independently scalable.
- Workers are idempotent: processing the same message twice must not produce duplicate records (achieved via database unique constraints and job status checks).

**PostgreSQL:**
- Source of truth for all structured data.
- Stores extraction results, job status, user data, organization data, workflow definitions, audit logs.
- JSONB columns used for flexible schema within extracted fields and layout data.
- UUID primary keys throughout (for distributed safety).

**Qdrant:**
- Stores chunk embeddings and enables sub-100ms semantic search.
- Each collection is per-organization for hard data isolation.
- Hybrid search mode: combines dense vector similarity with BM25 sparse keyword scores.

**Redis:**
- Message queue backbone using Redis Streams (XADD/XREAD/XACK pattern).
- Session caching (JWT blacklisting, rate limit counters).
- Worker heartbeat tracking.
- NOT used as a primary database; data durability is in PostgreSQL.

**File Storage (S3/MinIO):**
- Immutable raw file storage with versioning enabled.
- Processed page images stored separately.
- Pre-signed URLs (15-minute TTL) served to clients for document viewing.
- Server-side encryption (SSE-S3 or SSE-KMS).

---

# 6. Preferred Tech Stack

## Frontend

**Framework: React 19 with Next.js 15**
- Justification: The DocIQ web app is a complex, data-dense SPA with multiple distinct sections (viewer, search, analytics). Next.js provides server components for fast initial loads, App Router for clean page structure, and React Server Actions for streamlined form handling. The ecosystem (hooks, component libraries, testing) is the most mature.
- Alternative considered: SvelteKit — excellent performance, but smaller ecosystem and fewer enterprise UI component libraries compared to React.

**Styling: Tailwind CSS 4 + shadcn/ui**
- Tailwind for utility-first rapid styling. shadcn/ui (Radix UI primitives + Tailwind) for unstyled, accessible base components (Dialog, Popover, Table, etc.) that can be completely customized.
- NOT using a full component library like Ant Design or MUI — they impose too much visual and API opinion for an enterprise product that needs a custom look.

**State Management: Zustand (client state) + TanStack Query v5 (server state)**
- TanStack Query handles all server data fetching: caching, background refetching, optimistic updates, pagination. This eliminates 80% of what people reach for Redux for.
- Zustand handles the remaining client-only state: active document viewer state, UI toggles, multi-step form wizard state. Simpler and less boilerplate than Redux.

**Document Viewer: react-pdf (for PDF rendering) + custom annotation layer**
- PDF.js under the hood. The annotation layer (bounding box overlays for extracted fields) is custom-built using absolute-positioned SVG overlays keyed to page dimensions.

## Backend

**Framework: FastAPI (Python 3.12)**
- Justification: Python is non-negotiable for DocIQ because the AI/ML ecosystem lives in Python. Using Python on the backend eliminates the language boundary between API logic and ML pipeline logic. FastAPI is async-native, has automatic OpenAPI generation, and excellent performance for an I/O-bound web server. Pydantic v2 (built into FastAPI) provides the schema validation layer.
- Alternative considered: Go for the API server (faster, lower memory) — rejected because the cognitive overhead of maintaining two languages (Go API + Python ML) in a small team is not worth the marginal performance gain.

**Workers: Celery with Redis broker + result backend**
- Celery provides task routing (different queues for different worker types), retry logic, task prioritization, and a mature monitoring UI (Flower).
- In Phase 1, workers and API server share the same codebase as a modular monolith. In later phases, workers are extracted.

**Task Queue: Redis Streams (Phase 1) → RabbitMQ (Phase 3+)**
- Redis Streams is simple to operate and sufficient for moderate throughput. Migration to RabbitMQ provides better consumer group semantics, dead letter exchanges, and message TTL for high-scale deployments.

## Databases

**Primary DB: PostgreSQL 16**
- Justification: ACID compliance, excellent JSONB support (for flexible extraction results), mature ecosystem, PgVector extension if needed for lightweight vector operations, native full-text search as a complement to Qdrant. Run on RDS PostgreSQL in AWS or Supabase for managed hosting.
- Schema uses multi-tenancy via `org_id` column on every tenant-scoped table (shared database, shared schema model with row-level security via PostgreSQL RLS policies).

**Vector DB: Qdrant**
- Justification: Qdrant is open-source (self-hostable, important for enterprise data residency requirements), supports hybrid search natively (dense + sparse BM25), has a clean Python client, payload-based filtering, and performance at millions of vectors. Competes well with Pinecone and Weaviate.
- Alternative: Weaviate (more complex, heavier). Pinecone (managed, great performance, but vendor lock-in and data residency concerns).
- One Qdrant collection per organization, or per document type per organization for large deployments.

**Cache: Redis 7**
- Session management (JWT refresh token store), rate limiting (sliding window counter per API key), hot-document metadata cache.

## AI/ML

**OCR: PaddleOCR (PP-OCRv4) as primary, Tesseract 5 as fallback**
- PaddleOCR handles complex layouts, tables, and multi-language. Tesseract 5 for simple single-column clean documents.
- AWS Textract is a valid managed alternative for organizations that prefer no on-prem ML infrastructure — it handles forms and tables well but adds per-page cost and data residency complexity.

**Image Preprocessing: OpenCV 4 + PIL/Pillow**
- Standard choice. No real alternative needed.

**Layout Detection: Unstructured.io (orchestration) + PP-StructureV2 (models)**
- Unstructured.io normalizes output from multiple models and handles PDF/image/DOCX inputs uniformly. It also handles the transition between digital-native and image-based PDFs transparently.

**NLP/LLM:**
- Extraction reasoning: GPT-4o-mini (primary for cloud deployments), Mistral 7B Instruct (self-hosted via vLLM for air-gapped deployments).
- Embeddings: `text-embedding-3-small` (OpenAI) or `nomic-embed-text` (self-hosted).
- Q&A synthesis: GPT-4o (for quality) or Llama 3.1 70B via Groq API (for speed + cost).
- Fine-tuned extraction models (Phase 3+): DeBERTa-v3-base fine-tuned on organization-specific documents using HuggingFace transformers + PEFT (LoRA adapters).

**Document Classification: Fine-tuned DistilBERT or DeBERTa-v3-small**
- Trained on a labeled dataset of document types. Inference runs in <100ms on CPU.

## Infrastructure

**Containerization: Docker + Docker Compose (dev) → Kubernetes (production)**
- Each service (API, workers, Qdrant) runs in Docker. Docker Compose for local development. Kubernetes (EKS or GKE) for production, with Helm charts for deployment management.

**Cloud: AWS (primary recommendation)**
- EKS for Kubernetes, RDS PostgreSQL, ElastiCache Redis, S3, CloudFront (for pre-signed URL caching), SES (email notifications), KMS (encryption keys), Secrets Manager.
- Self-hosted alternative: Any Kubernetes cluster + MinIO + managed PostgreSQL.

**Monitoring: Prometheus + Grafana + Sentry + OpenTelemetry**
- Prometheus scrapes metrics from all services. Grafana for dashboards. Sentry for error tracking and performance monitoring. OpenTelemetry for distributed tracing across the async pipeline.

**Authentication: JWT (short-lived access tokens) + Refresh tokens + OAuth2 (SSO)**
- Access tokens: 15-minute TTL. Refresh tokens: 7-day TTL, stored in HTTP-only cookie, invalidated on logout (stored in Redis as a blacklist).
- SSO: OAuth2/OIDC integration with Google Workspace, Microsoft Entra ID (Azure AD), Okta for enterprise customers.
- SAML 2.0 support in Phase 4 for legacy enterprise identity providers.

---

# 7. AI Pipeline Design

## Stage 1: Image Preprocessing

**Input:** Raw document file (PDF, image, DOCX)
**Output:** Cleaned, standardized page images at 300 DPI in grayscale PNG format

**Purpose:** Normalize all document inputs to a consistent quality level that maximizes OCR accuracy.

**Step-by-step processing:**

1. **Format normalization:** Convert PDFs to per-page images using PyMuPDF at 300 DPI. Convert DOCX to PDF first using LibreOffice headless, then process as PDF.

2. **Skew detection and correction:**
   - Method: Compute the Hough line transform on the binarized image to detect the dominant line angle. Correct rotation using `cv2.getRotationMatrix2D`. Handles skew from -45° to +45°.
   - For 90°/180° flipped pages, use Tesseract's OSD (orientation and script detection) first.
   - Failure mode: Documents with complex backgrounds or diagonal design elements can produce incorrect skew estimates. Mitigation: Cap maximum correction angle at 10° unless OSD confirms a larger angle.

3. **Noise reduction:**
   - Apply `cv2.fastNlMeansDenoising` with `h=10` for light noise, `h=20` for heavy scanner noise.
   - Trigger condition: Compute the Laplacian variance as a sharpness proxy. If variance < 100, apply denoising.
   - Failure mode: Over-denoising blurs fine text. Mitigation: Use conservative `h` values and check post-denoising character edge sharpness.

4. **Binarization:**
   - Sauvola adaptive thresholding (better than Otsu for uneven lighting): window size 25px, k=0.2.
   - Failure mode: Documents printed on colored paper can produce poor binarization. Mitigation: Apply color channel selection before binarization (use the channel with highest contrast).

5. **Shadow removal:**
   - Compute a low-frequency background estimate using morphological dilation with a large kernel (50px), divide the original image by the background estimate, re-normalize.
   - Apply for documents captured with mobile cameras (detected by metadata or aspect ratio heuristics).

6. **Image quality scoring:**
   - Compute a composite quality score: blur score (Laplacian variance), contrast score, OCR-specific signal-to-noise estimate.
   - Quality score stored per page; pages below threshold 0.4 flagged as `LOW_QUALITY`.

**Failure modes and mitigations summary:**
| Failure | Detection | Mitigation |
|---|---|---|
| Over-skew correction | Post-correction line angle check | Retry with smaller max angle |
| Over-denoising | Edge sharpness check | Reduce h parameter |
| Poor binarization | Text pixel density check | Try alternative threshold method |
| Corrupted image | PIL cannot open file | Reject with clear error |

## Stage 2: OCR

**Input:** Preprocessed page images (300 DPI grayscale PNG)
**Output:** Structured OCR result JSON: `{lines: [{text, bbox, confidence}], words: [{text, bbox, confidence}], page_confidence: float}`

**Purpose:** Convert image content to machine-readable text with spatial positioning.

**Processing:**

PaddleOCR PP-OCRv4 pipeline:
1. Text detection: DB (Differentiable Binarization) model detects text regions as polygons.
2. Text recognition: SVTR (Scene Text Recognition Transformer) model recognizes text within each detected region.
3. Character-level confidence scores are aggregated to word and line level.

**Confidence calibration:**
Raw model confidence scores are overconfident. Apply Platt scaling calibration (trained on a held-out validation set of known documents) to produce calibrated probabilities.

**Multi-language handling:**
PaddleOCR supports 80+ languages. Language is detected per document using the `langdetect` library on the first 200 words, and the appropriate PaddleOCR language model is loaded.

**Digital-native PDF fast path:**
Use PyMuPDF's `get_text("rawdict")` which returns character-level bounding boxes and text without running image-based OCR. This is used for PDFs where the text layer exists. Confidence is set to 0.99 for digital-native text (known ground truth).

**Failure modes:**
| Failure | Detection | Mitigation |
|---|---|---|
| Low text detection recall | Coverage ratio < 0.6 of expected text area | Retry with Tesseract 5 |
| Garbled text (wrong language) | Language detection disagreement | Re-run with detected language model |
| Tables detected as prose | Layout stage disagrees | Pass raw OCR to table extraction |
| Very low confidence | Page confidence < 0.50 | Flag for human review, do not proceed to extraction |

## Stage 3: Layout Analysis

**Input:** OCR output + original page image
**Output:** List of `LayoutElement` objects: `{element_type, bbox, text, table_data, confidence}`

**Purpose:** Understand document structure — what is a title, what is a paragraph, what is a table, what is a form field.

**Processing:**

PP-StructureV2 pipeline:
1. Layout detection model (based on PicoDet, fast and accurate): identifies regions and classifies them as Text, Title, Figure, Table, or List.
2. Table structure recognition model: for regions classified as Table, identifies rows, columns, and cell boundaries. Outputs a `List[List[str]]` 2D array.
3. Form key-value extraction: regions containing key-value patterns (label: value) are processed by a specialized model that aligns labels to their values even when they span multiple columns.

**Table extraction detail:**
- Cell merging: handles rowspan/colspan via structural analysis of detected cell boundaries.
- Empty cell detection: cells with no OCR content are marked as empty (not skipped, as position matters).
- Confidence per cell: average of OCR confidence of words within the cell.
- Output format: `{headers: [...], rows: [[cell, cell, ...], ...], confidence: 0.88}`

**Failure modes:**
| Failure | Detection | Mitigation |
|---|---|---|
| Table detected as text | Row/column structure not found | Fall back to regex-based table detection on raw OCR text |
| Multi-column layout confused | Text flows incorrectly | Use reading order correction heuristic (top-to-bottom, column-by-column) |
| Header/paragraph confusion | Low confidence classification | LLM reasoning layer resolves ambiguity |

## Stage 4: Document Classification

**Input:** Full document text (first 1024 tokens), layout element type distribution, page count, filename
**Output:** `{document_type: str, confidence: float, alternatives: [...], is_ambiguous: bool}`

**Purpose:** Route the document to the correct extraction schema.

**Model:** Fine-tuned DeBERTa-v3-small on an internal training set.

**Training data construction:**
- 500–1000 labeled examples per document type (achievable in 2–4 weeks of data collection).
- Augmentation: random occlusion of header sections, text scrambling, format variations.

**Feature input:**
- Text features: first 512 tokens of document text.
- Structural features: distribution of layout element types (% text, % table, % form fields), page count, aspect ratio.
- Keyword features: presence/absence of 200 domain-specific keywords weighted by TF-IDF.

**Threshold strategy:**
- Confidence >= 0.85: auto-classify, proceed.
- 0.65 <= confidence < 0.85: classify but flag for review.
- Confidence < 0.65: send to human classification queue.

**Failure modes:**
| Failure | Detection | Mitigation |
|---|---|---|
| Unseen document type | All classes low confidence | Route to human, create new type if pattern repeats |
| Multi-type document | Two classes near-equal confidence | Segment document into sections, classify sections independently |

## Stage 5: Key-Value Extraction

**Input:** Document type schema + layout elements + full OCR text
**Output:** `{fields: [{field_name, value, raw_text, bbox, page, confidence, source: "rule|llm"}]}`

**Purpose:** Extract specific named fields from the document according to the schema.

**Rule-Based Extraction Engine:**

Each ExtractionSchema defines:
```json
{
  "document_type": "invoice",
  "fields": [
    {
      "name": "invoice_number",
      "display_name": "Invoice Number",
      "data_type": "string",
      "required": true,
      "extraction_hints": {
        "keywords": ["Invoice #", "Invoice No", "INV"],
        "pattern": "INV-[0-9]{4,8}",
        "position_hint": "top_right",
        "nearby_label": "Invoice Number"
      }
    }
  ]
}
```

The rule engine:
1. Searches for the `nearby_label` in OCR output.
2. Looks at OCR words within a 200px bounding box to the right of and below the label.
3. Applies the `pattern` regex to validate the candidate.
4. Scores the match based on label distance, pattern match quality, and positional hint adherence.

**LLM Extraction:**

Prompt template (abbreviated):
```
You are an expert document data extractor. Extract the following fields from the document below.
Return a JSON object with field_name as keys. For each field include:
- value: the extracted value
- source_text: exact text span from document
- confidence: your confidence 0.0-1.0

Schema: {extraction_schema_json}

Document text with layout context:
{document_text_with_layout_hints}
```

The LLM is called with `response_format: {type: "json_object"}` for structured output.

**Merging strategy:**
- If rule-based confidence >= 0.85 and LLM confidence >= 0.80 and values agree: use rule-based value, confidence = max(rule, llm).
- If values disagree: flag for review, show both candidates.
- If rule-based has no match but LLM does: use LLM value with lower threshold for review.
- If neither has a match for a required field: mark field as `MISSING`, trigger review.

**Failure modes:**
| Failure | Detection | Mitigation |
|---|---|---|
| LLM hallucination | Source_text not found in document | Reject LLM value, fall back to rule or human |
| Ambiguous values | Multiple candidates match | Surface all candidates in review UI |
| LLM API timeout | Timeout > 10s | Fall back to rule-only, flag for LLM retry |

## Stage 6: Named Entity Recognition (NER)

**Input:** Full document text post-OCR
**Output:** `{entities: [{text, label, start, end, confidence}]}`

**Purpose:** Extract cross-schema entities: person names, organization names, dates, monetary amounts, addresses, phone numbers, email addresses, jurisdiction names.

**Model:** SpaCy en_core_web_trf (transformer-based NER, high accuracy) for English. Multi-language support via SpaCy's language models.

**Custom entities:** Organization-specific entities (internal department codes, product codes, employee IDs) are handled via SpaCy EntityRuler with regex patterns, running before the ML NER model.

**Failure modes:**
| Failure | Detection | Mitigation |
|---|---|---|
| Name/org confusion | Low confidence entities | Conservative threshold 0.70; below this, do not assert entity type |
| OCR errors in entity text | Entity text contains unusual characters | Spell-check candidates against known entity list |

## Stage 7: Confidence Scoring and Anomaly Detection

**Input:** All extraction results, validation rules, historical data for this document type/vendor
**Output:** Per-document and per-field confidence + anomaly flags

**Confidence scoring:**
- Per-field confidence: weighted combination of OCR confidence of source region, extraction method confidence (rule/LLM), and validation pass/fail.
- Document-level confidence: minimum of all required field confidences, penalized by validation failure count.
- Confidence formula: `field_confidence = 0.4 * ocr_conf + 0.4 * extraction_conf + 0.2 * validation_score`

**Anomaly detection:**

Statistical anomaly detection per field and per vendor/document type:
- Build a running distribution of values for each (field, document_type, org_id) combination using a rolling window of the last 500 documents.
- Fields with value distributions (dates, amounts, percentages) are checked using z-score: `z = (value - mean) / std`. z > 3.0 flags as anomalous.
- Binary anomaly flags: `is_duplicate`, `is_vendor_mismatch`, `is_amount_spike`, `is_date_inconsistent`.

Machine learning anomaly detector (Phase 3):
- Isolation Forest trained on the feature vector of an entire extracted document (all field values normalized).
- Catches multi-field anomalies that statistical checks miss.

## Stage 8: Structured Output Generation

**Input:** Extracted fields + NER results + table data + validation results
**Output:** Canonical document representation: `DocumentRecord` JSON

The final `DocumentRecord` is the authoritative extracted representation of the document:
```json
{
  "document_id": "uuid",
  "document_type": "invoice",
  "extraction_confidence": 0.91,
  "fields": {
    "invoice_number": {"value": "INV-20241", "confidence": 0.98, "bbox": {...}},
    "invoice_date": {"value": "2024-03-15", "confidence": 0.95, "bbox": {...}},
    "total_amount": {"value": 15420.00, "currency": "USD", "confidence": 0.92, "bbox": {...}}
  },
  "line_items": [
    {"description": "...", "qty": 10, "unit_price": 1542.00, "amount": 15420.00}
  ],
  "entities": [{"text": "Acme Corp", "label": "ORG"}],
  "validation_status": "PASSED_WITH_WARNINGS",
  "anomaly_flags": [],
  "review_required": false
}
```

## Stage 9: LLM Reasoning Layer (Fallback and Enrichment)

This stage runs selectively:
- When extraction confidence is low (< 0.70 for a required field)
- When anomalies are detected
- When the document type is complex (contracts, legal documents) and structured extraction alone is insufficient

The LLM (GPT-4o or Llama 3.1 70B) is given the full document context and asked reasoning questions specific to the anomaly or low-confidence result:

- "The extracted invoice total (15420.00) does not match the sum of line items (14920.00). Explain what might account for this discrepancy based on the document content."
- "The contract termination date appears to be before the start date. Identify the relevant clauses and determine which date is more likely to be correct."

The LLM's reasoning is stored in `extracted_fields.llm_reasoning` and surfaced in the review UI as an explanation for reviewers.

---

# 8. RAG and Semantic Search Design

## Embedding Strategy

**Embedding model:** `text-embedding-3-small` (OpenAI) — 1536 dimensions, ~$0.00002 per 1K tokens. For self-hosted deployments: `nomic-embed-text-v1.5` (768 dimensions, runs on CPU with < 1GB RAM, competitive quality).

**What gets embedded:**
- Document chunks (primary)
- Extracted field values with their field names ("Invoice Number: INV-20241, Vendor: Acme Corp") — enables field-level semantic search
- Document-level summary (auto-generated by LLM for each document) — enables broad conceptual search

**Chunking strategy:**

Semantic chunking with layout awareness:
1. Hard splits at section boundaries identified by the layout analysis (Title elements, page breaks).
2. Within sections, use a sliding window of 512 tokens with 128-token overlap.
3. Table chunks: each table is treated as a single chunk regardless of size (tables are dense information objects and should not be split mid-row). If a table exceeds 1024 tokens, it is split at row boundaries.
4. Form field chunks: all key-value pairs from a form page are concatenated into one chunk with their labels.
5. Each chunk is enriched with a contextual header: "Document: Invoice from Acme Corp dated 2024-03-15. Section: Line Items. Content: ..."

**Why this chunking is better than fixed-size chunking:**
Fixed-size chunking (e.g., 500 characters) splits sentences mid-thought, separates related facts, and loses context about what section a chunk belongs to. Semantic chunking at layout-identified boundaries preserves semantic coherence.

## Vector Storage in Qdrant

**Collection structure:**
```
Collection: org_{org_id}_documents
Vector size: 1536 (or 768 for nomic)
Distance: Cosine

Payload fields per point:
- document_id: UUID
- chunk_index: int
- page_number: int
- document_type: string
- extraction_date: timestamp
- field_names_present: list[string]
- text_preview: string (first 200 chars)
- source_bbox: {page, x, y, w, h}
- access_tags: list[string] (for permission filtering)
```

**Sparse index (BM25):**
Qdrant's sparse vectors enable hybrid search. The BM25 sparse representation is generated using the `rank_bm25` library and stored alongside the dense vector. This allows keyword-exact matching to complement semantic matching.

## Hybrid Search Pipeline

**Query processing:**
1. User submits query string.
2. Query is embedded using the same embedding model as the corpus.
3. Query is also converted to BM25 sparse vector.
4. Qdrant hybrid search executes: `dense_score * 0.7 + sparse_score * 0.3` (tunable weights).
5. Payload filters applied: `org_id`, optionally `document_type`, `date_range`, `document_ids`.
6. Return top-20 candidates.

**Re-ranking:**
Top-20 candidates are re-ranked using a cross-encoder model (`cross-encoder/ms-marco-MiniLM-L-6-v2`) which jointly encodes the query and each candidate chunk and produces a relevance score. This is more accurate than the bi-encoder approach but too slow to run on all corpus vectors — hence the two-stage approach. After re-ranking, top-5 chunks are used.

**Why two-stage (bi-encoder → cross-encoder):**
Bi-encoder (embedding similarity) is fast (vector lookup) but less accurate. Cross-encoder is highly accurate but expensive (inference per query-document pair). Two-stage gets the best of both.

**Latency targets:**
- Embedding generation: < 50ms
- Qdrant hybrid search: < 30ms
- Cross-encoder re-ranking of top-20: < 100ms
- Total search API response: < 300ms (excluding network)

## Semantic Filters

Users can apply the following filters on the search UI, which translate to Qdrant payload filters:
- Document type (invoice, contract, etc.)
- Date range (document extraction date)
- Specific documents (by name or ID)
- Validation status (only show from approved documents)
- Access-controlled: user only sees chunks from documents they have permission to access

## Citation-Backed Answers (RAG Q&A)

**Q&A pipeline:**
1. User submits a question.
2. Hybrid search retrieves top-5 re-ranked chunks.
3. Chunks are assembled into a context window. If total tokens > 3000, chunks are trimmed from lowest-ranked.
4. Prompt is constructed:
```
You are DocIQ Assistant, an AI that answers questions based strictly on provided document excerpts.
Answer the question using ONLY the context below.
For each factual claim in your answer, cite the source chunk using [Doc: {document_name}, Page: {page}].
If the answer cannot be determined from the context, say "I don't have enough information in the provided documents."

Context:
[CHUNK 1 - Invoice from Acme Corp, Page 1, Extracted 2024-03-15]
{chunk_1_text}

[CHUNK 2 - MSA Agreement with Vendor B, Page 4]
{chunk_2_text}
...

Question: {user_question}
```
5. LLM generates answer with inline citations.
6. Citations are parsed and linked to source documents/pages in the UI.
7. Answer, chunks used, and citations stored in `search_queries` table for analytics and feedback.

**Context window management:**
- Maximum context: 4000 tokens (leaves room for system prompt + output tokens within GPT-4o-mini's window).
- Chunk prioritization when context is tight: highest re-ranker score → most recent document → first chunk of document.
- For long documents: hierarchical RAG — first retrieve at the document level (using document-level embeddings), then drill into relevant documents for chunk-level retrieval.

**Confidence in answers:**
The LLM is prompted to assess its own confidence: "Rate your confidence in this answer: High (all facts directly stated in context), Medium (facts partially supported), or Low (inferential or not clearly supported)." This is parsed and displayed in the UI.

---

# 9. Validation and Trust Layer

## Architecture Overview

The validation layer is a pluggable rule engine where validation rules are defined per document type and per organization. Rules are stored in the database (not hardcoded), allowing compliance teams to add, modify, and disable rules without a code deployment.

## Validation Rule Types

**Type 1: Format Validation**
- Each field has an expected data type and format.
- Examples: date fields must be valid ISO-8601 dates, amount fields must be positive numbers with 2 decimal places, email fields must match email regex, VAT numbers must match jurisdiction-specific patterns.
- Implementation: Pydantic validators applied to extracted field values at runtime.

**Type 2: Range and Plausibility Validation**
- Numeric fields are checked against configured min/max ranges.
- Example: Invoice amount > $0 and < $5,000,000 (configurable per organization and document type).
- Statistical plausibility: amount within 3 std deviations of historical mean for this vendor (computed on rolling basis).

**Type 3: Cross-Field Consistency Rules**
- Rules that check multiple fields against each other.
- Examples:
  - `total_amount == sum(line_items.amount) * (1 + tax_rate)` — with tolerance of ±0.02 for rounding
  - `invoice_date <= due_date`
  - `contract_start_date < contract_end_date`
  - `currency == vendor_default_currency` (requires vendor master data integration)
- Implementation: Rule DSL stored in JSONB:
```json
{
  "rule_id": "invoice_total_consistency",
  "rule_type": "cross_field",
  "expression": "abs(total_amount - (subtotal + tax_amount)) < 0.05",
  "severity": "ERROR",
  "message": "Invoice total does not match subtotal + tax"
}
```

**Type 4: External Reference Validation**
- Checks extracted values against external systems.
- Examples: vendor ID exists in ERP, PO number exists and is open, GL account code is valid, employee ID exists in HRMS.
- Implementation: Async HTTP calls to integration endpoints (with caching of responses, TTL = 1 hour).
- Failure handling: If external system is unreachable, validation is marked `SKIPPED` (not FAILED) to avoid blocking processing.

**Type 5: Duplicate Detection**
- For each document type, a composite uniqueness key is defined.
- Invoice: `(org_id, vendor_id, invoice_number)` — any match is a potential duplicate.
- Contract: `(org_id, contract_title, counterparty_name, effective_date)`.
- Duplicate detection uses exact match on the uniqueness key. Near-duplicate detection (Phase 3) uses MinHash LSH on document text to find documents that are 85%+ similar.
- When a duplicate is detected: create a `DuplicateLink` record connecting the two documents, set validation flag `IS_POTENTIAL_DUPLICATE`, route to review queue.

**Type 6: Fraud and Anomaly Flags**
- Amount spike: amount > 3x the vendor's rolling 90-day average.
- New bank account: payment details different from all previous documents from this vendor.
- Round number: amount is suspiciously round (e.g., exactly $50,000.00 when vendor normally bills $47,823.15).
- Date anomaly: invoice date is on a weekend or public holiday (for vendors that normally don't bill on those days).
- Frequency anomaly: same vendor invoices twice in < 24 hours.
These are soft flags (WARNING severity), not hard failures, surfaced prominently in the review UI.

## Review Queue Design

**Queue structure:**
- Priority 1 (Critical): Validation FAILED with ERROR severity, potential fraud flags.
- Priority 2 (High): Low-confidence extractions (< 0.70), classification reviews.
- Priority 3 (Medium): Validation FAILED with WARNING severity.
- Priority 4 (Low): Manual review requested by users.

**Review UI components (detailed in Section 14):**
- Side-by-side document viewer and extracted fields panel.
- Each field shows: current value, confidence badge, validation status, rule that failed.
- Reviewer can: accept, override (with value + reason), reject.
- Multi-document review: reviewer can hold Shift+click to review multiple similar documents with the same correction (bulk correction for systematic errors).

**Human Approval Workflow:**
For documents that require explicit human sign-off (configurable per document type and amount threshold):
- Approval task created and assigned to a designated approver (or group).
- Email notification sent with document summary.
- Approver sees the document and the extracted summary.
- One-click approve/reject with optional comment.
- Approved documents trigger downstream workflow actions.
- SLA tracking: if approval not given within configured hours, escalate to next approver level.

## Confidence Thresholds Configuration

Per-organization, per-document-type configuration:
```json
{
  "document_type": "invoice",
  "auto_approve_threshold": 0.90,
  "review_threshold": 0.70,
  "reject_threshold": 0.40,
  "required_fields": ["invoice_number", "invoice_date", "total_amount", "vendor_name"],
  "required_field_min_confidence": 0.85
}
```

---

# 10. Human Feedback and Continuous Improvement

## Feedback Schema

```sql
CREATE TABLE feedback_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- What was corrected
  feedback_type VARCHAR(50) NOT NULL, -- 'field_correction', 'classification', 'qa_quality', 'extraction_missing', 'false_positive'
  document_id UUID REFERENCES documents(id),
  extracted_field_id UUID REFERENCES extracted_fields(id),
  search_query_id UUID REFERENCES search_queries(id),
  
  -- The correction
  original_value JSONB, -- what the system produced
  corrected_value JSONB, -- what the human says it should be
  correction_reason VARCHAR(255), -- optional free text
  
  -- Context for retraining
  model_version_id UUID REFERENCES model_versions(id), -- which model version made the error
  pipeline_run_id UUID REFERENCES extraction_jobs(id),
  
  -- Metadata
  confidence_at_extraction FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  review_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, INCORPORATED, REJECTED
  priority_score FLOAT -- computed field, higher = more impactful for retraining
);
```

## Correction Capture Points

1. **Field corrections in review UI:** When a reviewer overrides an extracted field value, the correction is stored with the original value, bounding box of the source OCR region, the model that produced the extraction, and the document context.

2. **Q&A feedback:** Users can rate Q&A responses (thumbs up/down) and provide a preferred answer. Negative ratings with corrected answers are stored as `qa_quality` feedback.

3. **Search relevance feedback:** Users can mark search results as "Not Relevant" which is stored as implicit negative feedback for that query-chunk pair.

4. **Validation override:** When a reviewer overrides a validation failure (saying "this is actually correct"), that override is stored and used to tune validation rules.

## Feedback Prioritization

Priority score computation for retraining (runs nightly):
```python
priority_score = (
    0.3 * (1 - confidence_at_extraction) +  # Low confidence errors matter more
    0.2 * correction_frequency_for_field +   # Fields corrected often matter more  
    0.2 * document_volume_for_type +         # High-volume document types matter more
    0.2 * business_impact_weight +           # Errors on financial fields matter more
    0.1 * recency_weight                     # Recent errors matter more
)
```

## Retraining Signal Pipeline

**Near-term (Phase 1–2): Active Learning Queue**
- High-priority feedback entries are surfaced in an annotation interface.
- ML team reviews flagged cases, confirms or adjusts corrections.
- Confirmed corrections are added to the training dataset for the next model version.

**Medium-term (Phase 3): Automated Fine-Tuning Pipeline**
- When a field type accumulates >= 100 new confirmed corrections, a fine-tuning run is triggered automatically.
- For the extraction LLM (if using a self-hosted model): LoRA adapter fine-tuning using HuggingFace PEFT on the correction examples.
- For the classification model: incremental fine-tuning using the new labeled documents.
- All fine-tuned model versions are stored in the `model_versions` table with metadata: training dataset version, evaluation metrics, training date.
- New model versions are deployed to a canary slot (10% of traffic) and monitored for performance regression before full rollout.

**Long-term (Phase 4): RLHF-Style Preference Learning**
- For Q&A quality, pair (question, good answer, bad answer) tuples are collected from feedback.
- A reward model is trained to predict answer quality.
- The answer generation model is fine-tuned using PPO (Proximal Policy Optimization) against the reward model.
- This is a significant investment, only justified for deployments processing 1M+ documents/month.

## Model Evaluation and Version Comparison

The `model_versions` table tracks:
- Extraction F1 score per field type
- Classification accuracy per document type
- OCR character error rate
- Q&A RAGAS metrics (faithfulness, answer relevance, context precision)
- Human correction rate per 1000 documents

Before promoting a new model version to production, all metrics must be >= previous version on a held-out test set. Regression in any metric > 2% blocks promotion.

A/B testing infrastructure allows routing a percentage of new documents to the new model version while tracking correction rates in production.

---

# 11. Automation Engine

## Design Philosophy

The Automation Engine is a trigger-action system, not a workflow orchestrator. It does not replace Temporal, Airflow, or n8n for complex multi-step workflows — it provides a lightweight, document-centric automation layer that handles the 80% of use cases: route, notify, post, escalate.

For complex workflows with human approval steps, parallel branches, and long-running SLAs, the Automation Engine creates tasks in connected systems (Jira, ServiceNow, email) rather than trying to manage those workflows internally.

## Trigger Types

**1. Status Triggers**
- Document reaches status X (APPROVED, VALIDATION_FAILED, NEEDS_REVIEW)
- Document extraction confidence below threshold
- Document is a potential duplicate

**2. Field Value Triggers**
- A numeric field exceeds a threshold (amount > $50,000)
- A field contains a specific value (vendor_name = "Acme Corp")
- A date field is within N days of today (contract expiry within 30 days)
- A field is missing (required field not extracted)

**3. Time Triggers**
- Document has been in REVIEW_REQUIRED status for > 4 hours
- Approval task has not been completed within SLA

**4. External Triggers**
- Webhook received from external system (e.g., "PO approved in ERP, now process matching invoice")

## Action Types

**1. HTTP Webhook**
POST to a configured URL with the DocumentRecord JSON payload. Configurable headers (for authentication tokens), retry strategy, and expected response codes.

**2. Email Notification**
Send a templated email to configured recipients or a role (e.g., "all users with role APPROVER"). Templates use Jinja2 with access to document fields.

**3. Internal Routing**
Move document to a specific review queue, assign to a specific user, change priority.

**4. ERP Integration** (Phase 2)
Post invoice data to SAP/Oracle/NetSuite via a pre-built integration connector. The connector maps DocIQ field names to ERP field names via a configurable mapping table.

**5. Slack/Teams Notification**
Post a message to a configured channel with document summary and a link to the review UI.

**6. Create Downstream Record**
Create a record in a connected system (a Jira ticket, a Salesforce opportunity update, a ServiceNow ITSM ticket).

## Workflow Definition Schema

```json
{
  "workflow_id": "uuid",
  "name": "High-Value Invoice Approval",
  "document_type": "invoice",
  "trigger": {
    "type": "field_value_threshold",
    "field": "total_amount",
    "operator": "gt",
    "value": 50000
  },
  "conditions": [
    {"field": "validation_status", "operator": "in", "values": ["PASSED", "PASSED_WITH_WARNINGS"]}
  ],
  "actions": [
    {
      "step": 1,
      "type": "email_notification",
      "config": {
        "to_role": "FINANCE_MANAGER",
        "subject": "High-Value Invoice Requires Approval: {{invoice_number}}",
        "template": "high_value_invoice_approval"
      }
    },
    {
      "step": 2,
      "type": "internal_routing",
      "config": {
        "assign_to_role": "FINANCE_MANAGER",
        "priority": "HIGH",
        "sla_hours": 4
      }
    }
  ],
  "sla_escalation": {
    "hours": 4,
    "escalate_to_role": "CFO"
  }
}
```

## Retry and Failure Handling

- Each action execution is stored as a `WorkflowActionRun` record.
- Failed actions are retried with exponential backoff: 1min → 5min → 15min → 1hr → 4hr. After 5 failed attempts, the action is marked DEAD and an alert is sent to the admin.
- Webhook failures: if the target system returns 5xx, retry. If it returns 4xx (bad request), flag as permanent failure and notify admin.
- All retries are idempotent: each `WorkflowActionRun` has a unique idempotency key sent in the webhook header.

## Audit Trail for Actions

Every action execution is logged in `workflow_action_logs`:
- What trigger fired
- What conditions were evaluated
- What actions were taken, in what order
- Response from external system
- Timestamp, duration, user who configured the workflow

This log is immutable and forms the compliance audit trail for automated processing decisions.

---

# 12. Database Design

## Database Strategy

**Multi-tenancy model:** Shared database, shared schema, with `org_id` on every tenant-scoped table and PostgreSQL Row Level Security (RLS) policies enforced at the database level as a defense-in-depth measure.

**Primary key strategy:** UUID v7 (time-ordered UUID) throughout. UUID v7 gives the distribution properties of UUIDs but sorts chronologically, improving B-tree index performance on sequential inserts. Generated via `pg_uuidv7` extension.

**Audit columns:** Every table includes `created_at TIMESTAMPTZ DEFAULT NOW()` and `updated_at TIMESTAMPTZ` (updated by trigger). Tables that should be immutable (audit_logs, feedback_entries) have no `updated_at`.

## Core Tables

### organizations
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,              -- URL-safe identifier
  plan_tier VARCHAR(50) DEFAULT 'starter',        -- starter, professional, enterprise
  document_quota_monthly INT DEFAULT 1000,
  storage_quota_gb INT DEFAULT 50,
  settings JSONB DEFAULT '{}',                    -- org-level configuration
  sso_config JSONB,                               -- SAML/OIDC configuration
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);
```

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  email_verified_at TIMESTAMPTZ,
  hashed_password VARCHAR(255),                   -- null for SSO-only users
  display_name VARCHAR(255),
  avatar_url VARCHAR(500),
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  UNIQUE(org_id, email)
);
```

### roles and permissions
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  org_id UUID REFERENCES organizations(id),       -- null = system role
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  permissions JSONB NOT NULL DEFAULT '[]',        -- array of permission strings
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- System roles: SUPERADMIN, ORG_ADMIN, MANAGER, ANALYST, REVIEWER, VIEWER, API_USER

CREATE TABLE user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);
```

### document_types
```sql
CREATE TABLE document_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  org_id UUID REFERENCES organizations(id),       -- null = system document type
  name VARCHAR(100) NOT NULL,                     -- 'invoice', 'contract', etc.
  display_name VARCHAR(255) NOT NULL,
  extraction_schema JSONB NOT NULL DEFAULT '{}',  -- field definitions
  validation_schema JSONB NOT NULL DEFAULT '{}',  -- validation rules
  classification_keywords TEXT[],                 -- hints for the classifier
  auto_approve_threshold FLOAT DEFAULT 0.90,
  review_threshold FLOAT DEFAULT 0.70,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  document_type_id UUID REFERENCES document_types(id),
  
  -- File information
  original_filename VARCHAR(500) NOT NULL,
  file_format VARCHAR(20) NOT NULL,               -- 'pdf', 'jpg', 'png', 'docx'
  file_size_bytes BIGINT,
  page_count INT,
  
  -- S3 references
  raw_s3_key VARCHAR(1000) NOT NULL,
  processed_s3_prefix VARCHAR(1000),
  
  -- Processing state machine
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  -- States: PENDING, PREPROCESSING, OCR_PENDING, OCR_COMPLETE, LAYOUT_ANALYSIS,
  --         CLASSIFYING, EXTRACTING, VALIDATING, EMBEDDING, REVIEW_REQUIRED,
  --         APPROVED, REJECTED, FAILED, ARCHIVED
  
  -- Quality metrics
  overall_ocr_confidence FLOAT,
  overall_extraction_confidence FLOAT,
  
  -- Classification
  classification_confidence FLOAT,
  
  -- Validation
  validation_status VARCHAR(50),
  
  -- Access control
  access_level VARCHAR(20) DEFAULT 'ORG',        -- 'ORG', 'RESTRICTED', 'CONFIDENTIAL'
  allowed_user_ids UUID[],                        -- for RESTRICTED/CONFIDENTIAL
  
  -- Metadata
  source VARCHAR(50) DEFAULT 'web_upload',       -- 'web_upload', 'api', 'email', 'integration'
  uploaded_by UUID REFERENCES users(id),
  tags TEXT[],
  custom_metadata JSONB DEFAULT '{}',
  
  -- Duplication
  content_hash VARCHAR(64),                       -- SHA-256 of raw file, for exact duplicate detection
  duplicate_of_id UUID REFERENCES documents(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  
  -- Indexes
  -- INDEX on (org_id, status)
  -- INDEX on (org_id, document_type_id)
  -- INDEX on (org_id, created_at DESC)
  -- INDEX on content_hash (for duplicate detection)
);
```

### document_pages
```sql
CREATE TABLE document_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  page_number INT NOT NULL,
  
  -- S3 references for processed images
  processed_image_s3_key VARCHAR(1000),
  thumbnail_s3_key VARCHAR(1000),
  
  -- Preprocessing results
  original_rotation_degrees FLOAT DEFAULT 0,
  applied_skew_correction FLOAT DEFAULT 0,
  image_quality_score FLOAT,
  
  -- OCR results
  ocr_status VARCHAR(30),
  ocr_confidence FLOAT,
  ocr_raw_output JSONB,                           -- full PaddleOCR output
  ocr_text TEXT,                                  -- plain text concatenation
  is_digital_native BOOLEAN DEFAULT FALSE,
  
  -- Layout analysis
  layout_elements JSONB,                          -- array of LayoutElement objects
  detected_tables JSONB,                          -- array of extracted table structures
  
  -- Dimensions
  width_px INT,
  height_px INT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, page_number)
);
```

### extracted_fields
```sql
CREATE TABLE extracted_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id),
  
  field_name VARCHAR(100) NOT NULL,
  field_display_name VARCHAR(255),
  
  -- The extracted value (typed)
  raw_value TEXT,
  normalized_value JSONB,                         -- parsed, type-normalized value
  data_type VARCHAR(30),                          -- 'string', 'number', 'date', 'currency', 'boolean'
  
  -- Source tracing
  source_page_number INT,
  source_bbox JSONB,                              -- {x, y, width, height} in px
  source_text TEXT,                               -- raw OCR text the value was extracted from
  extraction_method VARCHAR(20),                  -- 'rule', 'llm', 'hybrid'
  
  -- Confidence
  confidence FLOAT NOT NULL,
  ocr_confidence FLOAT,
  extraction_confidence FLOAT,
  
  -- LLM reasoning (when used)
  llm_reasoning TEXT,
  
  -- Review state
  is_reviewed BOOLEAN DEFAULT FALSE,
  is_corrected BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- INDEX on (document_id)
-- INDEX on (org_id, field_name) for analytics
```

### extraction_jobs
```sql
CREATE TABLE extraction_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  document_id UUID NOT NULL REFERENCES documents(id),
  org_id UUID NOT NULL,
  
  pipeline_stage VARCHAR(50) NOT NULL,           -- 'preprocessing', 'ocr', 'layout', 'classification', 'extraction', 'validation', 'embedding'
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETE, FAILED, RETRYING
  
  -- Worker tracking
  worker_id VARCHAR(100),
  attempt_number INT DEFAULT 1,
  
  -- Timing
  queued_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INT,
  
  -- Results
  result_summary JSONB,
  error_message TEXT,
  error_traceback TEXT,
  
  -- Model tracking
  model_version_id UUID REFERENCES model_versions(id),
  
  -- Idempotency
  idempotency_key VARCHAR(255) UNIQUE
);
```

### validation_results
```sql
CREATE TABLE validation_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  extracted_field_id UUID REFERENCES extracted_fields(id),
  
  rule_id VARCHAR(100) NOT NULL,
  rule_name VARCHAR(255),
  rule_type VARCHAR(50),                          -- 'format', 'range', 'cross_field', 'external', 'duplicate', 'anomaly'
  
  status VARCHAR(20) NOT NULL,                    -- 'PASSED', 'FAILED', 'WARNING', 'SKIPPED'
  severity VARCHAR(20),                           -- 'ERROR', 'WARNING', 'INFO'
  message TEXT,                                   -- human-readable failure reason
  
  actual_value JSONB,
  expected_value JSONB,
  
  -- Human override
  overridden_by UUID REFERENCES users(id),
  override_reason TEXT,
  overridden_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### embeddings (vector reference table)
```sql
-- This table is the PostgreSQL reference for embeddings stored in Qdrant
-- It allows querying "which chunks belong to this document" without going to Qdrant
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  org_id UUID NOT NULL,
  
  qdrant_point_id UUID NOT NULL UNIQUE,           -- the corresponding Qdrant point ID
  chunk_index INT NOT NULL,
  page_number INT,
  
  text_content TEXT NOT NULL,
  token_count INT,
  
  embedding_model_version VARCHAR(100),
  embedded_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(document_id, chunk_index)
);
```

### feedback_entries
*(Full schema given in Section 10)*

### workflow_definitions
```sql
CREATE TABLE workflow_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  document_type_id UUID REFERENCES document_types(id),  -- null = applies to all types
  trigger_config JSONB NOT NULL,
  conditions JSONB DEFAULT '[]',
  actions JSONB NOT NULL,
  sla_config JSONB,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);
```

### workflow_runs
```sql
CREATE TABLE workflow_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  workflow_definition_id UUID NOT NULL REFERENCES workflow_definitions(id),
  document_id UUID NOT NULL REFERENCES documents(id),
  org_id UUID NOT NULL,
  
  status VARCHAR(30) DEFAULT 'RUNNING',           -- RUNNING, COMPLETED, FAILED, CANCELLED
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  current_step INT DEFAULT 0,
  trigger_details JSONB,
  result_summary JSONB
);
```

### workflow_action_logs
```sql
CREATE TABLE workflow_action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id),
  
  step_number INT NOT NULL,
  action_type VARCHAR(50) NOT NULL,
  
  status VARCHAR(20) NOT NULL,                    -- PENDING, RUNNING, SUCCESS, FAILED, RETRYING
  attempt_number INT DEFAULT 1,
  
  request_payload JSONB,
  response_payload JSONB,
  error_message TEXT,
  
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
```

### audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  org_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),              -- null for system actions
  
  action VARCHAR(100) NOT NULL,                   -- 'document.upload', 'field.override', 'workflow.trigger', etc.
  resource_type VARCHAR(50),
  resource_id UUID,
  
  ip_address INET,
  user_agent TEXT,
  
  before_state JSONB,
  after_state JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- NEVER allow UPDATE or DELETE on this table
);
-- Partition by created_at (monthly) for query performance
```

### model_versions
```sql
CREATE TABLE model_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  model_type VARCHAR(50) NOT NULL,                -- 'classifier', 'extractor', 'ocr', 'embedding', 'qa'
  model_name VARCHAR(255) NOT NULL,
  version_tag VARCHAR(100) NOT NULL,
  
  -- Where the model artifacts live
  artifact_s3_path VARCHAR(1000),
  model_card JSONB,                               -- description, training data, metrics
  
  -- Evaluation metrics
  evaluation_metrics JSONB,                       -- F1, accuracy, CER, etc.
  evaluation_dataset_version VARCHAR(100),
  
  -- Deployment
  is_current BOOLEAN DEFAULT FALSE,
  deployed_at TIMESTAMPTZ,
  deployed_by UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model_type, version_tag)
);
```

### search_queries
```sql
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  org_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  
  query_text TEXT NOT NULL,
  query_type VARCHAR(20),                         -- 'semantic_search', 'qa'
  
  filters_applied JSONB,
  results_count INT,
  chunks_retrieved JSONB,                         -- array of {chunk_id, score} for top-k
  
  llm_answer TEXT,
  citations JSONB,
  answer_confidence VARCHAR(20),
  
  latency_ms INT,
  
  -- User feedback
  user_rating INT,                                -- 1-5
  user_feedback_text TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

# 13. API Design

## Authentication Endpoints

**POST /api/v1/auth/register**
- Purpose: Create a new organization and admin user account.
- Input: `{org_name, email, password, plan_tier?}`
- Output: `{user, organization, access_token, refresh_token}`
- Auth: None (public)
- Notes: Triggers email verification. Password hashed with bcrypt (cost factor 12).

**POST /api/v1/auth/login**
- Purpose: Authenticate a user.
- Input: `{email, password, org_slug?}` or `{sso_token, provider}`
- Output: `{access_token: JWT (15min TTL), refresh_token (HTTP-only cookie, 7d TTL), user, org}`
- Auth: None
- Error: 401 on invalid credentials (uniform message, no enumeration)
- Rate limit: 10 attempts per 5 minutes per IP

**POST /api/v1/auth/refresh**
- Purpose: Obtain a new access token using the refresh token cookie.
- Input: None (reads HTTP-only cookie)
- Output: `{access_token}`
- Auth: Valid refresh token (cookie)

**POST /api/v1/auth/logout**
- Purpose: Invalidate the current session.
- Input: None
- Output: 204 No Content
- Action: Adds refresh token to Redis blacklist, clears cookie.

**GET /api/v1/auth/sso/{provider}/redirect**
- Purpose: Initiate SSO flow (Google, Microsoft, Okta).
- Output: Redirect to provider OAuth URL with PKCE parameters.

## Document Endpoints

**POST /api/v1/documents/upload-url**
- Purpose: Generate a pre-signed S3 URL for direct upload.
- Auth: Bearer token, permission: `document.create`
- Input: `{filename, file_size_bytes, file_format, document_type_id?, tags?, custom_metadata?}`
- Output: `{document_id, upload_url, upload_fields, expires_in_seconds: 900}`
- The client uploads directly to S3 using the pre-signed URL.
- After upload, client calls the confirm endpoint.

**POST /api/v1/documents/{document_id}/confirm-upload**
- Purpose: Confirm file upload is complete and trigger processing.
- Auth: Bearer token, permission: `document.create`
- Input: None
- Action: Validates file exists in S3, creates IngestJob, enqueues preprocessing message.
- Output: `{document_id, status: "PENDING", estimated_processing_time_seconds: 30}`

**GET /api/v1/documents**
- Purpose: List documents for the authenticated organization.
- Auth: Bearer token, permission: `document.read`
- Query params: `status, document_type_id, uploaded_by, start_date, end_date, page, page_size (default 20, max 100), sort_by (created_at|processing_time|confidence), order (asc|desc)`
- Output: `{items: [DocumentSummary], total, page, page_size, has_more}`
- RLS enforced: users only see documents matching their access_level and allowed_user_ids.

**GET /api/v1/documents/{document_id}**
- Purpose: Get full document detail including processing status, extracted fields, validation results.
- Auth: Bearer token, permission: `document.read`, document-level access check.
- Output: Full `DocumentDetail` object including status, all extracted fields with confidence, validation results, workflow runs.

**GET /api/v1/documents/{document_id}/pages/{page_number}/view-url**
- Purpose: Get a temporary pre-signed URL to view the processed page image.
- Auth: Bearer token, document-level access check.
- Output: `{url, expires_at}` (15-minute TTL URL)

**GET /api/v1/documents/{document_id}/pages/{page_number}/ocr**
- Purpose: Get the raw OCR output for a page (bounding boxes, text).
- Auth: Bearer token, permission: `document.read`
- Output: Full OCR JSON for the page.

**DELETE /api/v1/documents/{document_id}**
- Purpose: Soft-delete a document.
- Auth: Bearer token, permission: `document.delete`
- Action: Sets `documents.status = 'ARCHIVED'`, does not delete S3 files (retention policy managed separately).
- Output: 204 No Content

## Extraction Endpoints

**GET /api/v1/documents/{document_id}/extractions**
- Purpose: Get all extracted fields for a document.
- Auth: Bearer token, `document.read`
- Output: `{fields: [ExtractedField with confidence, bbox, source, validation_status], document_type, extraction_confidence}`

**PATCH /api/v1/documents/{document_id}/extractions/{field_id}**
- Purpose: Human correction of an extracted field value.
- Auth: Bearer token, permission: `document.review`
- Input: `{corrected_value, correction_reason}`
- Action: Updates extracted field, creates feedback_entry, updates validation results for affected rules, re-triggers workflow if applicable.
- Output: Updated `ExtractedField`

## Search Endpoints

**POST /api/v1/search**
- Purpose: Semantic + keyword hybrid search over documents.
- Auth: Bearer token, `search.execute`
- Input: `{query, filters: {document_type_id?, date_range?, document_ids?}, page?, page_size?}`
- Processing: Embed query → Qdrant hybrid search → Cross-encoder re-rank → Return top results with highlights.
- Output: `{results: [{chunk_text, document_id, document_name, page_number, relevance_score, highlighted_text, matched_fields}], total_estimated, latency_ms}`
- Note: Only returns chunks from documents the user has access to (Qdrant payload filter on org_id + access_level check).

**GET /api/v1/search/history**
- Auth: Bearer token
- Output: Last 50 search queries for the user.

## Q&A Endpoint

**POST /api/v1/qa/ask**
- Purpose: Ask a question over the document corpus.
- Auth: Bearer token, `search.execute`
- Input: `{question, filters?, conversation_history?: [{role, content}] (for multi-turn)}`
- Processing: Retrieve relevant chunks → Assemble context → LLM synthesis → Return answer with citations.
- Output: `{answer, confidence: "high|medium|low", citations: [{document_id, document_name, page_number, excerpt}], latency_ms}`
- Streaming variant: `POST /api/v1/qa/ask/stream` returns SSE stream for real-time token output.

**POST /api/v1/qa/feedback**
- Purpose: Submit feedback on a Q&A response.
- Auth: Bearer token
- Input: `{search_query_id, rating: 1-5, preferred_answer?, reason?}`
- Output: 201 Created

## Validation Endpoints

**GET /api/v1/documents/{document_id}/validation**
- Purpose: Get validation results for a document.
- Auth: Bearer token, `document.read`
- Output: `{status, rules_evaluated, rules_passed, rules_failed, results: [ValidationResult]}`

**POST /api/v1/documents/{document_id}/validation/override**
- Purpose: Override a failed validation rule (with reason).
- Auth: Bearer token, permission: `document.approve`
- Input: `{rule_id, override_reason}`
- Output: Updated ValidationResult

**POST /api/v1/documents/{document_id}/approve**
- Purpose: Mark a document as approved after review.
- Auth: Bearer token, permission: `document.approve`
- Input: `{comments?}`
- Action: Sets status = APPROVED, triggers workflow engine.

**POST /api/v1/documents/{document_id}/reject**
- Purpose: Reject a document.
- Auth: Bearer token, permission: `document.approve`
- Input: `{reason}`

## Workflow Endpoints

**GET /api/v1/workflows**
- Auth: Bearer token, permission: `workflow.read`
- Output: List of workflow definitions for the organization.

**POST /api/v1/workflows**
- Auth: Bearer token, permission: `workflow.manage`
- Input: Workflow definition JSON
- Output: Created workflow definition

**GET /api/v1/workflows/{workflow_id}/runs**
- Auth: Bearer token
- Output: Paginated list of workflow run history with status and results.

**POST /api/v1/webhooks/inbound/{integration_key}**
- Purpose: Receive webhook from external systems.
- Auth: HMAC signature validation using the integration key's secret.
- Input: Integration-specific payload.

## Analytics Endpoints

**GET /api/v1/analytics/overview**
- Auth: Bearer token, permission: `analytics.read`
- Output: `{documents_processed_today, documents_processed_month, avg_processing_time_s, avg_extraction_confidence, review_queue_depth, auto_approval_rate, cost_estimate_month}`

**GET /api/v1/analytics/documents**
- Query params: `granularity (day|week|month), start_date, end_date, group_by (document_type|status|source)`
- Output: Time-series data for charts.

**GET /api/v1/analytics/extraction-accuracy**
- Output: Per-field-type accuracy metrics (based on human corrections), comparison to previous period.

## Admin Endpoints

**GET/POST/PATCH/DELETE /api/v1/admin/users**
**GET/POST/PATCH/DELETE /api/v1/admin/roles**
**GET/POST/PATCH /api/v1/admin/document-types**
**GET/POST/PATCH /api/v1/admin/integrations**
**GET /api/v1/admin/audit-logs** (paginated, filterable)
**GET /api/v1/admin/model-versions**
**POST /api/v1/admin/model-versions/{version_id}/deploy** (canary or full)

---

# 14. Frontend Architecture

## App Layout

The application shell uses a three-panel layout:
- **Left sidebar (240px fixed):** Primary navigation, collapsed to icon-only on smaller screens.
- **Header bar (56px):** Organization switcher, global search trigger, notification bell, user menu.
- **Main content area:** Full remaining space, max-width constraint of 1440px centered for readability.
- **Right context panel (optional, 320px):** Slides in for document metadata, field details, and chat context.

## Navigation Structure

```
/ (redirect to /dashboard)
/dashboard                    - Processing overview and metrics
/documents                    - Document list (filterable, sortable)
/documents/upload             - Upload center (drag-drop + bulk)
/documents/:id                - Document viewer with extraction panel
/documents/:id/review         - Human review mode
/search                       - Semantic search interface
/assistant                    - Q&A chat interface
/analytics                    - Analytics dashboard
/review-queue                 - Validation/review queue
/workflows                    - Workflow builder and management
/settings                     - Organization settings
/settings/users               - User management
/settings/roles               - Role management
/settings/document-types      - Extraction schema editor
/settings/integrations        - ERP/webhook integrations
/admin                        - Super-admin (system-level)
```

## Dashboard Page

**Purpose:** At-a-glance operational status for the processing pipeline.

**Components:**
- `<ProcessingMetrics />`: Cards showing documents in each status (today: processed, reviewing, failed, approved). Numbers update via polling (30s) or WebSocket.
- `<ProcessingTimeline />`: Recharts AreaChart showing document volume over the past 7/30/90 days, stacked by document type.
- `<ConfidenceDistribution />`: Histogram of extraction confidence scores for today's documents. A healthy system shows a right-skewed distribution.
- `<ReviewQueuePreview />`: Top 5 documents in the review queue with their priority and issue summary. "View All" links to /review-queue.
- `<RecentActivity />`: Activity feed: last 20 documents processed with status and extraction confidence badge.
- `<SystemHealth />`: Pipeline stage health indicators (OCR worker count, queue depth, vector DB response time).

## Upload Center (/documents/upload)

**Purpose:** Efficient multi-document upload with progress tracking.

**UX Flow:**
1. Drop zone (large, visually prominent) accepts drag-and-drop or click-to-browse. Accepts PDF, PNG, JPG, TIFF, DOCX. Shows format constraints clearly.
2. File validation runs client-side immediately: format check, size check, rough duplicate check (SHA-256 of file content vs known hashes).
3. Upload queue shows each file as a card: filename, size, detected format, upload progress bar, and upload status.
4. Each file gets a pre-signed URL and uploads to S3 directly. Multiple files upload in parallel (max 5 concurrent).
5. After upload confirmation, each card transitions to "Processing" with a spinner.
6. Users can navigate away; processing continues in the background. A toast notification appears when processing completes.

**Batch upload:** Supports dropping an entire folder or zip file. For zips, the API extracts and creates individual documents.

## Document Viewer (/documents/:id)

This is the most important and complex page in the application.

**Layout:** Full-height split-pane.
- **Left pane (60% width):** PDF/image viewer. Uses react-pdf for rendering. Navigation: page thumbnails strip at the bottom. Zoom controls. Print/download button.
- **Right pane (40% width):** Tabbed panel: "Extracted Fields", "Validation", "History", "Workflow".

**Annotation Layer (the key feature):**
When a field in the right pane is hovered or selected, the corresponding bounding box is highlighted on the document in the left pane. The highlight appears as a semi-transparent colored overlay on the exact region that was used to extract the field. Color coding by confidence: green (> 0.90), amber (0.70–0.90), red (< 0.70).

Clicking a bounding box in the document viewer scrolls to and highlights the corresponding field in the right pane.

**Extracted Fields panel:**
- Fields grouped by logical section (Header, Line Items, Footer, Entities).
- Each field shows: label, extracted value, confidence badge, validation status icon.
- Hovering a field highlights its source region in the document.
- Clicking the edit icon opens an inline edit modal with: the original extracted value, a text input for correction, a correction reason dropdown, and the source region highlighted.
- Low-confidence fields have an amber background. Failed validation fields have a red left border.
- Table fields render as an inline table component with sorting.

**State management:** The document viewer uses Zustand store (`useDocumentStore`) with the following state:
```typescript
{
  documentId: string,
  currentPage: number,
  zoomLevel: number,
  selectedFieldId: string | null,
  highlightedBbox: BoundingBox | null,
  paneWidth: number, // persisted to localStorage
  activeTab: 'fields' | 'validation' | 'history' | 'workflow'
}
```

## Semantic Search Page (/search)

**Layout:**
- Search bar (full-width, prominent, auto-focus on mount)
- Filter sidebar (collapsible): document type, date range, specific document selection
- Results area: list of result cards

**Result card:** Document name, page number, relevance score bar, highlighted excerpt (with query terms emphasized), tags showing which extracted fields matched. Click navigates to the document viewer at the specific page.

**Empty state:** Helpful prompt: "Try searching for 'invoices from Acme Corp in Q3 2024' or 'contracts expiring this quarter'"

## Q&A Assistant Page (/assistant)

**Layout:** Conversation interface with a fixed input at the bottom.

**Message components:**
- User messages: right-aligned bubble
- Assistant messages: left-aligned with a special card structure:
  - Answer text with inline citation markers [1], [2]
  - Confidence badge (High/Medium/Low)
  - Citation list at the bottom: each citation shows document name, page, and a text snippet. Clicking opens the document viewer to that page.
  - Thumbs up / thumbs down feedback buttons per response
- Typing indicator while streaming

**Input area:**
- Textarea with auto-expand up to 5 lines
- Filter chip UI: "+ Add Filter" for document type and date scoping
- Send button + keyboard shortcut (Cmd+Enter)
- Suggestion chips on empty state: pre-set question starters based on the org's document types

## Analytics Dashboard (/analytics)

**Sections:**
1. **Volume & Throughput:** Line chart: documents processed per day. Stacked bar: by document type. KPI cards: today, this week, this month.
2. **Quality Metrics:** Line chart: average extraction confidence over time. Bar chart: human correction rate per field type. Funnel: auto-approved vs review-required vs rejected.
3. **Processing Performance:** Box plot of processing time per stage (OCR, extraction, validation). P50/P95/P99 latencies.
4. **Review Queue Analytics:** Average time-to-review, backlog trend, reviewers' throughput.
5. **Cost Dashboard (Phase 3):** Estimated API cost (LLM calls, OCR), cost per document type, cost trend.

All charts use Recharts. All data fetched via TanStack Query with 1-minute cache + background refetch.

## Validation / Review Queue (/review-queue)

**Purpose:** The daily working interface for operations analysts.

**List view:**
- Filterable by priority, document type, assignee, date.
- Sortable by priority, creation date, confidence.
- Columns: Priority badge, document name, document type, primary issue summary, confidence, age (time since flagged), assignee.
- Quick-action buttons: "Assign to me", "Preview" (opens a mini-preview without leaving the list).

**Review mode:** Entering review mode on a document replaces the split-pane viewer with a full-screen review interface. Navigation between documents in the queue without going back to the list (Next/Previous document in queue). Keyboard shortcuts for approve (A), reject (R), next (N), previous (P).

**Bulk operations:** Select multiple documents of the same type to apply a bulk correction (same field value across all selected documents), useful when a batch of documents from the same vendor all have the same formatting change.

## Workflow Builder (/workflows)

**Purpose:** Visual, no-code interface for creating automation rules.

**Interface:** Canvas-based builder using React Flow. Nodes represent triggers, conditions, and actions. Connections show flow.

**Node types:**
- Trigger node: Document type selector + trigger event selector
- Condition node: Field comparator (if amount > value)
- Action node: Type selector (email, webhook, route, ERP post) + configuration form
- Splitter node: If/else branching

**Properties panel:** Clicking a node opens a configuration panel on the right. Conditions use a visual rule builder (field + operator + value), not raw code.

**Testing:** "Test with document" button: select a real document and see which nodes would fire, with the actual field values substituted in.

## Component Architecture

**Reusable UI components library (internal):**
- `<DocumentCard />` — document list item with status, type badge, confidence
- `<ConfidenceBadge confidence={0.92} />` — color-coded badge
- `<BoundingBoxOverlay />` — SVG overlay for document annotations
- `<FieldDisplay field={...} onEdit={...} />` — field row with hover behavior
- `<ValidationStatus result={...} />` — inline validation indicator
- `<SearchResultCard />` — search result with citation preview
- `<WorkflowBuilder />` — React Flow-based canvas
- `<DataTable />` — TanStack Table v8-based table with sorting, filtering, pagination
- `<DateRangePicker />` — custom date range picker
- `<JsonPreview />` — collapsible JSON viewer for raw OCR/extraction data
- `<SplitPane />` — resizable split pane (persists width to localStorage)
- `<StatusIndicator status={...} />` — animated processing status
- `<FileUploadZone />` — drag-and-drop upload with progress

## Data Fetching Strategy

All server data is managed by TanStack Query v5:

```typescript
// Document list — paginated, cached
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['documents', filters],
  queryFn: ({ pageParam = 1 }) => api.getDocuments({ ...filters, page: pageParam }),
  staleTime: 30_000,    // 30 seconds
  gcTime: 5 * 60_000,  // 5 minutes
})

// Document detail — real-time updates via polling
const { data: document } = useQuery({
  queryKey: ['document', documentId],
  queryFn: () => api.getDocument(documentId),
  refetchInterval: (data) => 
    data?.status === 'PROCESSING' ? 3000 : false  // Poll while processing
})
```

For streaming Q&A responses, use the native Fetch API with ReadableStream and update Zustand state as tokens arrive.

## Loading / Error / Empty States

Every data-dependent component has three defined states:
- **Loading:** Skeleton components matching the exact shape of the loaded content (not generic spinners except for actions). This prevents layout shift.
- **Error:** Contextual error message with a retry button. Error boundary wraps each major section independently (an error in analytics doesn't crash the document viewer).
- **Empty:** Illustrated empty state with a clear CTA. "No documents yet — upload your first document" with an upload button.

---

# 15. User Experience and UI Direction

## Product Feel

DocIQ should feel like a **precision instrument**: reliable, transparent, and fast. The metaphor is closer to a Bloomberg terminal or a medical diagnostic tool than a consumer app. Users interact with it for hours daily; the interface must be information-dense but not cluttered.

Key UX principles:
- **Information hierarchy:** The most important thing on every screen is the current task. Secondary information is accessible but not prominent.
- **Status transparency:** The user always knows what the system is doing and why. "Processing OCR (page 3/12)" is better than a generic spinner.
- **Error explanation:** When something goes wrong, say what went wrong, in plain English, and what the user should do. Never show a generic "Something went wrong."
- **Keyboard-first for power users:** Common review actions (approve, reject, next, previous) have keyboard shortcuts, discoverable via a "?" shortcut help overlay.
- **No unnecessary modals:** Corrections happen inline. Approvals are single-click. Modals are reserved for destructive actions and complex configurations.

## Visual Style Direction

**Theme:** Dark-leaning neutral base with precise color accents.

**Color palette:**
- Background: `#0F1117` (near-black)
- Surface: `#1A1D27` (dark navy-slate)
- Border: `#2E3347`
- Text primary: `#E8EAF0`
- Text secondary: `#8892A4`
- Accent blue (actions, links): `#3B82F6`
- Success green: `#22C55E`
- Warning amber: `#F59E0B`
- Error red: `#EF4444`
- Confidence high: `#22C55E`
- Confidence medium: `#F59E0B`
- Confidence low: `#EF4444`

**Typography:**
- Display/Headings: `IBM Plex Mono` — gives a data-dense, technical feel, different from the generic enterprise sans-serif.
- Body text: `Inter` — clean and readable at small sizes.
- Data values (extracted fields, numbers): `JetBrains Mono` — makes numbers easy to scan and compare.

**Visual details:**
- Subtle grid texture on the main background.
- 1px borders throughout (no heavy shadows).
- Transitions: 150ms easing for hover states, 250ms for panel slides.
- Document viewer: a clean white canvas for the document itself (the document page is a light background item on a dark shell — this makes the document feel like a physical object being examined under a spotlight).

**Status badges:** Pill-shaped with a subtle colored left accent bar. Not loud, but unmistakable.

---

# 16. Folder / Repo Structure

```
dociq/
├── README.md
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
│
├── backend/
│   ├── pyproject.toml
│   ├── Dockerfile
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │
│   ├── app/
│   │   ├── main.py                  # FastAPI app factory
│   │   ├── config.py                # Settings (pydantic-settings)
│   │   ├── dependencies.py          # Shared FastAPI dependencies
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── router.py
│   │   │   │   ├── service.py
│   │   │   │   ├── models.py        # SQLAlchemy models for this module
│   │   │   │   ├── schemas.py       # Pydantic schemas
│   │   │   │   └── security.py
│   │   │   │
│   │   │   ├── documents/
│   │   │   │   ├── router.py
│   │   │   │   ├── service.py
│   │   │   │   ├── models.py
│   │   │   │   ├── schemas.py
│   │   │   │   └── storage.py       # S3 operations
│   │   │   │
│   │   │   ├── extraction/
│   │   │   │   ├── service.py
│   │   │   │   ├── models.py
│   │   │   │   ├── schemas.py
│   │   │   │   ├── rule_engine.py
│   │   │   │   └── llm_extractor.py
│   │   │   │
│   │   │   ├── search/
│   │   │   │   ├── router.py
│   │   │   │   ├── service.py
│   │   │   │   ├── qa_service.py
│   │   │   │   └── qdrant_client.py
│   │   │   │
│   │   │   ├── validation/
│   │   │   │   ├── service.py
│   │   │   │   ├── rule_evaluator.py
│   │   │   │   └── anomaly_detector.py
│   │   │   │
│   │   │   ├── workflows/
│   │   │   │   ├── router.py
│   │   │   │   ├── engine.py
│   │   │   │   ├── action_handlers.py
│   │   │   │   └── models.py
│   │   │   │
│   │   │   ├── feedback/
│   │   │   │   ├── router.py
│   │   │   │   └── service.py
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── router.py
│   │   │   │   └── service.py
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── router.py
│   │   │       └── service.py
│   │   │
│   │   ├── core/
│   │   │   ├── database.py          # SQLAlchemy session + engine
│   │   │   ├── redis_client.py
│   │   │   ├── celery_app.py
│   │   │   ├── exceptions.py        # Custom exception hierarchy
│   │   │   ├── middleware.py        # Request ID, tenant context
│   │   │   └── audit.py             # Audit log writer
│   │   │
│   │   └── shared/
│   │       ├── models/
│   │       │   └── base.py          # BaseModel with audit columns
│   │       └── utils/
│   │           ├── pagination.py
│   │           └── crypto.py
│   │
│   └── workers/
│       ├── base_worker.py
│       ├── preprocessing_worker.py
│       ├── ocr_worker.py
│       ├── layout_worker.py
│       ├── classification_worker.py
│       ├── extraction_worker.py
│       ├── validation_worker.py
│       ├── embedding_worker.py
│       └── workflow_worker.py
│
├── ai_pipeline/
│   ├── preprocessing/
│   │   ├── deskew.py
│   │   ├── denoiser.py
│   │   ├── binarizer.py
│   │   └── quality_scorer.py
│   │
│   ├── ocr/
│   │   ├── paddle_ocr_runner.py
│   │   ├── tesseract_runner.py
│   │   ├── digital_pdf_extractor.py
│   │   └── confidence_calibrator.py
│   │
│   ├── layout/
│   │   ├── layout_detector.py
│   │   ├── table_extractor.py
│   │   └── reading_order.py
│   │
│   ├── classification/
│   │   ├── classifier.py
│   │   └── model_loader.py
│   │
│   ├── extraction/
│   │   ├── rule_engine/
│   │   │   ├── engine.py
│   │   │   └── pattern_library.py
│   │   ├── llm_extractor.py
│   │   └── result_merger.py
│   │
│   ├── ner/
│   │   └── ner_runner.py
│   │
│   ├── embedding/
│   │   ├── chunker.py
│   │   ├── embedder.py
│   │   └── vector_store.py
│   │
│   └── models/
│       ├── download_models.sh       # Script to download model weights
│       └── model_registry.json      # Model version registry
│
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── Dockerfile
│   │
│   ├── src/
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── layout.tsx           # Root layout (shell, providers)
│   │   │   ├── dashboard/
│   │   │   ├── documents/
│   │   │   ├── search/
│   │   │   ├── assistant/
│   │   │   ├── analytics/
│   │   │   ├── review-queue/
│   │   │   ├── workflows/
│   │   │   └── settings/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui base components
│   │   │   ├── document/            # Document-specific components
│   │   │   ├── search/
│   │   │   ├── analytics/
│   │   │   ├── workflow/
│   │   │   └── layout/              # Shell, nav, sidebar
│   │   │
│   │   ├── hooks/
│   │   │   ├── useDocumentViewer.ts
│   │   │   ├── useSearch.ts
│   │   │   └── useStreamingChat.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── documentViewerStore.ts
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   │
│   │   ├── api/
│   │   │   ├── client.ts            # Axios instance with interceptors
│   │   │   ├── documents.ts
│   │   │   ├── search.ts
│   │   │   ├── workflows.ts
│   │   │   └── analytics.ts
│   │   │
│   │   ├── types/
│   │   │   └── api.ts               # TypeScript types matching API schemas
│   │   │
│   │   └── lib/
│   │       ├── utils.ts
│   │       └── format.ts
│
├── infrastructure/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── modules/
│   │   │   ├── eks/
│   │   │   ├── rds/
│   │   │   ├── elasticache/
│   │   │   ├── s3/
│   │   │   └── iam/
│   │   └── environments/
│   │       ├── staging/
│   │       └── production/
│   │
│   └── kubernetes/
│       ├── base/
│       │   ├── api-deployment.yaml
│       │   ├── worker-deployments.yaml
│       │   ├── qdrant-statefulset.yaml
│       │   └── services.yaml
│       └── overlays/
│           ├── staging/
│           └── production/
│
├── tests/
│   ├── backend/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── conftest.py
│   ├── ai_pipeline/
│   │   ├── test_ocr_accuracy.py
│   │   ├── test_extraction_accuracy.py
│   │   └── fixtures/
│   │       ├── sample_invoices/
│   │       ├── sample_contracts/
│   │       └── ground_truth/
│   └── frontend/
│       ├── unit/
│       └── e2e/
│           └── playwright/
│
├── scripts/
│   ├── setup_dev.sh
│   ├── seed_data.py
│   ├── run_pipeline_test.py
│   └── export_training_data.py
│
└── docs/
    ├── api/                         # OpenAPI specs
    ├── architecture/
    └── runbooks/
```

---

# 17. Implementation Roadmap

## Phase 1: Working MVP (Weeks 1–8)

**Goal:** A functional system that accepts document uploads, processes them through the AI pipeline, extracts structured data, and allows human review. No workflow automation, no semantic search.

**Features:**
- User authentication (email/password, JWT)
- Organization creation and basic user management (admin, reviewer roles)
- Document upload (single file, PDF + image support)
- Full AI pipeline: preprocessing → OCR → layout → classification → extraction → validation
- Document viewer with bounding box annotation overlay
- Extracted fields display with confidence scores
- Basic validation (format + cross-field, no external validation)
- Human review queue (list + review interface + field correction)
- Feedback storage (corrections captured, not yet used for training)
- Basic document list with status filtering
- Audit logging (document actions)

**Dependencies:**
- PaddleOCR weights downloaded and containerized
- PostgreSQL schema v1 created via migrations
- Celery + Redis queue operational
- S3 bucket configured with pre-signed URL generation
- OpenAI API key (for LLM extraction)
- Qdrant instance running (for Phase 2 preparation, even if not used in P1)

**Risks:**
- OCR quality on low-quality scanned documents (mitigate: start with digital-native PDFs)
- LLM extraction hallucination rate (mitigate: require source_text grounding, rule-based fallback)
- Pipeline stability (mitigate: comprehensive logging, manual retry endpoints)

**Defer to Phase 2:** Semantic search, Q&A, embedding generation, workflow automation, SSO, analytics dashboard.

## Phase 2: Search + Validation + Improved Extraction (Weeks 9–16)

**Goal:** Make extracted data searchable, add meaningful analytics, and harden the extraction pipeline.

**Features:**
- Embedding generation pipeline (chunking → Qdrant ingestion)
- Semantic + hybrid search (no Q&A yet, just search)
- Search UI with relevance results and document links
- Extended validation: external reference validation (webhook-based), duplicate detection
- Analytics dashboard (volume, confidence distribution, queue metrics)
- Extraction rule schema editor (admin UI to define new document type extraction rules)
- Batch upload (multiple files, zip archives)
- Document tagging and metadata
- Email notification for review queue assignments
- Improved classification model (train on collected data from Phase 1)

**Dependencies:** Phase 1 complete, at least 200 real documents processed for classification training.

**Risks:**
- Qdrant search quality depends on chunking quality (mitigate: tune chunking on real documents)
- External validation requires integration work (mitigate: stub with mock integrations initially)

**Defer to Phase 3:** Q&A assistant, workflow automation, SSO, fine-tuning pipeline.

## Phase 3: Workflow Engine + Q&A + Enterprise Features (Weeks 17–26)

**Goal:** Full automation capabilities and intelligent Q&A. Ready for enterprise trials.

**Features:**
- Q&A assistant with RAG (streaming responses, citations, conversation history)
- Workflow builder UI + automation engine (triggers, conditions, actions)
- ERP integration connectors (SAP, NetSuite, QuickBooks via pre-built adapters)
- Webhook outbound system for custom integrations
- SSO (Google Workspace, Microsoft Entra, Okta via OAuth2/OIDC)
- RBAC refinement (custom roles, field-level permissions)
- Feedback loop: corrections → training data preparation pipeline
- Model version management (A/B testing new models on canary traffic)
- Multi-language OCR (beyond English)
- SAML 2.0 for legacy enterprise IdPs
- Usage-based billing hooks (document count, API call volume)

**Dependencies:** Phase 2 complete, at least 1000 documents processed for model evaluation.

**Risks:**
- Q&A answer quality (mitigate: RAGAS evaluation on internal test set before launch)
- Workflow engine complexity (mitigate: start with 3 action types, expand iteratively)

## Phase 4: Advanced AI + Enterprise Hardening (Weeks 27–40)

**Goal:** Self-improving AI, enterprise security compliance, and advanced document intelligence.

**Features:**
- Fine-tuned extraction models per organization (LoRA adapters for self-hosted model)
- Near-duplicate document detection (MinHash LSH)
- Advanced anomaly detection (Isolation Forest per document type)
- Document comparison (diff two versions of a contract)
- Cross-document intelligence (aggregate patterns across the corpus: "Show me all contracts where indemnification clause is non-standard")
- SOC 2 Type II preparation: penetration testing, security audit, controls documentation
- HIPAA-ready mode (additional data handling controls for medical documents)
- VPC deployment option (all AI inference on-prem)
- Custom embedding models per organization
- Advanced analytics: cost-per-document, ROI dashboard
- Mobile web optimization

**Dependencies:** Phase 3 complete, at least one enterprise customer providing training feedback.

**Risks:**
- Fine-tuning compute costs (mitigate: LoRA is much cheaper than full fine-tuning)
- Compliance certifications are time-intensive (mitigate: start SOC 2 audit at week 30)

## Phase 5: Scale + Mobile (Weeks 41+)

**Goal:** Handle 10M+ documents/month, mobile clients, marketplace ecosystem.

**Features:**
- Microservices extraction: OCR service, embedding service separated for independent scaling
- React Native mobile app (review queue, approval workflow, document upload)
- Partner integration marketplace (pre-built connectors for 20+ systems)
- Multi-region deployment (EU, APAC data residency)
- Real-time collaborative review (multiple reviewers on the same document)
- Fully automated fine-tuning pipeline (no ML team intervention)
- GraphQL API (in addition to REST) for complex query patterns
- Document generation (auto-populate templates from extracted data)

---

# 18. Scalability, Reliability, and Performance

## Large Document Uploads

**Problem:** A single PDF can be 500MB (scanned books, large contracts with many pages).

**Solution:**
- Pre-signed S3 multipart upload for files > 10MB. The API creates a multipart upload and returns part URLs. Client uploads parts in parallel (5 concurrent). Client calls the complete-multipart endpoint when done. The API never touches the file bytes.
- Large files get lower queue priority to prevent starvation of the main processing queue.
- For extremely large documents (> 200 pages), processing is broken into page batches of 50, each batch processed independently and results merged.

## Batch Processing

**Problem:** An organization uploads 500 invoices at month-end. The queue must not block other work.

**Solution:**
- Separate Celery queues: `high_priority` (single documents), `batch` (batch uploads), `background` (embedding generation, analytics updates).
- Workers subscribe to specific queues. High-priority workers always run; batch workers scale up/down with HPA (Kubernetes Horizontal Pod Autoscaler) based on queue depth.
- Batch job creates a `BatchJob` record that tracks individual document status. Users can monitor batch progress.
- Rate limiting per organization: max 50 concurrent processing jobs per org to prevent one tenant dominating resources.

## Async Pipeline and Queue Backpressure

**Problem:** OCR workers can't keep up with upload rate; queue grows unboundedly.

**Solution:**
- Each stage has a max queue depth configuration. If `ocr.queue` depth exceeds the threshold (e.g., 1000 messages), the upload API returns a 503 with `Retry-After` header.
- Dead letter queue: messages that fail after max retries go to a dead letter queue and trigger an alert, not silent drops.
- Queue depth is a primary metric in Grafana. Alert fires when depth > 500 for > 5 minutes.
- Redis Streams' consumer group model ensures messages are not lost: if a worker dies mid-processing, the message is reclaimed after `IDLE_TIME` (2 minutes) and redelivered.

## OCR Bottlenecks

OCR is the most compute-intensive step. On CPU, PaddleOCR takes 2–4 seconds per page.

**Solutions:**
- GPU OCR workers: NVIDIA T4 GPUs reduce per-page OCR time to 0.3–0.5 seconds. Used for pages flagged as `LOW_QUALITY` or complex layouts.
- Digital-native fast path: bypass OCR entirely for PDFs with text layers (50–80% of typical enterprise document volumes).
- Horizontal scaling: OCR workers are stateless and trivially scalable. Scale based on queue depth.
- Caching: if the same file is uploaded twice (identical SHA-256), re-use the previous OCR output (soft deduplication before OCR).

## Vector Search Performance

**Problem:** With 10M+ chunks, search latency could degrade.

**Solution:**
- Qdrant collection per organization (not per document type) keeps collection sizes manageable.
- HNSW index parameters tuned: `m=16, ef_construct=200`. These are Qdrant's defaults and appropriate for < 10M vectors. For > 10M, increase to `m=32, ef_construct=400`.
- `ef` parameter at query time (Qdrant search accuracy parameter): set to 128 for normal search, 256 for high-accuracy mode. Trade-off between latency and recall.
- Payload index on `document_type` and `extraction_date` for fast pre-filtering (avoids scanning all points).
- Qdrant nodes: run on dedicated nodes with SSD NVMe storage. RAM-resident HNSW graph for fast traversal.

## High Concurrency

**Problem:** 500 concurrent users querying the search API.

**Solution:**
- FastAPI is async (using asyncio). A single worker handles thousands of concurrent connections.
- Database connection pool: SQLAlchemy async with asyncpg driver. Pool size: 20 connections per API pod, max overflow 10.
- Read-heavy endpoints (document list, extraction results) are cacheable. TanStack Query on the client provides a 30-second cache. Redis caching on the API for document metadata (TTL 5 minutes).
- API pods scale horizontally behind the load balancer. Target: < 1 pod per 100 active concurrent users as a starting point.

## Caching Strategy

| Data | Cache | TTL |
|---|---|---|
| Document list (per org, per filter combo) | Redis | 60s |
| Document metadata | Redis | 5min |
| Extraction results (final, not mid-processing) | Redis | 10min |
| OCR output (per page) | Redis | 1hr |
| Embedding model (in-process) | Python process memory | Duration of process |
| JWT validation | Redis blacklist (negative cache) | Token TTL |
| Pre-signed URL availability check | Not cached (always real-time) | — |

## Graceful Failure Recovery

- Worker failures: Redis Streams XPENDING. If a worker dies, the message is pending and reclaimed by another worker after `IDLE_TIME`.
- API pod failure: Kubernetes restarts failed pods. Load balancer health check removes unhealthy pods.
- Database failure: Read replicas for read traffic. In case of primary failure, fail-over to replica (RDS Multi-AZ, < 60s automatic failover).
- LLM API failure: Circuit breaker pattern. If LLM API fails 5 times in 60 seconds, the circuit opens and all LLM calls immediately fall back to rule-based-only mode. Alert fires. Circuit attempts to close after 5 minutes.
- Qdrant failure: Search API returns a degraded response (text-only search via PostgreSQL full-text search). Documents are still processable without embedding.

---

# 19. Security, Privacy, and Enterprise Readiness

## Authentication

- **Passwords:** bcrypt with cost factor 12. No MD5, no SHA1, no unsalted hashes.
- **JWT tokens:** HS256 for development, RS256 (asymmetric) for production. Private key stored in AWS KMS. Public key distributed to services. This allows token verification without shared secrets.
- **Token claims:** `sub` (user ID), `org_id`, `roles`, `iat`, `exp`. No sensitive data in JWT payload.
- **Refresh token rotation:** Each refresh generates a new refresh token and invalidates the previous one. Refresh tokens are stored (hashed) in the database to allow family-based invalidation (if a token is reused, invalidate the entire family — indicates token theft).

## RBAC Design

**Permission naming convention:** `{resource}.{action}` — `document.read`, `document.create`, `document.approve`, `workflow.manage`, `analytics.read`, `admin.users`.

**System roles (non-editable):**
| Role | Permissions |
|---|---|
| ORG_ADMIN | All permissions for the organization |
| MANAGER | document.*, workflow.read, analytics.read, feedback.write |
| ANALYST | document.read, document.create, search.execute, feedback.write |
| REVIEWER | document.read, document.review, document.approve |
| VIEWER | document.read, search.execute |
| API_USER | Configurable per API key |

**Custom roles:** Organizations can create custom roles combining any subset of permissions. This is stored in the `roles` table with `is_system_role = false`.

**Document-level access control:**
- Most documents: `access_level = 'ORG'` — all org members with `document.read` can see them.
- Sensitive documents: `access_level = 'RESTRICTED'` — only users listed in `allowed_user_ids`.
- Confidential: `access_level = 'CONFIDENTIAL'` — only specific named users.
- PostgreSQL RLS policy enforces this at the database level as a defense-in-depth measure.

## Tenant Isolation

- All tenant data is isolated by `org_id`.
- API middleware extracts `org_id` from the JWT on every request and sets it in the request context. All service calls automatically scope queries to this `org_id`.
- Qdrant: each organization has its own collection, preventing cross-tenant vector search.
- S3: all files stored under `s3://bucket/{org_id}/...` prefix. IAM policies on workers restrict them to their tenant's prefix when processing.
- No shared caches between tenants (Redis keys are prefixed with `org:{org_id}:`).

## Encryption

- **In transit:** TLS 1.2+ enforced everywhere. HSTS headers. Certificate managed via AWS ACM.
- **At rest:**
  - S3: SSE-KMS with per-organization KMS keys. This means Anthropic (or the hosting org) cannot read files without the tenant's key.
  - PostgreSQL RDS: encrypted at rest with AES-256 (RDS encryption enabled).
  - Redis: ElastiCache encryption in transit + at rest.
- **Application-level encryption:** Fields in the `extracted_fields` table for PII data (SSN, passport numbers, bank accounts) are encrypted at the application level using Python's `cryptography` library (Fernet symmetric encryption) with a per-organization key stored in AWS Secrets Manager.

## Secrets Management

- **AWS Secrets Manager:** Database passwords, Redis URL, LLM API keys, webhook signing secrets. No secrets in environment variables (not even in Kubernetes secrets unencrypted).
- **Secret rotation:** Database passwords rotated every 90 days via Secrets Manager automatic rotation. Application uses the Secrets Manager SDK to fetch credentials at startup and caches for 5 minutes.
- **Kubernetes secrets:** Only used to store the ARN reference to Secrets Manager secrets, not the secrets themselves. The pod's IAM role (via IRSA) grants access to the specific secrets.

## Audit Logs

- Every action that modifies data creates an audit log entry.
- Audit logs are append-only (PostgreSQL trigger prevents UPDATE and DELETE on `audit_logs`).
- Audit logs include: who, what, when, from where (IP), before state, after state.
- Critical events (login, logout, field correction, document approval, user role change) are always logged regardless of log level settings.
- Audit logs are exported to CloudWatch Logs for long-term retention (7 years for compliance).
- Audit log access in the admin UI is paginated and filterable by user, action type, resource type, and date range.

## Secure File Handling

- Uploaded files are virus-scanned using ClamAV before the confirmation endpoint allows processing to proceed. ClamAV runs as a sidecar container in the preprocessing worker pod.
- Files are stored with random keys (not predictable paths based on document ID). The actual S3 key is: `{org_id}/{year}/{month}/{uuid_v7}/{sha256_prefix}_{original_filename}`.
- Pre-signed URLs for viewing have a 15-minute TTL. They are generated per-request, not stored. Users cannot guess or enumerate document URLs.
- When a document is archived, its S3 files are not immediately deleted (legal hold considerations). A separate data retention job enforces configurable retention policies (e.g., delete raw files after 7 years).

## Compliance Considerations

- **GDPR:** Right to erasure requests are handled by a `purge_subject` endpoint that deletes/anonymizes all extracted data containing a specific person's data. The raw files are retained per retention policy but extracted PII is wiped.
- **HIPAA (Phase 4):** BAA with AWS, no PHI stored in logs, PHI encrypted at application level, access logging for all PHI access.
- **SOC 2 Type II:** Controls mapped to CC6 (logical access), CC7 (system operations), A1 (availability). Control evidence collected automatically via CloudTrail and CloudWatch.
- **Data residency:** Organization-level setting for which AWS region their data is stored in. Relevant for EU customers (GDPR data residency requirements).

---

# 20. Testing Strategy

## Backend Unit Tests

**Framework:** pytest + pytest-asyncio for async tests.

**What to unit test:**
- Validation rule evaluator: test each rule type with valid inputs, invalid inputs, edge cases (empty strings, nulls, boundary values).
- Extraction rule engine: test regex patterns against known document text snippets.
- Confidence scoring: test that the formula produces expected outputs for given inputs.
- Authentication: test JWT generation, validation, expiry.
- RBAC: test that permission checks pass/fail correctly for each role.
- Schema validation: test Pydantic schemas with valid and invalid payloads.

**Coverage target:** 80% line coverage on business logic modules. Not 100% — unit testing internal implementation details is wasteful. Focus on exported functions and class methods.

## Frontend Tests

**Framework:** Vitest + React Testing Library for unit/integration. Playwright for E2E.

**What to test:**
- Component rendering: does `<ConfidenceBadge confidence={0.92} />` render with the correct color class?
- User interactions: clicking edit on a field opens the edit modal with the correct pre-filled value.
- Form validation: required fields show errors on submit.
- TanStack Query integration: does the document list page show loading state, then data, then empty state?

**E2E tests (Playwright):**
- Full upload flow: upload a file, wait for processing, verify extraction results appear.
- Review flow: navigate to review queue, open document, correct a field, approve.
- Search flow: search for a known term, verify result appears.
- Authentication flow: login, access protected page, logout, verify redirect.

## Integration Tests

**What to test:**
- API endpoint + database: POST to `/documents/upload-url`, verify document record created in DB.
- API endpoint + S3: verify pre-signed URL is valid and upload works.
- API endpoint + queue: verify that confirming upload enqueues a message to Redis.
- Worker integration: send a test message to the OCR queue, verify the worker processes it and updates the database.

**Test infrastructure:** `docker-compose.test.yml` spins up a PostgreSQL test database, a Redis test instance, and a mock S3 (using MinIO). Tests run against these real services (not mocks), because mocking a database for integration tests defeats the purpose.

## AI Pipeline Tests

**OCR accuracy tests:**
- Fixture set: 50 documents (10 per document type) with ground-truth text.
- Metric: Character Error Rate (CER) < 3% on clean digital PDFs, < 8% on scanned documents.
- Run weekly in CI (slow test suite, excluded from commit-level CI).

**Extraction accuracy tests:**
- Fixture set: 100 annotated documents per document type with ground-truth extracted fields.
- Metrics: F1 score per field, weighted average F1 across all required fields.
- Target: F1 > 0.90 for structured document types (invoices), > 0.80 for semi-structured (contracts).

**Validation tests:**
- Test each validation rule independently with documents designed to trigger each rule.
- Verify that anomaly detection flags known anomalous test cases.

## Search Relevance Tests

**Framework:** RAGAS (Retrieval Augmented Generation Assessment)

**Metrics tested:**
- Context precision: are the retrieved chunks actually relevant to the query?
- Answer faithfulness: does the LLM answer use only the provided context?
- Answer relevance: does the answer address the question?

**Test set:** 50 query-answer pairs manually constructed from real documents. These are checked automatically in CI against the configured embedding model and retrieval parameters.

**Regression:** If RAGAS metrics drop more than 5% from baseline after a change to chunking or retrieval, the change is blocked.

## Pipeline Regression Tests

- Every time a pipeline stage is modified, run the full pipeline on a regression document set (100 documents) and compare: extraction field F1, validation pass rate, processing time.
- If F1 drops > 2% or processing time increases > 20%, the pipeline change requires review before merge.

## Edge Cases

Critical edge cases that must have tests:
- Zero-page PDF (corrupted)
- PDF with 500+ pages
- Document with all-image content (no text at all)
- Document in Arabic/Hebrew (right-to-left text)
- Document with mixed languages
- Document where the same field appears twice with different values
- Document with a table that spans two pages
- An invoice where line items sum does not equal the total (expected to flag)
- A document that is an exact duplicate of an existing document

---

# 21. Deployment and DevOps Plan

## Local Development

```bash
# Clone repo
git clone https://github.com/org/dociq

# Copy environment template
cp .env.example .env
# Fill in: OPENAI_API_KEY, or set SELF_HOSTED_LLM=true

# Start all services
docker-compose up -d

# Run database migrations
cd backend && alembic upgrade head

# Seed development data (creates test org, users, sample documents)
python scripts/seed_data.py

# Download AI model weights
bash ai_pipeline/models/download_models.sh

# Start API server (with hot reload)
uvicorn app.main:app --reload --port 8000

# Start Celery workers (in separate terminal)
celery -A app.core.celery_app worker --loglevel=info -Q high_priority,batch,background

# Start frontend (in separate terminal)
cd frontend && npm run dev
```

**Local docker-compose services:**
- PostgreSQL 16 (port 5432)
- Redis 7 (port 6379)
- Qdrant (port 6333)
- MinIO (port 9000, S3-compatible)
- Flower (Celery monitoring, port 5555)
- MailHog (email testing, port 8025)

## Containerization

Each major component has a dedicated Dockerfile:
- `backend/Dockerfile`: Python 3.12 slim base, installs dependencies, copies source. **Multi-stage build:** builder stage installs dependencies, final stage copies only necessary files. Result: ~800MB image (PaddleOCR adds substantial size).
- Workers share the backend Dockerfile but use a different CMD.
- `frontend/Dockerfile`: Node 20 Alpine base, builds Next.js app, serves with `next start`.

Docker images are tagged with the commit SHA for exact version tracing. The `latest` tag is only used in development.

## CI/CD Pipeline

**Platform:** GitHub Actions (or GitLab CI).

**Commit-level CI (runs on every PR):**
1. Lint (ruff for Python, ESLint + TypeScript for frontend)
2. Unit tests (backend + frontend)
3. Security scan (bandit for Python, npm audit)
4. Build Docker images (without pushing)

**Merge to main CI (runs on merge to main):**
1. All commit-level checks
2. Integration tests (against docker-compose test services)
3. AI pipeline regression tests (on a subset, < 10 minutes)
4. Build and push Docker images to ECR (tagged with commit SHA)
5. Deploy to staging (Kubernetes rollout with new image tag)
6. Smoke tests against staging
7. If smoke tests pass: mark commit as production-ready (requires manual promotion or auto-deploys after 30 minutes if no alarm fires on staging)

**Production deployment:**
- Kubernetes rolling deployment: one pod at a time, with readiness probe check before proceeding.
- Database migrations run as a Kubernetes Job before the deployment rollout.
- Canary deployment for major changes: 10% of traffic to new version for 30 minutes, monitoring error rates and latency. If metrics within bounds, complete rollout. If not, automatic rollback.

## Environment Configuration

All configuration via environment variables using pydantic-settings:
```python
class Settings(BaseSettings):
    DATABASE_URL: PostgresDsn
    REDIS_URL: RedisDsn
    AWS_S3_BUCKET: str
    OPENAI_API_KEY: SecretStr
    JWT_PRIVATE_KEY_ARN: str   # AWS KMS ARN
    QDRANT_URL: str
    ENVIRONMENT: Literal["development", "staging", "production"]
    
    class Config:
        env_file = ".env"
```

Secrets are fetched from AWS Secrets Manager on startup using `boto3`. The `OPENAI_API_KEY` environment variable is actually the Secrets Manager secret name, not the key itself.

## Rollback Strategy

**Application rollback:** Kubernetes deployment `kubectl rollout undo deployment/dociq-api`. This reverts to the previous deployment's image tag within seconds.

**Database migration rollback:** Alembic downgrade scripts are required for every migration. Before any migration, a database snapshot is taken automatically by the CI pipeline. The rollback procedure: revert application image → run `alembic downgrade -1` → verify.

**Rule:** Never deploy a database schema change that is backward-incompatible with the previous application version. This allows zero-downtime deployments (new code runs alongside old code against the new schema for the duration of the rolling deploy).

## Observability

- **Application metrics:** FastAPI instrumentation via `prometheus-fastapi-instrumentator`. Custom metrics: `dociq_documents_processed_total`, `dociq_extraction_confidence_histogram`, `dociq_pipeline_stage_duration_seconds`.
- **Infrastructure metrics:** Node exporter (CPU, memory, disk) + Qdrant built-in Prometheus endpoint + PostgreSQL exporter.
- **Distributed tracing:** OpenTelemetry SDK in FastAPI and workers. Traces exported to Jaeger (self-hosted) or AWS X-Ray. Every document processing pipeline execution has a trace ID that spans all worker stages.
- **Log aggregation:** All services log structured JSON to stdout. Fluent Bit DaemonSet collects logs and ships to CloudWatch Logs. Log format: `{timestamp, level, service, trace_id, org_id (when available), message, data}`.
- **Alerting:** PagerDuty integration for P1 alerts (pipeline down, API error rate > 5%, queue depth > 500). Email for P2 alerts (extraction confidence degradation, model accuracy drop).

---

# 22. Build Order

The following is the exact sequence in which to build DocIQ. Each item must be substantially complete before the next begins. This order respects data dependencies, test infrastructure needs, and product logic.

```
1.  Infrastructure baseline
    └── Docker Compose with PostgreSQL, Redis, MinIO, Qdrant

2.  Database schema (migrations)
    └── Core tables: organizations, users, roles, documents, document_pages

3.  Authentication API
    └── Register, login, JWT, refresh, logout
    └── Middleware: auth, org-context, audit log

4.  File upload API
    └── Pre-signed URL generation, S3 integration, document record creation

5.  Preprocessing worker
    └── Deskew, denoising, binarization, page extraction
    └── Queue consumer (Redis Streams) + queue producer pattern

6.  OCR worker
    └── PaddleOCR integration, digital-native fast path
    └── OCR output stored to document_pages

7.  Layout analysis worker
    └── PP-StructureV2 layout detection, table extraction
    └── Layout elements stored to document_pages

8.  Document classification worker
    └── DistilBERT classifier (pretrained, not fine-tuned yet)
    └── Classification result stored to documents

9.  Extraction schema definition (admin)
    └── Invoice, contract, KYC schemas defined in database
    └── Admin API endpoints for schema management

10. Extraction worker
    └── Rule-based extraction engine
    └── LLM extraction (GPT-4o-mini) with structured output
    └── Result merger and conflict flagging
    └── extracted_fields populated

11. Validation worker
    └── Format, range, cross-field validation
    └── Duplicate detection (exact hash)
    └── validation_results populated

12. Document viewer (frontend)
    └── PDF rendering, bounding box overlay
    └── Extracted fields panel with confidence
    └── Review + correction UI

13. Review queue (frontend)
    └── List, filters, priority sort
    └── Approve/reject actions
    └── Feedback storage

14. Feedback API
    └── Correction endpoint, feedback storage
    └── Basic analytics: correction rate per field

15. Basic analytics dashboard
    └── Volume, status distribution, queue depth
    └── Simple time-series charts

16. Embedding pipeline
    └── Semantic chunking, Qdrant ingestion
    └── Runs after document reaches APPROVED status

17. Semantic search API + UI
    └── Hybrid search, re-ranking
    └── Search results page with citation links

18. Q&A assistant
    └── RAG pipeline, streaming responses
    └── Citation-backed answers
    └── Chat UI

19. Workflow engine
    └── Trigger-condition-action model
    └── Email + webhook action handlers
    └── Workflow builder UI

20. SSO + RBAC hardening
    └── OAuth2/OIDC integration
    └── Custom roles, field-level permissions

21. External validation integrations
    └── ERP vendor/PO lookup hooks
    └── Configurable validation webhooks

22. Model fine-tuning pipeline
    └── Training data export from feedback
    └── LoRA fine-tuning workflow
    └── Model version management + canary deployment
```

---

# 23. Interview Explanation Guide

## One-Line Pitch

"DocIQ is an enterprise AI platform that turns any unstructured document — invoices, contracts, KYC packets — into structured, validated, searchable data, and routes that data into business workflows automatically."

## Product Problem (30 seconds)

"Enterprises process millions of documents that arrive in inconsistent formats. Today, people manually key data from invoices into ERP systems, paralegals spend days reviewing contracts, and compliance teams struggle to find documents in email archives. This is expensive, slow, and error-prone. Generic OCR tools extract text but don't understand structure, don't validate against business rules, and don't connect to downstream systems."

## Technical Architecture (2 minutes)

"DocIQ is a pipeline-first system. When a document is uploaded, it enters a multi-stage async pipeline: preprocessing with OpenCV to fix skew and noise, OCR with PaddleOCR for image-based documents, layout analysis to understand structure (tables, forms, paragraphs), classification to identify the document type, extraction using a hybrid of rule-based matching and LLM-structured output via GPT-4o-mini, and finally validation against configurable business rules.

The API is FastAPI (Python, async). Workers are Celery jobs consuming from Redis Streams. The primary database is PostgreSQL 16, with JSONB for flexible extraction data. Extracted content is chunked, embedded, and stored in Qdrant for semantic search and RAG Q&A.

The frontend is Next.js 15 with the key innovation being a bounding-box annotation layer: every extracted field is linked back to its exact pixel region on the document page, so reviewers can see exactly where data came from."

## AI Pipeline (2 minutes)

"The AI pipeline has several interesting design choices. For OCR, I use PaddleOCR PP-OCRv4, which handles complex layouts and tables far better than Tesseract for modern business documents. Digital-native PDFs skip OCR entirely via PyMuPDF text extraction.

For extraction, I use a hybrid approach: rule-based extraction using pattern matching and keyword proximity works great for templated documents from known vendors. LLM extraction handles free-form documents. The LLM is prompted with the extraction schema as a JSON Schema and required to ground each extracted value in a source text span — if the source span doesn't appear in the document, the value is rejected as a hallucination.

Confidence scoring is a first-class concern. Every field has a calibrated confidence score: a weighted combination of OCR quality in the source region, extraction method confidence, and validation pass rate. Fields below the threshold go to a human review queue. Anomaly detection uses statistical z-score analysis on historical values per vendor/document type."

## Design Tradeoffs (1 minute)

"The biggest tradeoff is accuracy vs latency. Making the extraction more accurate means more pipeline stages and potentially slower turnaround. I manage this by parallelizing independent stages (layout analysis and classification run in parallel), by caching OCR results for identical files, and by having a tiered confidence system: high-confidence documents are auto-approved in under 60 seconds, while complex documents go to human review.

For the architecture, I chose a modular monolith over microservices for v1. The pipeline stages are independently scalable as Celery queues, but they share one deployment. Splitting them into microservices too early would add network overhead and operational complexity before the pipeline design has stabilized.

For the LLM, I chose GPT-4o-mini over GPT-4o for extraction because the cost difference is 10x and accuracy for structured extraction from clear documents is nearly equivalent. GPT-4o is used only for Q&A synthesis where reasoning quality matters more."

## Scalability Story (1 minute)

"The system scales in three dimensions. Horizontally: more API pods (stateless, behind a load balancer) and more workers (each worker type scales independently based on queue depth). The OCR workers are the bottleneck so I target GPU-backed nodes for them specifically. Vertically: Qdrant handles 100M+ vectors with sub-100ms latency when properly indexed and run on NVMe SSDs. For the database, read-heavy queries hit a read replica, write-heavy operations hit the primary, and we use database connection pooling with asyncpg.

At 10M documents/month (roughly 330K/day), the system would need approximately 20 OCR worker pods (GPU), 10 extraction worker pods, 5 API pods, and a 3-node Qdrant cluster. That's achievable on Kubernetes with horizontal pod autoscaling triggered by queue depth metrics from Prometheus."

## Why It's Impressive

"What makes DocIQ technically interesting is the convergence of multiple AI disciplines in a production context: classical computer vision (preprocessing, OCR), information extraction NLP, document layout understanding, LLM-based reasoning with grounding constraints, vector search with hybrid retrieval, and RAG Q&A — all connected by a production-grade async pipeline with human-in-the-loop feedback that creates a continuously improving system.

Most demos show one piece. DocIQ shows how you connect OCR output quality to extraction confidence to human review rate to model retraining signals in a closed loop. That closed loop is what separates a production AI system from a research prototype."

## What Makes It Real (Not Toy)

- Multi-tenant from day one with row-level security
- Confidence is calibrated, not raw model output
- Every extraction is grounded and traceable to a bounding box
- Human corrections feed back into training signals
- The validation layer catches business logic errors, not just format errors
- Audit logs are immutable and compliance-ready
- The architecture handles failure gracefully (circuit breakers, dead letter queues, retry logic)
- The pipeline is idempotent: re-processing the same document produces the same result

---

# 24. Risks and Tradeoffs

## Risk 1: OCR Quality on Poor-Quality Documents

**Problem:** Mobile camera photos of documents, faxed documents, and documents printed on colored paper can have OCR character error rates > 15%, making extraction unreliable.

**Mitigation:** 
- The quality scoring step flags low-quality pages before OCR. Users are warned with a quality indicator.
- For critical document types (KYC identity documents), integrating a specialized ID document OCR API (Mindee, AWS Textract for ID) rather than general-purpose PaddleOCR.
- Fallback to human entry for pages with quality score < 0.3.

## Risk 2: LLM Hallucination in Extraction

**Problem:** The LLM invents field values that don't exist in the document, especially for complex or ambiguous layouts.

**Mitigation:**
- Mandatory source_text grounding: every LLM-extracted value must cite a text span that exists verbatim in the OCR output. If the cited text is not found within 10% fuzzy match tolerance, the value is rejected.
- Rule-based extraction provides an independent signal. LLM-only extractions (no rule agreement) require higher confidence threshold for auto-approval.
- Self-hosted models (Mistral) fine-tuned on known-good examples reduce hallucination on familiar document types.

## Risk 3: LLM API Cost at Scale

**Problem:** At 1M documents/month with average 3 LLM extraction calls per document, LLM costs can reach $30K–$50K/month with GPT-4o.

**Mitigation:**
- Use GPT-4o-mini (10x cheaper) for extraction. Reserve GPT-4o for Q&A synthesis.
- Fine-tune a self-hosted 7B model (Mistral 7B via vLLM) on the organization's specific document types. Self-hosted inference eliminates per-token costs at the cost of GPU infrastructure (~$2K/month for A100 cluster).
- Implement a confidence-gated LLM call: only call the LLM when rule-based extraction has low confidence or missing required fields. For well-templated documents from known vendors, rule extraction alone achieves > 95% field coverage.

## Risk 4: Search Quality Degradation at Scale

**Problem:** As the document corpus grows, semantic search results may include stale, low-quality, or irrelevant chunks that dilute result quality.

**Mitigation:**
- Soft-delete chunks when documents are archived (Qdrant point deletion).
- Post-search filtering: only surface results from documents with `validation_status = PASSED` by default (configurable).
- Document-level quality score filters: exclude chunks from documents with very low extraction confidence.
- Regular evaluation against a held-out search test set (RAGAS metrics). Alert if recall@10 drops > 5%.

## Risk 5: Vendor Lock-in to OpenAI

**Problem:** DocIQ's core extraction and Q&A quality depends on GPT-4o-mini and text-embedding-3-small. If OpenAI changes pricing, API behavior, or availability, the system breaks.

**Mitigation:**
- Abstract all LLM calls behind an `LLMProvider` interface. Swap implementations: OpenAI, Anthropic, AWS Bedrock, vLLM.
- Maintain a self-hosted inference path using vLLM + Mistral/Llama for all LLM operations. Slower to set up but provides full independence.
- For embeddings, maintain compatibility with nomic-embed-text (self-hosted, same or better quality for document retrieval).

## Risk 6: Pipeline Complexity and Debugging Difficulty

**Problem:** An async multi-stage pipeline with 8+ stages is hard to debug when something goes wrong with a specific document.

**Mitigation:**
- Every pipeline execution has a single `trace_id` (OpenTelemetry) that spans all stages. Given any `document_id`, you can retrieve the full trace in Jaeger.
- Each stage stores its full input and output in the `extraction_jobs` table (JSON). Admin UI shows the full pipeline run for any document.
- Pipeline stages are individually retriggerable from the admin API (e.g., "re-run extraction for document X from the OCR stage").

## Risk 7: Data Privacy / Regulatory Compliance for Sensitive Documents

**Problem:** KYC documents (passports, IDs) and financial documents are highly regulated. Sending them to OpenAI's API may violate data residency or privacy regulations.

**Mitigation:**
- EU and regulated deployments default to self-hosted AI pipeline (PaddleOCR + Mistral/Llama via vLLM + nomic-embed). Zero data leaves the organization's infrastructure.
- Data Processing Agreement with OpenAI available for enterprise tier; OpenAI's enterprise API has no training on customer data.
- PII fields extracted from identity documents are encrypted at application level before database storage.
- Right to erasure endpoint for GDPR compliance.

## Risk 8: Adoption and Change Management

**Problem:** Even the best platform fails if operations teams don't adopt it. Manual-process-dependent teams resist automation.

**Mitigation:**
- The review queue design is central. DocIQ never *removes* the human from the loop on day one — it makes the human's job faster and more accurate. This is an easier sell than "AI replaces your job."
- The confidence-based auto-approval threshold is configurable. Start it at 0.99 (almost nothing auto-approves) and lower it as the team builds trust in the system's accuracy.
- The bounding box annotation feature is key for trust: reviewers can see exactly why the system extracted what it did.

## Risk 9: Classification Model Cold Start

**Problem:** The document classifier needs labeled training data. On day one, there is no data.

**Mitigation:**
- Start with a zero-shot classification approach using LLM prompting: "This document appears to be [type] based on the following keywords: ...". This works for common document types without any training data.
- As documents are processed and humans correct misclassifications, training data accumulates naturally.
- Provide a library of pretrained schemas for standard document types (invoices, W-2s, standard NDAs) that are calibrated and ready to use out of the box.

## Risk 10: Qdrant Operational Complexity

**Problem:** Qdrant is relatively young infrastructure. Teams unfamiliar with vector databases may struggle with operations, backup, and recovery.

**Mitigation:**
- Use Qdrant Cloud (managed) for Phase 1 and 2. Migrate to self-hosted only when data residency requirements mandate it.
- Qdrant's snapshot API enables point-in-time backups to S3. Automate nightly snapshots.
- PostgreSQL `document_chunks` table serves as an index: if Qdrant data is lost, embeddings can be regenerated from document text (hours of work, not days).
```
