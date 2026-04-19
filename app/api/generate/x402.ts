import { x402ResourceServer, x402HTTPResourceServer } from "@x402/next";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";
import {
  bazaarResourceServerExtension,
  declareDiscoveryExtension,
} from "@x402/extensions/bazaar";
import { facilitator as cdpFacilitator } from "@coinbase/x402";

const payTo = process.env.EVM_ADDRESS;
if (!payTo) {
  throw new Error(
    "EVM_ADDRESS env var is required — this is the recipient for x402 USDC payments."
  );
}

const facilitatorClient = new HTTPFacilitatorClient(cdpFacilitator);

const resourceServer = new x402ResourceServer(facilitatorClient)
  .register("eip155:8453", new ExactEvmScheme())
  .registerExtension(bazaarResourceServerExtension);

const routes = {
  "/api/generate": {
    accepts: [
      {
        scheme: "exact" as const,
        price: "$0.01",
        network: "eip155:8453" as const,
        payTo,
        maxTimeoutSeconds: 120,
      },
    ],
    description:
      "Generate a curated bundle of x402 endpoints from a natural-language prompt.",
    mimeType: "text/markdown",
    extensions: {
      ...declareDiscoveryExtension({
        bodyType: "json",
        input: { prompt: "Plan me a vacation to Tokyo" },
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "Describe the bundle you want.",
            },
          },
          required: ["prompt"],
        },
        output: {
          example:
            "# Tokyo trip bundle\n\n- weather API\n- flight search\n- hotel search",
          schema: {
            type: "string",
            description: "Markdown bundle recommendation",
          },
        },
      }),
    },
  },
};

export const httpServer = new x402HTTPResourceServer(resourceServer, routes);
