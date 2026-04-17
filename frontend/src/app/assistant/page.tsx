import { AssistantChat } from "@/components/search/assistant-chat";
import { AppShell } from "@/components/layout/app-shell";

export default function AssistantPage() {
  return (
    <AppShell
      eyebrow="Grounded Q&A"
      title="Ask questions over enterprise documents and demand citation-backed answers."
      subtitle="DocIQ keeps question answering grounded in your tenant-scoped corpus so users can move from retrieval to action without leaving the platform."
    >
      <AssistantChat />
    </AppShell>
  );
}
