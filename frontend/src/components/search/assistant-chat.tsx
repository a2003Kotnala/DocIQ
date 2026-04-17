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

  return (
    <div className="grid gap-4 xl:grid-cols-[1.35fr,0.65fr]">
      <Card className="p-5 lg:p-6">
        <div className="relative z-10 space-y-5">
          <div className="rounded-[24px] border border-sky-300/16 bg-sky-300/10 p-4 text-sm leading-6 text-slate-200">
            Ask about payment terms, exposure, exceptions, obligations, or anomalies. Answers should stay grounded in the documents your organization owns.
          </div>
          <div>
            <div className="metric-kicker">Question</div>
            <div className="mt-3 flex flex-col gap-3 lg:flex-row">
              <Input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What payment terms are repeated across high-value vendor contracts?"
              />
              <Button onClick={() => chat.mutate(question)}>
                <Sparkles className="h-4 w-4" />
                Ask DocIQ
              </Button>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <div className="metric-kicker">Answer</div>
            {chat.data ? (
              <>
                <p className="mt-4 text-sm leading-7 text-foreground">{chat.data.answer}</p>
                <div className="mt-4 text-xs uppercase tracking-[0.16em] text-muted">Confidence {chat.data.confidence}</div>
              </>
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
                className="flex w-full items-start gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] p-4 text-left transition hover:border-sky-300/20 hover:bg-sky-300/10"
                onClick={() => setQuestion(prompt)}
                type="button"
              >
                <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-sky-200" />
                <span className="text-sm leading-6 text-slate-200">{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
