import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "@/app/lib/system-prompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_BUNDLE_API_KEY,
});

interface BazaarResource {
  resource: string;
  type?: string;
  x402Version?: number;
  accepts?: Array<{
    scheme?: string;
    network?: string;
    amount?: string;
    asset?: string;
    payTo?: string;
    description?: string;
    maxAmountRequired?: string;
  }>;
  lastUpdated?: string;
  metadata?: {
    description?: string;
    input?: Record<string, unknown>;
    output?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

interface BazaarResponse {
  items?: BazaarResource[];
  pagination?: { limit: number; offset: number; total: number };
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

/* ─── Step 1: Claude plans search queries ────────────────────────── */

const PLANNER_PROMPT = `You are a search query planner for an API marketplace that has paid API endpoints (web search, data APIs, scraping tools, etc.).

Given a user's need, generate search queries to find the data and tool APIs that are DIRECTLY relevant to fulfilling that need. Focus on the core information and actions required — not tangential nice-to-haves.

For example, if the user says "plan me a vacation":
- Core: web search, weather forecast, flight search, hotel search, maps, travel content scraping
- NOT core: image generation, email sending, notifications (unless explicitly asked)

Rules:
- Generate 5-8 search queries, no more
- Each query should be a phrase of 3-6 words
- Only include queries for things the user actually needs to accomplish their goal
- Do NOT add generic utilities (email, image gen, notifications) unless the user explicitly asks for them
- Focus on data retrieval and research APIs

Output ONLY a JSON array of query strings, nothing else.`;

async function planSearchQueries(prompt: string): Promise<string[]> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: PLANNER_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.find((b) => b.type === "text")?.text ?? "[]";
    // Extract JSON array from response (handle potential markdown wrapping)
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return [prompt];

    const queries: string[] = JSON.parse(match[0]);
    console.log(`Planner generated ${queries.length} queries:`, queries);
    return queries.length > 0 ? queries : [prompt];
  } catch (err) {
    console.error("Query planning failed, falling back to raw prompt:", err);
    return [prompt, `${prompt} API service`];
  }
}

/* ─── Step 2: Search Bazaar & Orthogonal ─────────────────────────── */

async function searchBazaarSingle(query: string): Promise<BazaarResource[]> {
  try {
    const url = new URL(
      "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources"
    );
    url.searchParams.set("query", query);
    url.searchParams.set("network", "eip155:8453");
    url.searchParams.set("limit", "100");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`Bazaar returned ${res.status} for query: ${query}`);
      return [];
    }

    const data: BazaarResponse = await res.json();
    return data.items ?? [];
  } catch (err) {
    console.error(`Bazaar search failed for "${query}":`, err);
    return [];
  }
}

async function searchBazaarMulti(queries: string[]): Promise<BazaarResource[]> {
  const allResults = await Promise.all(queries.map(searchBazaarSingle));
  const merged = allResults.flat();

  // Deduplicate by resource URL
  const seen = new Set<string>();
  const unique: BazaarResource[] = [];
  for (const item of merged) {
    if (!seen.has(item.resource)) {
      seen.add(item.resource);
      unique.push(item);
    }
  }

  console.log(
    `Bazaar: ${queries.length} queries → ${merged.length} total → ${unique.length} unique`
  );
  return unique;
}

async function searchOrthogonal(query: string): Promise<OrthogonalResult[]> {
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

/* ─── Step 3: Generate bundle ────────────────────────────────────── */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body.prompt?.trim();

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Step 1: Claude plans the search queries
    const queries = await planSearchQueries(prompt);

    // Step 2: Search Bazaar (multi-query) and Orthogonal in parallel
    const [bazaarResults, orthogonalResults] = await Promise.all([
      searchBazaarMulti(queries),
      searchOrthogonal(prompt),
    ]);

    console.log(
      `Total results — Bazaar: ${bazaarResults.length}, Orthogonal: ${orthogonalResults.length}`
    );

    // Step 3: Claude curates the final bundle
    const userMessage = `Need: ${prompt}

Search queries used: ${JSON.stringify(queries)}

Bazaar results (${bazaarResults.length} unique endpoints found):
${JSON.stringify(bazaarResults, null, 2)}

Orthogonal results (${orthogonalResults.length} found):
${JSON.stringify(orthogonalResults, null, 2)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000);

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
