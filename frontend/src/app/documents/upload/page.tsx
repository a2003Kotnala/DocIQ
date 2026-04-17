import { FileUploadZone } from "@/components/document/file-upload-zone";
import { AppShell } from "@/components/layout/app-shell";

export default function UploadPage() {
  return (
    <AppShell title="Upload Center" subtitle="Send documents directly into immutable storage, then let preprocessing and OCR continue asynchronously.">
      <FileUploadZone />
    </AppShell>
  );
}

