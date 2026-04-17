"use client";

import { FileBadge2, LockKeyhole, UploadCloud } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createUploadUrl, confirmUpload } from "@/api/documents";
import { useAuthStore } from "@/stores/authStore";

export function FileUploadZone() {
  const token = useAuthStore((state) => state.accessToken);
  const [message, setMessage] = useState("Drop a PDF, image, or office document to begin secure ingestion.");

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length || !token) return;
    const file = files[0];
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
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
  }

  return (
    <Card className="border-dashed border-sky-300/20 p-8 lg:p-12">
      <div className="relative z-10 grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <div className="section-label">Secure ingestion</div>
            <h3 className="mt-4 font-display text-3xl text-foreground">Send documents directly into immutable storage with traceability from the first byte.</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{message}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="cursor-pointer">
              <input className="hidden" type="file" onChange={(event) => void handleFiles(event.target.files)} />
              <span className="inline-flex items-center gap-2 rounded-2xl border border-sky-300/30 bg-[linear-gradient(180deg,rgba(96,210,255,0.96),rgba(14,165,233,0.92))] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_44px_rgba(14,165,233,0.26)]">
                <UploadCloud className="h-4 w-4" />
                Choose file
              </span>
            </label>
            <Button variant="secondary" type="button">
              Presigned upload ready
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
            <div key={title} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-sky-100">
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
