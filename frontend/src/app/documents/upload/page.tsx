import { FileUploadZone } from "@/components/document/file-upload-zone";
import { AppShell } from "@/components/layout/app-shell";

export default function UploadPage() {
  return (
    <AppShell
      eyebrow="Ingestion"
      title="Secure upload center for enterprise documents entering the intelligence pipeline."
      subtitle="Raw files land in immutable storage first, then preprocessing, OCR, classification, extraction, validation, and review routing continue asynchronously."
    >
      <FileUploadZone />
    </AppShell>
  );
}
