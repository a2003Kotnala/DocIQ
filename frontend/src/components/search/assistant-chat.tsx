"use client";

import { useState } from "react";
import { MessageSquareQuote, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStreamingChat } from "@/hooks/useStreamingChat";

export function AssistantChat() {
  const [question, setQuestion] = useState("");
  const chat = useStreamingChat();
  const canSubmit = question.trim().length > 0 && !chat.isPending;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr,0.65fr]">
      <Card className="p-5 lg:p-6">
        <div className="relative z-10 space-y-5">
          <div className="rounded-[22px] border border-[rgba(220,180,110,0.14)] bg-[rgba(200,147,74,0.06)] p-4 text-sm leading-6 text-muted">
            Ask about payment terms, exposure, exceptions, obligations, or anomalies. Answers should stay grounded in the documents your organization owns.
          </div>
          <div>
            <div className="metric-kicker">Question</div>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row">
              <Input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What payment terms are repeated across high-value vendor contracts?"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && canSubmit) chat.mutate(question.trim());
                }}
              />
              <Button isLoading={chat.isPending} onClick={() => chat.mutate(question.trim())} disabled={!canSubmit}>
                <Sparkles className="h-4 w-4" />
                Ask DocIQ
              </Button>
            </div>
          </div>
          <div className="rounded-[24px] border border-[rgba(220,180,110,0.14)] bg-[rgba(255,255,255,0.02)] p-5">
            <div className="metric-kicker">Answer</div>
            {chat.data ? (
              <>
                <p className="mt-4 text-sm leading-7 text-foreground">{chat.data.answer}</p>
                <div className="mt-4 text-xs uppercase tracking-[0.16em] text-muted">Confidence {chat.data.confidence}</div>
                {chat.data.citations.length ? (
                  <div className="mt-5 space-y-3">
                    <div className="metric-kicker">Citations</div>
                    {chat.data.citations.slice(0, 4).map((citation) => (
                      <div
                        key={`${citation.document_id}-${citation.page_number}-${citation.excerpt.slice(0, 12)}`}
                        className="rounded-[18px] border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-4 text-sm text-muted"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm font-medium text-foreground">{citation.document_name}</div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--text-3)]">
                            Page {citation.page_number}
                          </div>
                        </div>
                        <p className="mt-2 text-[11.5px] leading-6 text-muted">{citation.excerpt}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </>
            ) : chat.isError ? (
              <p className="mt-4 text-sm leading-6 text-danger">
                {(chat.error instanceof Error ? chat.error.message : "Unable to answer right now.").toString()}
              </p>
            ) : (
              <p className="mt-4 text-sm leading-6 text-muted">
                Generated answers will appear here with confidence and document citations once a question has been submitted.
              </p>
            )}
          </div>
        </div>
      </Card>
      <Card className="p-5 lg:p-6">
        <div className="relative z-10">
          <div className="metric-kicker">Suggested prompts</div>
          <div className="mt-5 space-y-3">
            {[
              "Show invoices above $50,000 awaiting approval.",
              "Which contracts expire next quarter?",
              "Find documents where payment details changed.",
              "Which vendors appear in duplicate onboarding packets?"
            ].map((prompt) => (
              <button
                key={prompt}
                className="flex w-full items-start gap-3 rounded-[22px] border border-[rgba(220,180,110,0.12)] bg-[rgba(255,255,255,0.02)] p-4 text-left transition hover:border-[rgba(220,180,110,0.22)] hover:bg-[rgba(220,180,110,0.05)]"
                onClick={() => setQuestion(prompt)}
                type="button"
              >
                <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm leading-6 text-foreground">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
