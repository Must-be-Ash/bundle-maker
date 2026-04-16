import { MONO_LOGOS } from "./logos";

/* ─── Types ─────────────────────────────────────────────────────── */

export type BundleService = {
  name: string;
  description: string;
  price: string;
  logoUrl: string;
};

export type Bundle = {
  id: string;
  name: string;
  description: string;
  services: BundleService[];
  estimatedCostPerRun: number;
  chain: string;
  skillMd: string;
};

/* ─── Helper ────────────────────────────────────────────────────── */

const logo = (name: string) => MONO_LOGOS[name] ?? "";

/* ─── 6 Featured Bundles ────────────────────────────────────────── */

export const BUNDLES: Bundle[] = [
  {
    id: "defi-trading-bot",
    name: "DeFi Trading Bot",
    description:
      "Fetch live token prices, generate AI-powered trading insights, and execute via Zapper — all in a single agent run.",
    services: [
      {
        name: "CoinGecko",
        description: "Token price, market cap, volume — live + historical",
        price: "$0.002 / call",
        logoUrl: logo("CoinGecko"),
      },
      {
        name: "DeepSeek",
        description: "AI reasoning and text generation for trade signals",
        price: "$0.0004 / 1K tokens",
        logoUrl: logo("DeepSeek"),
      },
      {
        name: "Zapper",
        description: "Portfolio data, DeFi positions, and swap execution",
        price: "$0.005 / call",
        logoUrl: logo("Zapper"),
      },
    ],
    estimatedCostPerRun: 0.14,
    chain: "Base",
    skillMd: `---
name: defi-trading-bot
description: Fetch live token price data, analyze it, and execute a trade if signal is strong. Costs ~$0.14 USDC per run.
argument-hint: [token-symbol]
---

## Steps

1. Fetch price from CoinGecko
   GET https://api.coingecko.com/api/v3/simple/price?ids={token}&vs_currencies=usd
   Authorization: Bearer <X402_TOKEN>

2. Generate insight via DeepSeek
   POST https://api.deepseek.com/v1/chat/completions
   Body: { "model": "deepseek-chat", "messages": [{"role": "user", "content": "Analyze {token} at $[price]. Buy/sell/hold?"}] }

3. Execute trade via Zapper (if signal passes threshold)
   POST https://api.zapper.xyz/v1/swap
   Body: { "token": "{token}", "amount": "...", "action": "buy" }`,
  },
  {
    id: "recruiter-agent",
    name: "Recruiter Agent",
    description:
      "Scout talent across X, LinkedIn, and the web — scrape profiles, parse resumes, and rank candidates with AI.",
    services: [
      {
        name: "X API",
        description: "Search tweets and profiles for talent signals",
        price: "$0.005 / call",
        logoUrl: logo("X API"),
      },
      {
        name: "Firecrawl",
        description: "Scrape portfolios, resumes, and personal sites",
        price: "$0.005 / scrape",
        logoUrl: logo("Firecrawl"),
      },
      {
        name: "LinkedIn API",
        description: "Profile lookup, job history, and skills data",
        price: "$0.01 / call",
        logoUrl: logo("LinkedIn API"),
      },
      {
        name: "OpenAI",
        description: "Rank and summarize candidates with GPT-4o",
        price: "$0.003 / call",
        logoUrl: logo("OpenAI"),
      },
    ],
    estimatedCostPerRun: 0.25,
    chain: "Base",
    skillMd: `---
name: recruiter-agent
description: Scout and rank talent from X, LinkedIn, and the web. Costs ~$0.25 USDC per run.
argument-hint: [role-title, skills]
---

## Steps

1. Search X for candidates
   GET https://x402.twit.sh/v1/search?q={role} {skills}

2. Scrape candidate websites via Firecrawl
   POST https://api.firecrawl.dev/v1/scrape
   Body: { "url": "{candidate_url}" }

3. Fetch LinkedIn profiles
   POST https://stableenrich.dev/v1/linkedin/profile
   Body: { "name": "{candidate_name}" }

4. Rank candidates via OpenAI
   POST https://api.openai.com/v1/chat/completions
   Body: { "model": "gpt-4o", "messages": [...candidate_data] }`,
  },
  {
    id: "real-estate-agent",
    name: "Real Estate Agent",
    description:
      "Research properties with Google Maps, generate listing analysis with AI, and email prospects to book open house viewings.",
    services: [
      {
        name: "Google Maps",
        description: "Geocoding, places, and neighborhood data",
        price: "$0.005 / call",
        logoUrl: logo("Google Maps"),
      },
      {
        name: "OpenAI",
        description: "Generate property analysis and email drafts",
        price: "$0.003 / call",
        logoUrl: logo("OpenAI"),
      },
      {
        name: "AgentMail",
        description: "Send personalized emails to prospects",
        price: "$0.005 / email",
        logoUrl: logo("AgentMail"),
      },
    ],
    estimatedCostPerRun: 0.18,
    chain: "Base",
    skillMd: `---
name: real-estate-agent
description: Research properties, analyze listings, and email prospects. Costs ~$0.18 USDC per run.
argument-hint: [address-or-zip]
---

## Steps

1. Research area via Google Maps
   GET https://maps.googleapis.com/maps/api/place/nearbysearch?location={lat,lng}&type=real_estate

2. Generate listing analysis via OpenAI
   POST https://api.openai.com/v1/chat/completions
   Body: { "model": "gpt-4o", "messages": [{"role": "user", "content": "Analyze this property: {data}"}] }

3. Email prospects via AgentMail
   POST https://api.agentmail.to/v1/send
   Body: { "to": "{prospect}", "subject": "Open House Invitation", "body": "{generated_email}" }`,
  },
  {
    id: "marketing-agent",
    name: "Marketing Agent",
    description:
      "Create UGC-style content, generate ad creatives with AI image models, and write high-converting copy — all automated.",
    services: [
      {
        name: "fal.ai",
        description: "Generate ad creatives and UGC-style images",
        price: "$0.05 / image",
        logoUrl: logo("fal.ai"),
      },
      {
        name: "ElevenLabs",
        description: "Voice synthesis for video ads and narration",
        price: "$0.03 / clip",
        logoUrl: logo("ElevenLabs"),
      },
      {
        name: "OpenAI",
        description: "Write ad copy, captions, and CTAs",
        price: "$0.003 / call",
        logoUrl: logo("OpenAI"),
      },
    ],
    estimatedCostPerRun: 0.32,
    chain: "Base",
    skillMd: `---
name: marketing-agent
description: Generate ad creatives, voiceovers, and copy for campaigns. Costs ~$0.32 USDC per run.
argument-hint: [product-name, target-audience]
---

## Steps

1. Generate ad creative via fal.ai
   POST https://fal.ai/v1/generate
   Body: { "prompt": "UGC-style ad for {product}, targeting {audience}" }

2. Generate voiceover via ElevenLabs
   POST https://api.elevenlabs.io/v1/text-to-speech
   Body: { "text": "{ad_script}", "voice_id": "..." }

3. Write copy via OpenAI
   POST https://api.openai.com/v1/chat/completions
   Body: { "model": "gpt-4o", "messages": [{"role": "user", "content": "Write 3 ad copy variants for {product}"}] }`,
  },
  {
    id: "devrel-agent",
    name: "DevRel Agent",
    description:
      "Create educational content, transcribe and summarize talks, and scrape docs to generate tutorials and walkthroughs.",
    services: [
      {
        name: "Deepgram",
        description: "Transcribe video talks and conference recordings",
        price: "$0.01 / minute",
        logoUrl: logo("Deepgram"),
      },
      {
        name: "Firecrawl",
        description: "Scrape documentation and changelog pages",
        price: "$0.005 / scrape",
        logoUrl: logo("Firecrawl"),
      },
      {
        name: "Anthropic",
        description: "Generate tutorials, summaries, and explainers",
        price: "$0.003 / call",
        logoUrl: logo("Anthropic"),
      },
    ],
    estimatedCostPerRun: 0.22,
    chain: "Base",
    skillMd: `---
name: devrel-agent
description: Create educational content from talks and docs. Costs ~$0.22 USDC per run.
argument-hint: [topic-or-video-url]
---

## Steps

1. Transcribe talk via Deepgram
   POST https://api.deepgram.com/v1/listen
   Body: { "url": "{video_url}" }

2. Scrape related docs via Firecrawl
   POST https://api.firecrawl.dev/v1/scrape
   Body: { "url": "{docs_url}" }

3. Generate tutorial via Anthropic
   POST https://api.anthropic.com/v1/messages
   Body: { "model": "claude-sonnet-4-20250514", "messages": [{"role": "user", "content": "Write a tutorial based on: {transcript} {docs}"}] }`,
  },
  {
    id: "polymarket-bot",
    name: "Polymarket Bot",
    description:
      "Search the web for breaking news, analyze sentiment with AI, and place informed prediction market bets — fully autonomous.",
    services: [
      {
        name: "Exa",
        description: "AI-powered web search for real-time news",
        price: "$0.01 / search",
        logoUrl: logo("Exa"),
      },
      {
        name: "Perplexity",
        description: "Deep research with web-grounded AI analysis",
        price: "$0.005 / call",
        logoUrl: logo("Perplexity"),
      },
      {
        name: "Polymarket",
        description: "Prediction market data and bet execution",
        price: "$0.01 / trade",
        logoUrl: logo("Polymarket"),
      },
    ],
    estimatedCostPerRun: 0.19,
    chain: "Base",
    skillMd: `---
name: polymarket-bot
description: Search news, analyze with AI, and place prediction market bets. Costs ~$0.19 USDC per run.
argument-hint: [topic-or-event]
---

## Steps

1. Search for breaking news via Exa
   POST https://api.exa.ai/v1/search
   Body: { "query": "{topic} latest news" }

2. Deep analysis via Perplexity
   POST https://api.perplexity.ai/chat/completions
   Body: { "model": "sonar", "messages": [{"role": "user", "content": "Analyze probability of {event} given: {news}"}] }

3. Place bet via Polymarket
   POST https://api.polymarket.com/v1/order
   Body: { "market": "{market_id}", "side": "{yes/no}", "amount": "..." }`,
  },
];
