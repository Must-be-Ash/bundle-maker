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

/**
 * Generate multiple search query variants from a user prompt.
 * Following the Bazaar Search Guide: use 3-5 intent-rich query variants
 * (broad intent, user language, domain jargon, specific action verbs).
 */
function generateQueryVariants(prompt: string): string[] {
  const words = prompt.toLowerCase().split(/\s+/);
  const queries = [prompt];

  // Add domain-expanded variants based on common themes
  const expansions: Record<string, string[]> = {
    vacation: ["travel booking flights hotels itinerary trip planning weather", "vacation destination accommodation transport"],
    travel: ["travel booking flights hotels itinerary trip planning weather maps", "vacation destination accommodation transport"],
    hire: ["recruiting talent search profiles resume linkedin candidates", "hiring recruitment developer engineer"],
    recruit: ["recruiting talent search profiles resume linkedin candidates", "hiring recruitment developer engineer"],
    developer: ["developer engineer coding github portfolio linkedin talent", "software engineering hiring recruiting"],
    marketing: ["marketing ads creative content social media campaign copy", "advertising UGC video image generation"],
    trade: ["trading token swap dex market data portfolio crypto price", "defi trading bot signals analytics"],
    trading: ["trading token swap dex market data portfolio crypto price", "defi trading bot signals analytics"],
    crypto: ["crypto token price market data trading defi analytics", "blockchain wallet portfolio swap"],
    weather: ["weather forecast temperature climate conditions", "meteorological data real-time weather"],
    email: ["email sending messaging notification communication", "mail outreach campaign automation"],
    scrape: ["web scraping crawling data extraction parsing", "firecrawl browserbase content extraction"],
    search: ["web search engine results data retrieval", "search API query information lookup"],
    video: ["video generation creation editing media", "video production animation rendering"],
    image: ["image generation AI creative visual", "image processing photo editing"],
    news: ["news articles current events breaking", "news search sentiment analysis media"],
    real_estate: ["real estate property listing housing market", "property search homes apartments rentals"],
    food: ["food restaurant dining delivery recipe", "restaurant search menu ordering"],
  };

  for (const word of words) {
    if (expansions[word]) {
      queries.push(...expansions[word]);
    }
  }

  // Always add a broad version with extra context words
  queries.push(`${prompt} API service data`);

  // Deduplicate and limit to 5 queries
  return [...new Set(queries)].slice(0, 5);
}

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

    const res = await fetch(url.toString(), {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error(`Bazaar returned ${res.status} for query: ${query}`);
      return [];
    }

    const data: BazaarResponse = await res.json();
    return data.items ?? [];
  } catch (err) {
    console.error("Bazaar search failed:", err);
    return [];
  }
}

/**
 * Multi-query Bazaar search: run multiple query variants in parallel,
 * merge results, and deduplicate by resource URL.
 */
async function searchBazaar(prompt: string): Promise<BazaarResource[]> {
  const queries = generateQueryVariants(prompt);
  console.log(`Searching Bazaar with ${queries.length} query variants:`, queries);

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

  console.log(`Bazaar: ${merged.length} total results → ${unique.length} unique`);
  return unique;
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

Bazaar results (${bazaarResults.length} unique endpoints found):
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
