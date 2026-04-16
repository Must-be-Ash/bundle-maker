import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "@/app/lib/system-prompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_BUNDLE_API_KEY,
});

interface BazaarResource {
  resource: string;
  description?: string;
  accepts?: Array<{
    scheme: string;
    network?: string;
    maxAmountRequired?: string;
    asset?: string;
  }>;
  metadata?: Record<string, unknown>;
}

interface BazaarResponse {
  resources?: BazaarResource[];
}

interface OrthogonalResult {
  api?: string;
  path?: string;
  description?: string;
  pricing?: Record<string, unknown>;
}

interface OrthogonalResponse {
  results?: OrthogonalResult[];
}

async function searchBazaar(query: string): Promise<BazaarResource[]> {
  try {
    const url = new URL(
      "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources"
    );
    url.searchParams.set("query", query);
    url.searchParams.set("limit", "20");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`Bazaar returned ${res.status}`);
      return [];
    }

    const data: BazaarResponse = await res.json();
    return data.resources ?? [];
  } catch (err) {
    console.error("Bazaar search failed:", err);
    return [];
  }
}

async function searchOrthogonal(
  query: string
): Promise<OrthogonalResult[]> {
  const apiKey = process.env.ORTHOGONAL_API_KEY;
  if (!apiKey) {
    console.warn("ORTHOGONAL_API_KEY not set, skipping Orthogonal search");
    return [];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch("https://api.orthogonal.com/v1/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt: query, limit: 10 }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`Orthogonal returned ${res.status}`);
      return [];
    }

    const data: OrthogonalResponse = await res.json();
    return data.results ?? [];
  } catch (err) {
    console.error("Orthogonal search failed:", err);
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Search Bazaar and Orthogonal in parallel
    const [bazaarResults, orthogonalResults] = await Promise.all([
      searchBazaar(prompt),
      searchOrthogonal(prompt),
    ]);

    // Build the user message for Claude
    const userMessage = `Need: ${prompt}

Bazaar results (${bazaarResults.length} found):
${JSON.stringify(bazaarResults, null, 2)}

Orthogonal results (${orthogonalResults.length} found):
${JSON.stringify(orthogonalResults, null, 2)}`;

    // Call Claude to generate the skill bundle
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    try {
      const message = await anthropic.messages.create(
        {
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          system: getSystemPrompt(),
          messages: [{ role: "user", content: userMessage }],
        },
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      const textBlock = message.content.find((b) => b.type === "text");
      const markdown = textBlock?.text ?? "";

      return new Response(markdown, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  } catch (err) {
    console.error("Generate failed:", err);
    return Response.json(
      { error: "Failed to generate bundle. Please try again." },
      { status: 500 }
    );
  }
}
