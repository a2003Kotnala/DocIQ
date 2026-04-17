"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStreamingChat } from "@/hooks/useStreamingChat";

export function AssistantChat() {
  const [question, setQuestion] = useState("");
  const chat = useStreamingChat();

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
      <Card className="p-5">
        <div className="space-y-4">
          <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4 text-sm text-muted">
            Ask about payment terms, expiration dates, outlier invoices, or cross-document obligations. Answers should be citation-backed to your corpus.
          </div>
          <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What are the payment terms across our active Acme contracts?" />
          <Button onClick={() => chat.mutate(question)}>Ask DocIQ</Button>
          {chat.data ? (
            <div className="rounded-2xl border border-border bg-[#111521] p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Answer</div>
              <p className="mt-3 text-sm text-foreground">{chat.data.answer}</p>
              <div className="mt-4 text-xs text-muted">Confidence: {chat.data.confidence}</div>
            </div>
          ) : null}
        </div>
      </Card>
      <Card className="p-5">
        <div className="text-xs uppercase tracking-[0.18em] text-muted">Suggested prompts</div>
        <div className="mt-4 space-y-2 text-sm text-muted">
          <div>Show invoices above $50,000 awaiting approval.</div>
          <div>Which contracts expire next quarter?</div>
          <div>Find documents where payment details changed.</div>
        </div>
      </Card>
    </div>
  );
}

