import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const origin = configured?.replace(/\/$/, "") ?? new URL(request.url).origin;

  const body = `# Bundle Maker

> Generates curated bundles of x402-paid API endpoints from a natural-language prompt. Pay $0.01 USDC on Base mainnet per generation.

Bundle Maker takes a free-form goal ("planning a vacation", "help me hire developers", "marketing campaign for a SaaS") and returns a markdown checklist of 5–15 paid x402 endpoints — with prices, methods, and example calls — that an AI agent can chain together to accomplish the goal.

The generator endpoint is paywalled with [x402 v2](https://github.com/coinbase/x402) (\`exact\` scheme), settled through the Coinbase Developer Platform facilitator on Base mainnet (\`eip155:8453\`).

## How an agent should use this site

1. Discover the resource: \`GET ${origin}/.well-known/x402\`
2. Inspect the OpenAPI spec: \`GET ${origin}/openapi.json\`
3. Call the generator: \`POST ${origin}/api/generate\` with body \`{ "prompt": "<your goal>" }\`
   - First call returns HTTP 402 with payment requirements in the \`payment-required\` header.
   - Pay $0.01 USDC on Base via x402 (e.g. \`@x402/fetch\`) and retry.
   - Successful response: \`{ "markdown": "..." }\`

## Endpoints

- [x402 discovery](${origin}/.well-known/x402): Standard resource index
- [OpenAPI spec](${origin}/openapi.json): Machine-readable API description
- [Generator (paywalled)](${origin}/api/generate): The bundle generator

## Payment

- Network: Base mainnet (\`eip155:8453\`)
- Asset: USDC (\`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\`)
- Price: $0.01 per call (10000 atomic units)
- Scheme: x402 v2 \`exact\` (EVM)
- Facilitator: CDP (\`@coinbase/x402\`)

## Source

Built on Next.js 16, React 19, \`@x402/next\`, and the Coinbase Developer Platform.
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
