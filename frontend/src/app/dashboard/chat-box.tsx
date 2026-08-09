"use client";

import { Button } from "@dtf/registry/components/ui/button";
import { LoaderCircle, Send } from "lucide-react";
import * as React from "react";

export function ChatBox() {
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch("/dashboard/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const json = (await res.json()) as { answer?: string };
      setAnswer(json.answer ?? "No answer.");
    } catch {
      setAnswer("Chat failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void ask();
          }}
          placeholder="Ask about incidents…"
          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <Button size="sm" onClick={() => void ask()} disabled={loading || !question.trim()}>
          {loading ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Ask
        </Button>
      </div>
      {answer ? (
        <div className="overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
          {answer}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Ask Claude about the current incidents — root causes, suggested fixes, history.
        </div>
      )}
    </div>
  );
}
