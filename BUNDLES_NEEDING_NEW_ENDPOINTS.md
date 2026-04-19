# Bundles We Want — But Are Missing Endpoints

These are high-value bundles we **cannot ship today** because at least one critical service is either not in `services.json`, marked `live=false`, or only partially covers the use case. For each, we list the bundle, what it does, what we already have, and the **specific x402 endpoints we need to onboard or upgrade**.

Source services that exist but are **not live yet** (top of the wishlist — flipping these to live would unlock multiple bundles below):
- `tavily` (search)
- `abstract-api` (12 validation/enrichment endpoints)
- `replicate` (open-source model inference)
- `stability-ai` (image/video/3D/audio generation)
- `suno` (music generation)
- `mathpix` (math + document OCR)
- `alpha-vantage` (stock/forex/crypto/commodities/fundamentals/TA)
- `sec-edgar` (filings + facts + full-text search)
- `openweather` (weather + air quality + geocoding)
- `diffbot` (article + product + KG extraction)
- `builtwith` (tech stack profiling)
- `ipinfo` (IP intel)
- `ofac` (sanctions screening)
- `judge0` (sandboxed code exec — duplicates some of e2b but cheaper for snippets)
- `mapbox` (maps + routing + spatial)
- `brave-search` (independent web search)
- `deepl` (translation, 30+ languages)
- `mistral-ai` (Mistral/Codestral/Magistral)
- `virustotal` (file/URL/domain/IP threat intel)

---

## 1. SEC Filing Analyzer (v2 — first-party data)
**What it does:** Pull, parse, and analyze 10-K / 10-Q / 8-K filings + XBRL facts directly from EDGAR rather than scraping HTML.

**What we have:** `firecrawl`, `anthropic`, `wolframalpha`

**What we're missing:**
- **`sec-edgar`** — flip to live. Need: company submissions, company facts (XBRL), full-text filing search.
- **`alpha-vantage`** — flip to live. Need: fundamentals (earnings, income statement, cash flow), TA indicators.

---

## 2. Equities Trading Agent
**What it does:** Real-time stock prices + technicals + news + fundamentals → LLM thesis → place order with a brokerage.

**What we have:** `wolframalpha`, `perplexity`, `anthropic`

**What we're missing:**
- **`alpha-vantage`** — quotes, intraday, indicators, FX, commodities.
- A **brokerage execution endpoint** — Alpaca, IBKR, or Robinhood-equivalent. None exist in services.json.
- An **earnings calendar / corporate actions** API (Financial Modeling Prep, Polygon).
- Optional: **`polygon.io`** as an alpha-vantage alternative.

---

## 3. Polymarket / Prediction Market Bot
**What it does:** News-driven prediction-market trading. Already in `endpoints/mock-bundles.ts` but not buildable.

**What we have:** `exa`, `perplexity`, `gloria-ai`, `anthropic`

**What we're missing:**
- **Polymarket** order/market data endpoint (CLOB API as x402).
- Optional: **Kalshi** equivalent for regulated markets.

---

## 4. YouTube → Podcast Pipeline
**What it does:** Pull a YouTube video → transcript → chapters → audio re-cut → publish.

**What we have:** `deepgram`, `dtelecom-stt`, `anthropic`, `stableupload`

**What we're missing:**
- A **YouTube data + transcript endpoint** (YouTube Data API v3 + transcript fetcher) wrapped as x402. Currently nothing in services.json covers this.
- **`replicate`** (live=false) — useful for whisper-large-v3 fallback transcription.

---

## 5. Voice Cloning + Narration Agent
**What it does:** Clone a voice from a sample, generate narration for a video script, sync to slides.

**What we have:** `dtelecom-stt`, `deepgram` (TTS too), `fal`

**What we're missing:**
- An **ElevenLabs**-equivalent voice cloning + premium TTS endpoint. Deepgram TTS is fine for narration but not for cloning.
- **`replicate`** (live=false) — covers some open-source voice models.

---

## 6. Music Production Agent
**What it does:** Generate full songs (lyrics + vocals + instrumentals) for short-form video, ads, podcasts.

**What we have:** —

**What we're missing:**
- **`suno`** — flip to live.
- **`stability-ai`** — flip to live (audio diffusion).
- **`replicate`** (live=false) — MusicGen, AudioCraft fallbacks.

---

## 7. Translation + Localization Agent
**What it does:** Translate a doc/site/app strings into 30+ languages with consistent terminology.

**What we have:** `firecrawl`, `anthropic`

**What we're missing:**
- **`deepl`** — flip to live. Critical for premium-quality translation.
- **`mistral-ai`** — flip to live. Helpful as a multilingual LLM fallback.

---

## 8. Document OCR + Math Extraction
**What it does:** Take a scanned PDF / image of math or a chemistry doc, extract LaTeX + tables + clean text.

**What we have:** `firecrawl`, `screenshotone`, `anthropic`

**What we're missing:**
- **`mathpix`** — flip to live. The current LLM-based OCR is unreliable on equations and tables.

---

## 9. Weather-Aware Logistics Agent
**What it does:** Plans deliveries / outdoor events around weather + air quality + traffic conditions.

**What we have:** `tripadvisor`, `google-flights`, `flightaware`

**What we're missing:**
- **`openweather`** — flip to live.
- **`mapbox`** — flip to live (routing + traffic + isochrones; rentcast/tripadvisor don't cover routing).

---

## 10. Independent News Search Agent
**What it does:** Build a search agent that doesn't rely solely on Google/Bing-derived data — needed for compliance / unbiased research.

**What we have:** `exa`, `perplexity`, `firecrawl`

**What we're missing:**
- **`brave-search`** — flip to live (independent index).
- **`tavily`** — flip to live.
- **`diffbot`** — flip to live (knowledge graph for entity-aware queries).

---

## 11. Threat Intelligence / Security Agent
**What it does:** Triage suspicious URLs, files, IPs, and domains during incident response.

**What we have:** `agent-camo`, `e2b`

**What we're missing:**
- **`virustotal`** — flip to live.
- **`ipinfo`** — flip to live.
- **`ofac`** — flip to live (sanctioned-entity screening).
- A **WHOIS / passive DNS** endpoint (e.g., SecurityTrails).
- A **CVE / vuln database** endpoint (e.g., NVD as x402).

---

## 12. Tech Stack Recon Agent
**What it does:** Identifies the tech stack of a target list of companies for sales targeting or competitive analysis.

**What we have:** `firecrawl`, `screenshotone`, `spyfu`

**What we're missing:**
- **`builtwith`** — flip to live. The HTML-scraping fallback misses 80%+ of tools.
- **`diffbot`** — flip to live (auxiliary signal from KG).

---

## 13. Bulk Data Validation Agent
**What it does:** Validate large lists of emails / phones / IPs / company domains in one pass, flag deliverability + risk.

**What we have:** `hunter`, `clado`

**What we're missing:**
- **`abstract-api`** — flip to live. Unlocks 12 validators (email, IP, phone, company, IBAN, VAT, holidays, exchange rates, etc.) on one provider.

---

## 14. Code Eval / LeetCode-style Agent
**What it does:** Run candidate code snippets against test cases for hiring or auto-grading at high QPS / low cost.

**What we have:** `e2b`, `anthropic`, `groq`

**What we're missing:**
- **`judge0`** — flip to live. e2b is great for full sandboxes but expensive per snippet eval. Judge0 is purpose-built for this.

---

## 15. CRM-Synced Sales Agent
**What it does:** Ingests new leads from web forms → enriches → writes back to CRM → triggers personalized sequences.

**What we have:** `apollo`, `hunter`, `clado`, `agentmail`, `anthropic`

**What we're missing:**
- A **HubSpot** x402 endpoint (contacts, companies, deals, engagements).
- A **Salesforce** x402 endpoint.
- Optional: **Pipedrive**, **Attio**.

---

## 16. Calendar / Booking Agent
**What it does:** Negotiate meeting times across multiple calendars, book the meeting, send invites + reminders.

**What we have:** `agentmail`, `stablephone`

**What we're missing:**
- A **Google Calendar** + **Microsoft Graph (Outlook)** x402 endpoint.
- A **Cal.com** or **Calendly** scheduling endpoint.

---

## 17. ATS / Recruiting Agent
**What it does:** Pull candidates from an ATS, score, comment, schedule interviews. Complements the existing recruiter mock.

**What we have:** `apollo`, `clado`, `firecrawl`, `x-api`, `anthropic`

**What we're missing:**
- A **Greenhouse**, **Lever**, or **Workable** x402 endpoint.
- A **LinkedIn Recruiter** equivalent (the mock bundle assumes this; nothing in services.json provides authenticated LinkedIn data beyond `clado`'s contact enrichment).

---

## 18. E-commerce Listing / Operations Agent
**What it does:** Generate listings, manage inventory, handle order updates across marketplaces.

**What we have:** `fal`, `freepik`, `anthropic`, `stableupload`

**What we're missing:**
- **Shopify Admin API** as x402.
- **Amazon SP-API** as x402.
- **eBay / Etsy** equivalents.

---

## 19. Logistics / Shipping Tracker
**What it does:** Track packages across carriers, predict delays, notify customers.

**What we have:** `agentmail`, `anthropic`, `flightaware` (only flight cargo)

**What we're missing:**
- A **multi-carrier tracking** endpoint (FedEx, UPS, USPS, DHL — e.g., EasyPost or Shippo wrapped as x402).
- **`mapbox`** for ETA + routing.
- **`openweather`** for weather-driven delay prediction.

---

## 20. Real Estate Listing Agent (full coverage)
**What it does:** Property search across the full MLS-equivalent universe + comps + virtual tours + outreach.

**What we have:** `rentcast`, `tripadvisor`, `screenshotone`

**What we're missing:**
- A **Zillow** or **Redfin** x402 endpoint (rentcast covers AVM but listing-discovery surface is shallow).
- A **MLS-grid / Realtor.com** equivalent.
- **`mapbox`** for commute + isochrone analysis.

---

## 21. Academic / Patent Research Agent
**What it does:** Searches academic + patent literature, summarizes, finds related work, exports a bibliography.

**What we have:** `perplexity`, `exa`, `anthropic`

**What we're missing:**
- An **arXiv / Semantic Scholar / PubMed** x402 endpoint.
- A **USPTO + Google Patents** x402 endpoint.

---

## 22. Government / Public Records Agent
**What it does:** Aggregates federal contracts, lobbying records, court filings into briefings.

**What we have:** `firecrawl`, `anthropic`

**What we're missing:**
- A **USAspending.gov** wrapper.
- A **PACER / CourtListener** x402 endpoint.
- A **ProPublica Nonprofit Explorer / FEC** wrapper.
- **`sec-edgar`** (already in the wishlist).

---

## 23. Healthcare / Drug Research Agent
**What it does:** Look up drug labels, adverse events, ongoing trials; build a clinical brief.

**What we have:** `perplexity`, `anthropic`

**What we're missing:**
- An **openFDA** x402 endpoint.
- A **ClinicalTrials.gov** wrapper.
- A **PubMed** wrapper (also useful for #21).

---

## 24. Sports Data / Betting Agent
**What it does:** Pulls live scores, schedules, player stats; computes edge against sportsbook lines.

**What we have:** `wolframalpha`, `anthropic`

**What we're missing:**
- An **ESPN / sportsdata.io / The Odds API** x402 endpoint.
- A **DraftKings / FanDuel** order-execution endpoint (regulatory risk; likely informational only).

---

## 25. Map-Aware Geo Agent
**What it does:** Trip planning with multi-stop routing, isochrone analysis, traffic-aware ETAs — beyond what `tripadvisor` and `rentcast` give us.

**What we have:** `tripadvisor`, `rentcast`, `flightaware`, `google-flights`

**What we're missing:**
- **`mapbox`** — flip to live. Geocoding + routing + matrix + isochrones.
- A **Google Maps Places + Directions** x402 endpoint (the existing mock-bundles assume this exists via `stableenrich.dev`, but it's not in services.json proper).

---

## 26. Vision / Image Understanding Agent
**What it does:** Detect objects, faces, brands, text in images; moderate UGC; verify identity documents.

**What we have:** `openai` (GPT-4o vision), `google-gemini`

**What we're missing:**
- A **dedicated vision API** (Clarifai, Google Vision, AWS Rekognition) for tasks where general LLM vision is too slow or too expensive.
- A **face match / liveness** endpoint for KYC.
- **`mathpix`** for OCR-on-images (already in wishlist).

---

## Suggested Onboarding Priority

If we can flip / onboard endpoints in batches, the highest-leverage order is:

1. **`sec-edgar` + `alpha-vantage`** → unlocks 2 finance bundles + improves the existing SEC analyzer.
2. **`mapbox` + `openweather`** → unlocks 3 logistics/travel bundles.
3. **`abstract-api` + `builtwith` + `diffbot`** → big multiplier on every B2B / sales bundle we already ship.
4. **`brave-search` + `tavily`** → diversifies search.
5. **`mathpix` + `replicate` + `stability-ai` + `suno`** → unlocks the creative-media tier.
6. **Polymarket + a brokerage execution endpoint** → finally completes the trading-bot story end-to-end.
7. **HubSpot / Salesforce / Calendar** as x402 → unlocks the entire SaaS-workflow agent category.
