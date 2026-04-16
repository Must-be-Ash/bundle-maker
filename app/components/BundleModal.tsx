"use client";

import { useState } from "react";
import type { Bundle } from "../lib/mock-bundles";
import { ModalShell } from "./ModalShell";

function useCopyToast() {
  const [toast, setToast] = useState<string | null>(null);
  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setToast(label);
    setTimeout(() => setToast(null), 2000);
  };
  return { toast, copy };
}

/* ─── Content component (used standalone or inside shared shell) ── */

export function BundleModalContent({
  bundle,
  onClose,
}: {
  bundle: Bundle;
  onClose: () => void;
}) {
  const { toast, copy } = useCopyToast();
  const dailyCost = bundle.estimatedCostPerRun * 100;
  const monthlyCost = dailyCost * 30;

  return (
    <div className="p-6 sm:p-8">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-[#fafafa] text-[#111111] text-sm px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          {toast}
        </div>
      )}

      <div className="mb-6 pr-8">
        <h2 className="text-xl font-semibold text-[#fafafa] mb-2">{bundle.name}</h2>
        <p className="text-sm text-[#a0a0a0] leading-relaxed">
          {bundle.description} ~${bundle.estimatedCostPerRun.toFixed(2)} per run via x402 on {bundle.chain}.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-[#fafafa] mb-3">Services in this bundle</h3>
        <div className="rounded-2xl bg-[#242424] overflow-hidden">
          <div className="px-4 py-3 space-y-1">
            {bundle.services.map((svc) => (
              <div
                key={svc.name}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center shrink-0 overflow-hidden">
                  {svc.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={svc.logoUrl} alt="" className="w-5 h-5 object-contain invert opacity-60" />
                  ) : (
                    <span className="text-xs font-semibold text-[#888888]">{svc.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-[#fafafa]">{svc.name}</h4>
                  <p className="text-xs text-[#888888] truncate">{svc.description}</p>
                </div>
                <span className="text-xs font-mono text-[#a0a0a0] shrink-0">{svc.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-[#fafafa] mb-3">Estimated cost per run</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-[#242424]">
            <div className="text-xs text-[#888888] mb-1">Per run</div>
            <div className="text-lg font-semibold text-[#fafafa]">~${bundle.estimatedCostPerRun.toFixed(2)}</div>
            <div className="text-[10px] text-[#888888]">USDC on {bundle.chain}</div>
          </div>
          <div className="p-3 rounded-xl bg-[#242424]">
            <div className="text-xs text-[#888888] mb-1">100 runs/day</div>
            <div className="text-lg font-semibold text-[#fafafa]">~${dailyCost.toFixed(2)}</div>
            <div className="text-[10px] text-[#888888]">${monthlyCost.toFixed(0)}/month</div>
          </div>
          <div className="p-3 rounded-xl bg-[#242424]">
            <div className="text-xs text-[#888888] mb-1">Services</div>
            <div className="text-lg font-semibold text-[#fafafa]">{bundle.services.length}</div>
            <div className="text-[10px] text-[#888888]">chained calls</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#fafafa]">Skill.md — Drop into your Agent</h3>
          <button
            onClick={() => copy(bundle.skillMd, "Skill copied!")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full bg-[#333333] text-[#fafafa] hover:bg-[#444444] transition-colors cursor-pointer"
          >
            Copy skill
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-[#888888] mb-3">
          Generated config file. Copy this into your agent&apos;s skill directory to get started immediately.
        </p>
        <div className="bg-[#0a0a0a] rounded-2xl p-5 overflow-x-auto max-h-64 overflow-y-auto border border-[#333333]">
          <pre className="text-[12px] font-mono text-[#a0a0a0] leading-relaxed whitespace-pre-wrap">
            {bundle.skillMd}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ─── Wrapped modal (used standalone) ───────────────────────────── */

export function BundleModal({
  bundle,
  open,
  onClose,
}: {
  bundle: Bundle;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <BundleModalContent bundle={bundle} onClose={onClose} />
    </ModalShell>
  );
}
