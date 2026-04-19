"use client";

import { FileBadge2, LockKeyhole, UploadCloud } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createUploadUrl, confirmUpload } from "@/api/documents";
import { useAuthStore } from "@/stores/authStore";

export function FileUploadZone() {
  const token = useAuthStore((state) => state.accessToken);
  const [message, setMessage] = useState("Drop a PDF, image, or office document to begin secure ingestion.");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length || !token) return;
    setError(null);
    setIsUploading(true);
    const file = files[0];
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "pdf";

    try {
      const upload = await createUploadUrl(token, {
        filename: file.name,
        file_size_bytes: file.size,
        file_format: extension
      });
      await fetch(upload.upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream"
        },
        body: file
      });
      await confirmUpload(token, upload.document_id);
      setMessage(`Queued ${file.name} for preprocessing, OCR, classification, extraction, and validation.`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Upload failed");
      setMessage("Drop a PDF, image, or office document to begin secure ingestion.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card
      className={cn(
        "border-dashed p-8 lg:p-12",
        isDragging ? "border-[rgba(224,173,108,0.32)] bg-[rgba(200,147,74,0.04)]" : "border-[rgba(220,180,110,0.18)]"
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        void handleFiles(event.dataTransfer.files);
      }}
    >
      <div className="relative z-10 grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <div className="section-label">Secure ingestion</div>
            <h3 className="mt-4 font-display text-3xl text-foreground">Send documents directly into immutable storage with traceability from the first byte.</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{message}</p>
            {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer">
              <input
                className="hidden"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.tiff,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={(event) => void handleFiles(event.target.files)}
              />
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border border-[rgba(224,173,108,0.28)] bg-[linear-gradient(180deg,rgba(224,173,108,0.98),rgba(200,147,74,0.96))] px-5 py-3 text-sm font-semibold text-[#140f0a] shadow-[0_14px_30px_rgba(200,147,74,0.16)] transition hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(232,184,121,1),rgba(208,152,78,0.96))]",
                  isUploading ? "pointer-events-none opacity-70" : ""
                )}
              >
                {isUploading ? (
                  <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                {isUploading ? "Uploading..." : "Choose file"}
              </span>
            </label>
            <Button variant="secondary" type="button" disabled>
              Tenant isolation active
            </Button>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            { title: "Immutable storage", copy: "Raw originals remain preserved and versioned.", icon: LockKeyhole },
            {
              title: "Pipeline orchestration",
              copy: "Preprocessing, OCR, extraction, and validation continue asynchronously.",
              icon: UploadCloud
            },
            {
              title: "Operational visibility",
              copy: "Confidence, review routing, and audit logs appear immediately after ingest.",
              icon: FileBadge2
            }
          ].map(({ title, copy, icon: Icon }) => (
            <div key={title} className="rounded-[24px] border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-[rgba(220,180,110,0.12)] bg-[rgba(200,147,74,0.08)] text-accent">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
