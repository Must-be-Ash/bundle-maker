import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const origin = configured?.replace(/\/$/, "") ?? new URL(request.url).origin;

  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Bundle Maker",
      version: "1.0.0",
      description:
        "Generate curated bundles of x402 paid API endpoints from a natural-language prompt. Each call is gated by x402 v2 (`exact` scheme) at $0.01 USDC on Base mainnet.",
      contact: { url: `${origin}/.well-known/x402` },
    },
    servers: [{ url: origin }],
    paths: {
      "/api/generate": {
        post: {
          summary: "Generate a curated x402 bundle",
          description:
            "Returns a markdown bundle describing 5–15 paid API endpoints relevant to the user's prompt. **Paywalled**: the first call returns HTTP 402 with payment requirements in the `payment-required` header. Pay via x402 (e.g. `@x402/fetch`) and retry.",
          operationId: "generateBundle",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["prompt"],
                  properties: {
                    prompt: {
                      type: "string",
                      description:
                        "Describe the bundle you want (e.g. 'planning a vacation', 'help me hire developers').",
                      example: "planning a vacation",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful generation. Payment settled on-chain.",
              headers: {
                "payment-response": {
                  description:
                    "Base64-encoded JSON of the x402 settlement result (success, payer, transaction hash, network).",
                  schema: { type: "string" },
                },
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["markdown"],
                    properties: {
                      markdown: {
                        type: "string",
                        description: "Markdown-formatted bundle recommendation.",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Missing or empty prompt.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { error: { type: "string" } },
                  },
                },
              },
            },
            "402": {
              description:
                "Payment required. Inspect the `payment-required` header for the x402 v2 challenge (base64-encoded JSON: scheme, network, asset, amount, payTo, etc.).",
              headers: {
                "payment-required": {
                  description:
                    "Base64-encoded JSON describing accepted payment options.",
                  schema: { type: "string" },
                },
              },
              content: {
                "application/json": { schema: { type: "object" } },
              },
            },
            "500": {
              description: "Generator failed (Anthropic outage, etc.).",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: { error: { type: "string" } },
                  },
                },
              },
            },
          },
          "x-x402-payment": {
            version: 2,
            scheme: "exact",
            network: "eip155:8453",
            asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            amount: "10000",
            amountUsd: "0.01",
            facilitator: "cdp",
          },
        },
      },
      "/.well-known/x402": {
        get: {
          summary: "x402 resource discovery",
          description:
            "Standard x402 v2 discovery endpoint. Returns the list of paywalled resources on this server.",
          responses: {
            "200": {
              description: "Resource index.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      version: { type: "integer" },
                      description: { type: "string" },
                      resources: {
                        type: "array",
                        items: { type: "string", format: "uri" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(spec, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
}
