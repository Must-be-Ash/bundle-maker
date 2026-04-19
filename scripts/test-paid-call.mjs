import "dotenv/config";
import { privateKeyToAccount } from "viem/accounts";
import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";

const URL =
  process.argv[2] || "https://bundle-maker.vercel.app/api/generate";
const PROMPT = process.argv[3] || "planning a vacation";

const pk = process.env.WALLET_PRIVATE_KEY;
if (!pk) throw new Error("WALLET_PRIVATE_KEY missing in .env.local");

const account = privateKeyToAccount(pk.startsWith("0x") ? pk : `0x${pk}`);
console.log("Paying from wallet:", account.address);

const client = new x402Client();
registerExactEvmScheme(client, { signer: account });

const fetchWithPay = wrapFetchWithPayment(globalThis.fetch, client);

console.log(`POST ${URL} with prompt: "${PROMPT}"`);
const res = await fetchWithPay(URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: PROMPT }),
});

console.log("\n=== Response status ===");
console.log(res.status, res.statusText);

console.log("\n=== Response headers (payment-related) ===");
for (const [k, v] of res.headers.entries()) {
  if (k.toLowerCase().includes("payment") || k === "content-type") {
    if (k.toLowerCase().includes("payment")) {
      try {
        const decoded = JSON.parse(Buffer.from(v, "base64").toString("utf8"));
        console.log(`  ${k} (decoded):`);
        console.log(JSON.stringify(decoded, null, 4).split("\n").map((l) => "    " + l).join("\n"));
      } catch {
        console.log(`  ${k}: ${v}`);
      }
    } else {
      console.log(`  ${k}: ${v}`);
    }
  }
}

const ct = res.headers.get("content-type") || "";
if (ct.includes("application/json")) {
  const data = await res.json();
  console.log("\n=== Response body (JSON) ===");
  if (typeof data?.markdown === "string") {
    console.log("--- markdown field ---\n");
    console.log(data.markdown);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
} else {
  console.log("\n=== Response body (text) ===");
  console.log(await res.text());
}
