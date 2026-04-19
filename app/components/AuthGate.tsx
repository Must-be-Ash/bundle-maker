"use client";

import { useEffect, useState } from "react";
import { useIsSignedIn, useCurrentUser } from "@coinbase/cdp-hooks";
import { SignInModal } from "@coinbase/cdp-react";
import { createPublicClient, http, formatUnits } from "viem";
import { base } from "viem/chains";
import { GlowButton } from "@/components/ui/glow-button";
import { FundStep } from "./FundStep";

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

interface AuthGateProps {
  requiredUsdc: number;
  children: React.ReactNode;
}

export function AuthGate({ requiredUsdc, children }: AuthGateProps) {
  const { isSignedIn } = useIsSignedIn();
  const { currentUser } = useCurrentUser();
  const evmAddress = currentUser?.evmAccounts?.[0] as
    | `0x${string}`
    | undefined;

  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!isSignedIn || !evmAddress) {
      setBalance(null);
      return;
    }

    let cancelled = false;
    const poll = async () => {
      try {
        const result = await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: USDC_ABI,
          functionName: "balanceOf",
          args: [evmAddress],
        });
        if (!cancelled) setBalance(parseFloat(formatUnits(result, USDC_DECIMALS)));
      } catch {
        // network blip — keep last known value
      }
    };

    poll();
    const id = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isSignedIn, evmAddress]);

  if (!isSignedIn || !evmAddress) {
    return (
      <div className="w-full max-w-2xl flex flex-col items-center gap-4 p-8 rounded-2xl border border-white/10 bg-white/5">
        <p className="text-sm text-muted-foreground text-center">
          Sign in to generate bundles. Each generation costs $0.01 USDC on
          Base.
        </p>
        <SignInModal>
          <GlowButton>Sign in to start</GlowButton>
        </SignInModal>
      </div>
    );
  }

  if (balance !== null && balance < requiredUsdc) {
    return <FundStep address={evmAddress} required={requiredUsdc} balance={balance} />;
  }

  return <>{children}</>;
}
