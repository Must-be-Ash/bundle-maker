"use client";

import { useIsSignedIn, useCurrentUser, useSignEvmTypedData } from "@coinbase/cdp-hooks";
import { useMemo } from "react";
import { wrapFetchWithPayment, x402Client } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";

const publicClient = createPublicClient({ chain: base, transport: http() });

/**
 * Recursively convert BigInt values to strings so CDP's signEvmTypedData
 * can JSON-serialize the typed data payload to send to their API.
 */
function bigIntToString(obj: unknown): unknown {
  if (typeof obj === "bigint") return obj.toString();
  if (Array.isArray(obj)) return obj.map(bigIntToString);
  if (obj !== null && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[k] = bigIntToString(v);
    }
    return out;
  }
  return obj;
}

/**
 * CDP's signEvmTypedData API requires an explicit EIP712Domain entry in `types`.
 * Most libraries (viem, ethers) omit it since it's inferred from `domain`.
 * Build it dynamically from the domain fields actually present.
 */
function ensureEIP712Domain(
  types: Record<string, unknown>,
  domain: Record<string, unknown>,
): Record<string, unknown> {
  if (types["EIP712Domain"]) return types;

  const fieldDefs: { key: string; type: string }[] = [
    { key: "name", type: "string" },
    { key: "version", type: "string" },
    { key: "chainId", type: "uint256" },
    { key: "verifyingContract", type: "address" },
    { key: "salt", type: "bytes32" },
  ];

  const eip712Domain = fieldDefs
    .filter(({ key }) => domain[key] !== undefined)
    .map(({ key, type }) => ({ name: key, type }));

  return { EIP712Domain: eip712Domain, ...types };
}

/**
 * Returns a payment-enabled fetch function that automatically handles x402 v2
 * 402 Payment Required responses using the user's CDP embedded wallet.
 *
 * Uses CDP's useSignEvmTypedData hook directly for EIP-712 signing.
 */
export function useFetchWithX402() {
  const { isSignedIn } = useIsSignedIn();
  const { currentUser } = useCurrentUser();
  const { signEvmTypedData } = useSignEvmTypedData();

  const eoaAddress = currentUser?.evmAccounts?.[0] as `0x${string}` | undefined;

  const fetchWithPayment = useMemo(() => {
    if (!isSignedIn || !eoaAddress) return null;

    const signer = {
      address: eoaAddress,
      signTypedData: async (message: {
        domain: Record<string, unknown>;
        types: Record<string, unknown>;
        primaryType: string;
        message: Record<string, unknown>;
      }) => {
        try {
          const { signature } = await signEvmTypedData({
            evmAccount: eoaAddress,
            typedData: {
              domain: bigIntToString(message.domain) as any,
              types: ensureEIP712Domain(message.types, message.domain) as any,
              primaryType: message.primaryType as any,
              message: bigIntToString(message.message) as any,
            },
          });
          return signature as `0x${string}`;
        } catch (err) {
          console.error("[x402] signEvmTypedData failed:", err);
          console.error("[x402] typed data was:", JSON.stringify({
            domain: bigIntToString(message.domain),
            types: message.types,
            primaryType: message.primaryType,
            message: bigIntToString(message.message),
          }, null, 2));
          throw err;
        }
      },
      readContract: (args: Parameters<typeof publicClient.readContract>[0]) =>
        publicClient.readContract(args),
    };

    const client = new x402Client().register(
      "eip155:8453",
      new ExactEvmScheme(signer as any)
    );

    return wrapFetchWithPayment(globalThis.fetch, client);
  }, [isSignedIn, eoaAddress, signEvmTypedData]);

  return { fetchWithPayment };
}
