"use client";

import { useState } from "react";
import { GlowButton } from "@/components/ui/glow-button";
import { Textarea } from "@/components/ui/textarea";

export function BundleGenerator() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      if (res.status === 402) {
        throw new Error(
          "Payment required — this endpoint costs $0.01 USDC on Base. Pay with an x402-enabled client to generate a bundle."
        );
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to generate bundle. Please try again.");
      }

      const data = await res.json();
      setOutput(data.markdown ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Create Your Own Bundle
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Describe what you need and we&apos;ll find the right APIs for you
      </p>

      <div className="flex flex-col gap-3 mb-6 w-full max-w-2xl">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Plan me a vacation, Help me hire developers, Create a marketing campaign..."
          className="min-h-[48px] max-h-32 resize-none rounded-xl bg-[#1a1a1a] border-[#333333] text-foreground placeholder:text-muted-foreground focus:border-[#555555] focus:ring-[#555555]/20 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />
        <GlowButton
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full py-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Bundle"
          )}
        </GlowButton>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 w-full max-w-2xl">
          {error}
        </div>
      )}

      {output && (
        <div className="relative w-full max-w-2xl text-left">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[#333333] text-[#fafafa] hover:bg-[#444444] transition-colors cursor-pointer"
          >
            {copied ? "Copied!" : "Copy"}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>

          <div className="bg-[#0a0a0a] rounded-2xl p-5 overflow-x-auto max-h-[500px] overflow-y-auto border border-[#333333]">
            <pre className="text-[12px] font-mono text-[#a0a0a0] leading-relaxed whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
