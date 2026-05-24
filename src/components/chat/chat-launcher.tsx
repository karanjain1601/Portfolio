"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MessageCircle, X, Construction } from "lucide-react";
import { cn } from "@/lib/cn";

export function ChatLauncher({
  name,
  apiBaseUrl,
}: {
  name: string;
  apiBaseUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const hasBackend = Boolean(apiBaseUrl);
  const backendHost = apiBaseUrl
    ? (() => {
        try {
          return new URL(apiBaseUrl).host;
        } catch {
          return apiBaseUrl;
        }
      })()
    : null;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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

              {/* Body — placeholder */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-10">
                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-5 text-accent">
                  <Construction size={26} />
                </div>
                <h3 className="font-semibold text-lg">Work in progress</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-[28ch]">
                  This is where you&apos;ll be able to ask questions about my
                  projects, experience, and background. Coming soon.
                </p>
                <p className="mt-4 text-xs text-muted-foreground max-w-[32ch]">
                  {hasBackend
                    ? `Backend configured: ${backendHost}`
                    : "Backend not configured. Set NEXT_PUBLIC_CHAT_API_URL to connect your Python chatbot API."}
                </p>
                <p className="mt-6 text-xs text-muted-foreground">
                  In the meantime, feel free to{" "}
                  <Link
                    href="/contact"
                    className="text-accent hover:underline underline-offset-2"
                  >
                    reach out directly
                  </Link>
                  .
                </p>
              </div>

              {/* Disabled input row — gives a preview of the eventual UI */}
              <div className="border-t border-border p-3">
                <div className="relative">
                  <input
                    disabled
                    placeholder="Chat coming soon…"
                    aria-disabled="true"
                    className="w-full rounded-lg bg-muted/60 border border-border px-3 py-2 text-sm placeholder:text-muted-foreground cursor-not-allowed"
                  />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
