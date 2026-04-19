This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Calling the paid endpoint

`POST /api/generate` is paywalled with [x402](https://github.com/coinbase/x402)
v2 (`exact` scheme) at **$0.01 USDC on Base mainnet** (`eip155:8453`),
settled through the CDP facilitator. **Real funds — not testnet.**

### Discovery

```bash
curl https://bundle-maker.vercel.app/.well-known/x402
# { "version": 2, "description": "...", "resources": ["https://bundle-maker.vercel.app/api/generate"] }
```

A direct call to `/api/generate` returns the x402 challenge:

```bash
curl -X POST https://bundle-maker.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"planning a vacation"}'
# HTTP/1.1 402 Payment Required
# payment-required: <base64-encoded JSON: scheme=exact, network=eip155:8453, amount=10000, asset=USDC>
```

### Pay programmatically with `@x402/fetch`

```ts
import { wrapFetchWithPayment } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const fetchWithPay = wrapFetchWithPayment(fetch, account);

const res = await fetchWithPay(
  "https://bundle-maker.vercel.app/api/generate",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "planning a vacation" }),
  }
);

const { markdown } = await res.json();
console.log(markdown);
```

### Response shape

```json
{ "markdown": "# Your bundle\n\n- ..." }
```

### Frontend gap

The browser UI in `app/page.tsx` calls `/api/generate` with plain `fetch` and
will receive a 402 in production. Wiring an in-browser paying client (e.g.
CDP embedded wallet + `@x402/fetch`) is a follow-up task.

### Required environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `EVM_ADDRESS` | server | recipient address for USDC payments (must be a Base-mainnet address you control) |
| `CDP_API_KEY_ID` | server | CDP facilitator credential (read by `@coinbase/x402`) |
| `CDP_API_KEY_SECRET` | server | CDP facilitator credential |
| `NEXT_PUBLIC_SITE_URL` | server, optional | absolute origin used by `/.well-known/x402`; falls back to inbound request origin |

# bundle-maker
