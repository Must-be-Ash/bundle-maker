"use client";

import { useState } from "react";
import { useSignOut } from "@coinbase/cdp-hooks";
import { QRCodeSVG } from "qrcode.react";
import { Wallet, Copy, Check, LogOut } from "lucide-react";

interface FundStepProps {
  address: `0x${string}`;
  required: number;
  balance: number;
}

export function FundStep({ address, required, balance }: FundStepProps) {
  const { signOut } = useSignOut();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/10 bg-white/5">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          Fund your wallet
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          You need at least ${required.toFixed(2)} USDC to generate a bundle.
          Current balance: ${balance.toFixed(4)}.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white">
        <QRCodeSVG
          value={`ethereum:${address}`}
          size={180}
          level="M"
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>

      <div className="w-full p-4 rounded-xl space-y-2 bg-white/5">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <p className="text-xs font-semibold text-emerald-400">
            Your wallet address
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="w-full font-mono text-xs text-left break-all px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <span className="flex-1">{address}</span>
          {copied ? (
            <Check className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
          )}
        </button>
        <p className="text-xs text-muted-foreground">Send USDC on Base</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 rounded-full animate-pulse bg-blue-400" />
        Waiting for funds...
      </div>

      <button
        onClick={() => signOut()}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
      >
        <LogOut className="w-3 h-3" />
        Sign out
      </button>
    </div>
  );
}
