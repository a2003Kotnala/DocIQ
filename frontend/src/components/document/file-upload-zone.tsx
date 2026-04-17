"use client";

import { UploadCloud } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createUploadUrl, confirmUpload } from "@/api/documents";
import { useAuthStore } from "@/stores/authStore";

export function FileUploadZone() {
  const token = useAuthStore((state) => state.accessToken);
  const [message, setMessage] = useState("Drop a PDF, image, or office document to begin processing.");

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
    setMessage(`Queued ${file.name} for preprocessing and OCR.`);
  }

  return (
    <Card className="border-dashed border-accent/40 p-10">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4">
          <UploadCloud className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-foreground">Ingest a document into the pipeline</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted">{message}</p>
        </div>
        <label className="cursor-pointer">
          <input className="hidden" type="file" onChange={(event) => void handleFiles(event.target.files)} />
          <Button>Choose File</Button>
        </label>
      </div>
    </Card>
  );
}

