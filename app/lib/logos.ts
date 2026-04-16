/**
 * All logos live in /public/logos/mono/ — one source of truth.
 * Rendered with `brightness-0 opacity-60` for uniform monochrome.
 */

const m = (file: string) => `/logos/mono/${file}`;

/* ─── Service logos ──────────────────────────────────────────────── */

export const MONO_LOGOS: Record<string, string> = {
  /* Inference */
  "OpenAI": m("openai.svg"),
  "Anthropic": m("anthropic.svg"),
  "Google Gemini": m("googlegemini.svg"),
  "DeepSeek": m("deepseek.svg"),
  "Grok": m("grok.svg"),
  "Perplexity": m("perplexity.svg"),
  "Bankr": m("bankr.svg"),
  "Venice": m("venice.svg"),
  "BlockRun.AI": m("blockrun.svg"),

  /* Infrastructure */
  "Alchemy": m("alchemy.svg"),
  "Vercel": m("vercel.svg"),
  "Railway": m("railway.svg"),
  "Replit": m("replit.svg"),
  "AWS": m("aws.svg"),
  "Fly.io": m("flydotio.svg"),
  "ThirdWeb": m("thirdweb.svg"),
  "Browserbase": m("browserbase.svg"),
  "E2B": m("e2b.svg"),
  "Judge0": m("judge0.svg"),
  "World": m("world.svg"),
  "VPN": m("stabledomains.svg"),
  "StableDomains": m("stabledomains.svg"),

  /* Data */
  "CoinGecko": m("gecko.svg"),
  "CoinMarketCap": m("coinmarketcap.svg"),
  "Bloomberg": m("bloomberg.svg"),
  "Apollo": m("apollo.svg"),
  "QuickNode": m("quicknode.svg"),
  "Zerion": m("zerion.svg"),
  "Dune": m("dune.svg"),
  "Nansen": m("nansen.svg"),
  "SurfAI": m("surfai.svg"),
  "Messari": m("messari.svg"),
  "Gloria AI": m("gloria.svg"),
  "weatherxm": m("weatherxm.svg"),
  "Zillow (or RentCast)": m("zillow.svg"),
  "SEMrush (or SpyFu)": m("semrush.svg"),
  "Company Enrichment (AbstractAPI)": m("abstractapi.svg"),

  /* Search */
  "Google Maps": m("googlemaps.svg"),
  "Expedia": m("expedia.svg"),
  "Skyscanner": m("skyscanner.svg"),
  "Firecrawl": m("firecrawl.svg"),
  "Exa": m("exa.svg"),
  "SerpApi": m("serpapi.svg"),
  "Hyperbrowser": m("hyperbrowser.svg"),

  /* Media */
  "fal.ai": m("fal.svg"),
  "Deepgram": m("deepgram.svg"),
  "Freepik": m("freepik.svg"),
  "ElevenLabs": m("elevenlabs.svg"),
  "ScreenshotOne": m("screenshotone.svg"),

  /* Social */
  "X API": m("x.svg"),
  "Twilio": m("twilio.svg"),
  "LinkedIn API": m("linkedin.svg"),
  "Instagram": m("instagram.svg"),
  "Tiktok": m("tiktok.svg"),
  "Reddit API": m("reddit.svg"),
  "Trip Advisor": m("tripadvisor.svg"),
  "AgentMail": m("agentmail.svg"),
  "StableEmail": m("stableemail.svg"),
  "StablePhone": m("stablephone.svg"),
  "StableSocial": m("stablesocial.svg"),
  "StableEnrich": m("stableenrich.svg"),

  /* Trading */
  "Hyperliquid": m("hype.svg"),
  "Polymarket": m("polymarket.svg"),
  "Zapper": "/logos/zapper.svg",

  /* Storage */
  "Pinata": m("pinata.svg"),
  "StableUpload": m("stableupload.svg"),

  /* Travel */
  "StableTravel": m("stabletravel.svg"),

  /* Other */
  "2Captcha": m("2captcha.svg"),
  "PostalForm": m("postalform.svg"),
  "StableMerch": m("stablemerch.svg"),
};

/* ─── Helpers ────────────────────────────────────────────────────── */

export function getMonoLogoUrl(
  serviceName: string,
  csvLogoUrl: string
): string {
  return MONO_LOGOS[serviceName] ?? csvLogoUrl;
}
