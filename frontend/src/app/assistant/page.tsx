import { AssistantChat } from "@/components/search/assistant-chat";
import { AppShell } from "@/components/layout/app-shell";

export default function AssistantPage() {
  return (
    <AppShell title="Q&A Assistant" subtitle="Ask grounded questions over enterprise documents and require citation-backed answers.">
      <AssistantChat />
    </AppShell>
  );
}

