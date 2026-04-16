"use client";

import { useEffect, useRef, useState } from "react";
import { BUNDLES, type Bundle } from "../lib/mock-bundles";
import { BundleModalContent } from "./BundleModal";
import { ModalShell } from "./ModalShell";

/* ─── Trending Bundles — Netflix Top 10 style ───────────────────── */

export function TrendingBundles() {
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft < maxScrollLeft - 1);
    };

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const maskImage =
    canScrollLeft && canScrollRight
      ? "linear-gradient(to right, transparent, black 2%, black 98%, transparent)"
      : canScrollRight
        ? "linear-gradient(to right, black 0%, black 98%, transparent)"
        : canScrollLeft
          ? "linear-gradient(to right, transparent, black 2%, black 100%)"
          : "none";

  return (
    <div className="mb-4">

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        <div className="flex gap-2 pb-2 px-8 sm:px-4">
          {BUNDLES.map((bundle, i) => (
            <button
              key={bundle.id}
              onClick={() => setSelectedBundle(bundle)}
              className="group shrink-0 w-[260px] sm:w-[280px] flex items-end relative cursor-pointer"
            >
              {/* Large rank number */}
              <span
                className="text-[120px] sm:text-[140px] font-bold leading-none select-none shrink-0 relative -mr-3 z-0"
                style={{
                  WebkitTextStroke: "2px #333333",
                  color: "transparent",
                  fontFamily: "'Coinbase Sans', system-ui, sans-serif",
                }}
              >
                {i + 1}
              </span>

              {/* Card */}
              <div className="relative z-10 flex-1 min-w-0 h-[200px] bg-[#1a1a1a] border border-[#333333] rounded-2xl p-5 mb-2 flex flex-col transition-all duration-200 group-hover:bg-[#555555] group-hover:border-[#555555] group-hover:shadow-none">
                <h4 className="text-base font-semibold text-[#fafafa] truncate mb-1.5 text-left transition-colors duration-200">
                  {bundle.name}
                </h4>
                <p className="text-xs text-[#888888] group-hover:text-[#cccccc] line-clamp-2 leading-relaxed text-left flex-1 transition-colors duration-200">
                  {bundle.description}
                </p>

                {/* Bottom row: price left, avatar circles right */}
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-mono text-[#a0a0a0] group-hover:text-[#e0e0e0] transition-colors duration-200">
                    ~${bundle.estimatedCostPerRun.toFixed(2)}/run
                  </span>

                  {/* Overlapping service logo circles */}
                  <div className="flex -space-x-3">
                    {bundle.services.map((svc, idx) => (
                      <div
                        key={svc.name}
                        className="relative w-7 h-7 rounded-full bg-[#242424] group-hover:bg-[#444444] border-2 border-[#1a1a1a] group-hover:border-[#555555] flex items-center justify-center overflow-hidden transition-colors duration-200"
                        style={{ zIndex: bundle.services.length - idx }}
                      >
                        {svc.logoUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={svc.logoUrl} alt={svc.name} className="w-4 h-4 object-contain invert opacity-60 group-hover:opacity-80 transition-all duration-200" />
                        ) : (
                          <span className="text-[8px] font-bold text-[#888888]">{svc.name.charAt(0)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bundle detail modal */}
      <ModalShell open={selectedBundle !== null} onClose={() => setSelectedBundle(null)}>
        {selectedBundle && (
          <BundleModalContent
            bundle={selectedBundle}
            onClose={() => setSelectedBundle(null)}
          />
        )}
      </ModalShell>
    </div>
  );
}
