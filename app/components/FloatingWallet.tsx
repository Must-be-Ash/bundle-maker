"use client";

import { useCurrentUser, useIsSignedIn, useSignOut } from "@coinbase/cdp-hooks";
import {
  RefreshCw,
  Wallet,
  Copy,
  Check,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPublicClient, http, formatUnits } from "viem";
import { base } from "viem/chains";

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
const USDC_DECIMALS = 6;
const USDC_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const publicClient = createPublicClient({ chain: base, transport: http() });

export function FloatingWallet() {
  const { isSignedIn } = useIsSignedIn();
  const { currentUser } = useCurrentUser();
  const { signOut } = useSignOut();

  const evmAddress = currentUser?.evmAccounts?.[0] as
    | `0x${string}`
    | undefined;

  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!isSignedIn || !evmAddress) {
      setBalance(null);
      return;
    }
    let cancelled = false;
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const result = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: USDC_ABI,
          functionName: "balanceOf",
          args: [evmAddress],
        });
        if (!cancelled)
          setBalance(parseFloat(formatUnits(result, USDC_DECIMALS)));
      } catch {
        // network blip — keep last known
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBalance();
    const id = setInterval(fetchBalance, 10000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isSignedIn, evmAddress]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleManualRefresh = async () => {
    if (!evmAddress || loading) return;
    try {
      setLoading(true);
      const result = await publicClient.readContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "balanceOf",
        args: [evmAddress],
      });
      setBalance(parseFloat(formatUnits(result, USDC_DECIMALS)));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!evmAddress) return;
    await navigator.clipboard.writeText(evmAddress);
    setCopied(true);
  };

  if (!isSignedIn || !evmAddress) return null;

  const truncated = `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}`;
  const balanceLabel =
    balance !== null ? `$${balance.toFixed(2)}` : "$0.00";

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-6 z-50"
    >
      {/* Expanded panel — sits ABOVE the button */}
      {isOpen && (
        <div
          className="absolute bottom-full left-0 mb-3 w-72 rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/10"
          style={{
            boxShadow:
              "0 20px 50px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
          }}
        >
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/5">
                  <Wallet className="w-4 h-4 text-foreground/80" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Wallet
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleManualRefresh();
                }}
                disabled={loading}
                className="p-1.5 rounded-lg transition-colors disabled:opacity-50 hover:bg-white/5"
                aria-label="Refresh balance"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-muted-foreground ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">
                Balance
              </span>
              <div className="p-3 rounded-xl bg-white/5">
                <span className="text-xl font-bold text-foreground">
                  {balance !== null ? `$${balance.toFixed(2)}` : "Loading..."}
                </span>
                <br />
                <span className="text-xs text-muted-foreground">
                  USDC on Base
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Address
                </span>
                {copied && (
                  <span className="text-xs font-medium text-emerald-400">
                    Copied!
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
                className="w-full flex items-center justify-between gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="font-mono text-xs text-foreground/80">
                  {truncated}
                </span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                )}
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                signOut();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-white/5 hover:bg-white/10 text-foreground/80 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating pill button — bold, 3D, sticky */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative inline-flex items-center gap-2.5 pl-4 pr-3.5 py-3 rounded-full bg-[#0052FF] text-white font-semibold text-sm transition-transform duration-150 active:scale-95 hover:-translate-y-0.5"
        style={{
          boxShadow:
            "0 10px 25px -5px rgba(0,82,255,0.55), 0 4px 12px -2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.2)",
        }}
      >
        <Wallet className="w-4 h-4 drop-shadow" />
        <span className="font-mono tracking-tight tabular-nums">
          {balanceLabel}
        </span>
        <span className="hidden sm:inline font-mono text-[11px] opacity-70 border-l border-white/25 pl-2">
          {truncated}
        </span>
        <ChevronUp
          className={`w-3.5 h-3.5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
