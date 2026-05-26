"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MessageCircle, X, Send, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type ApiHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type UiMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatApiResponse = {
  answer?: string;
  error?: string;
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveChatEndpoint(apiBaseUrl?: string): string {
  if (!apiBaseUrl) return "/api/chat";
  const base = apiBaseUrl.replace(/\/$/, "");
  if (base.endsWith("/api")) return `${base}/chat`;
  return `${base}/api/chat`;
}

export function ChatLauncher({
  name,
  apiBaseUrl,
}: {
  name: string;
  apiBaseUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! Ask me anything about ${name.split(" ")[0]}'s projects, experience, or background.`,
    },
  ]);
  const reduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const chatEndpoint = useMemo(() => resolveChatEndpoint(apiBaseUrl), [apiBaseUrl]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  async function sendMessage() {
    const question = draft.trim();
    if (!question || loading) return;

    const userMessage: UiMessage = {
      id: makeId(),
      role: "user",
      content: question,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setLoading(true);

    try {
      const history: ApiHistoryMessage[] = nextMessages
        .filter(
          (m): m is UiMessage & { role: "user" | "assistant" } =>
            m.role === "user" || m.role === "assistant"
        )
        .slice(-12)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch(chatEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
          history,
        }),
      });

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: "system",
            content: data.error || "Chat request failed.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: data.answer || "I could not generate a response.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "system",
          content: "Network error while contacting the chat backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : `Ask ${name.split(" ")[0]} a question`}
        aria-expanded={open}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full",
          "bg-accent text-accent-foreground shadow-lg shadow-accent/30",
          "flex items-center justify-center",
          "hover:scale-105 active:scale-95 transition-transform",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={reduced ? false : { rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={reduced ? false : { rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop on mobile */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              key="panel"
              role="dialog"
              aria-label={`Chat with ${name}'s assistant`}
              className={cn(
                "fixed z-40",
                "bottom-24 right-6 sm:bottom-24 sm:right-6",
                "left-4 sm:left-auto",
                "w-auto sm:w-[400px] max-w-[calc(100vw-2rem)]",
                "h-[70vh] sm:h-[560px] max-h-[calc(100vh-8rem)]",
                "rounded-2xl border border-border bg-card shadow-2xl",
                "flex flex-col overflow-hidden"
              )}
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 16, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 16, scale: 0.96 }
              }
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Header */}
              <header className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <h2 className="font-semibold text-sm">
                    Ask {name.split(" ")[0]}
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X size={16} />
                </button>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm whitespace-pre-wrap",
                      message.role === "user" &&
                        "ml-8 bg-accent text-accent-foreground",
                      message.role === "assistant" &&
                        "mr-8 bg-muted text-foreground",
                      message.role === "system" &&
                        "bg-amber-100/80 text-amber-900 border border-amber-300"
                    )}
                  >
                    {message.content}
                  </div>
                ))}

                {loading && (
                  <div className="mr-8 bg-muted text-foreground rounded-xl px-3 py-2 text-sm flex items-center gap-2">
                    <LoaderCircle size={14} className="animate-spin" />
                    Thinking...
                  </div>
                )}
              </div>

              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void sendMessage();
                      }
                    }}
                    placeholder="Ask about projects, experience, skills..."
                    className="w-full rounded-lg bg-muted/60 border border-border px-3 py-2 text-sm placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => void sendMessage()}
                    disabled={loading || draft.trim().length === 0}
                    aria-label="Send message"
                    className={cn(
                      "h-9 w-9 rounded-lg inline-flex items-center justify-center",
                      "bg-accent text-accent-foreground transition-opacity",
                      "disabled:opacity-40 disabled:cursor-not-allowed"
                    )}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
