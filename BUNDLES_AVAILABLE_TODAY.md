# Bundles We Can Ship Today

Each bundle below is composable from services that are **`live`** in `services.json` (87 total, ~67 live as of 2026-04-15). Pricing is rough — assume the dominant cost is the LLM call + any heavy data pull.

Categories of live services available:
- **Inference**: anthropic, openai, google-gemini, deepseek, grok, groq, venice, hyperbolic, blockrun-ai, questflow
- **Search/Browse**: exa, perplexity, firecrawl, browserbase, hyperbrowser, anchor-browser
- **Crypto Data**: coingecko, coinmarketcap, messari, nansen, zapper, zerion, allium, cambrian, heurist-mesh, jeetscreener, slamai, emc2-ai, surfai, blackswan, mycelia-signal, quicknode
- **People/Company Data**: apollo, clado, hunter, spyfu
- **Real World Data**: rentcast, tripadvisor, wolframalpha, gloria-ai, capminal
- **Social/Comms**: agentmail, stableemail, melis-notify, postalform, snackmoney, x-api, stablephone
- **Media**: fal, freepik, portal-foundation, deepgram, dtelecom-stt
- **Travel**: google-flights, amadeus, flightaware
- **Storage**: pinata, stableupload
- **Infra**: e2b, 2captcha, agent-camo, run402, stabledomains, bankr, sponge
- **Other**: stablemerch, screenshotone

---

## 1. DeFi Trading Bot (v2)
**What it does:** Pulls multi-source price + onchain signal, screens for risk, generates an LLM trade thesis, and executes a swap.

**Services:** `coingecko` → `messari` → `nansen` → `heurist-mesh` (funding/sentiment) → `blackswan` (risk) → `anthropic` → `zapper` (execute)

**Est cost/run:** ~$0.18

---

## 2. Smart Money Tracker
**What it does:** Watches alpha wallets, tags new positions, cross-references with social chatter, and emails a daily digest.

**Services:** `nansen` → `slamai` → `emc2-ai` → `zerion` → `x-api` → `anthropic` → `agentmail`

**Est cost/run:** ~$0.12

---

## 3. Token Due Diligence Agent
**What it does:** Generates a complete research report on a token: market data, holder concentration, dev activity, social sentiment, risk flags.

**Services:** `coingecko` + `coinmarketcap` → `messari` → `jeetscreener` → `emc2-ai` → `heurist-mesh` → `blackswan` → `perplexity` → `anthropic`

**Est cost/run:** ~$0.20

---

## 4. Wallet PnL Reporter
**What it does:** Pulls a wallet's full DeFi position + tx history, computes realized/unrealized PnL, generates a tax-style summary, emails it.

**Services:** `allium` → `zapper` → `zerion` → `cambrian` → `nansen` → `anthropic` → `agentmail`

**Est cost/run:** ~$0.10

---

## 5. Crypto News Briefing Agent
**What it does:** Hourly briefing — pulls breaking crypto news, dedupes against earlier coverage, ranks by market relevance, sends an email or X post.

**Services:** `gloria-ai` → `heurist-mesh` (Twitter intel) → `x-api` → `perplexity` → `anthropic` → `agentmail` (or `x-api` to post)

**Est cost/run:** ~$0.08

---

## 6. B2B Lead Hunter
**What it does:** Given an ICP, finds companies, identifies decision-makers, verifies emails, scrapes site signals, scores fit, queues outreach.

**Services:** `apollo` → `clado` → `hunter` → `firecrawl` → `spyfu` (competitor signal) → `exa` → `openai` → `agentmail`

**Est cost/run:** ~$0.15

---

## 7. Cold Outreach Sequencer
**What it does:** Takes a contact list, enriches each, generates personalized 3-step email sequence, and schedules sends with reply detection.

**Services:** `apollo` → `hunter` → `clado` → `anthropic` → `agentmail` + `melis-notify`

**Est cost/run:** ~$0.07/contact

---

## 8. Direct Mail Marketing Agent
**What it does:** Pulls a target list, generates personalized physical letters with AI copy, mails them, tracks delivery.

**Services:** `apollo` → `clado` → `anthropic` → `postalform`

**Est cost/run:** ~$1.20/letter (postalform dominates)

---

## 9. AI Phone Sales Agent
**What it does:** Calls a list of leads, has a conversation using a script, books meetings, logs notes via email.

**Services:** `apollo` → `hunter` → `stablephone` → `openai` → `agentmail`

**Est cost/run:** ~$0.50/call

---

## 10. Travel Concierge
**What it does:** Plans a complete trip — flights, hotels, attractions, restaurants, real-time flight status, then emails the full itinerary.

**Services:** `google-flights` → `amadeus` → `flightaware` → `tripadvisor` → `perplexity` → `anthropic` → `agentmail`

**Est cost/run:** ~$0.14

---

## 11. Real Estate Research Agent
**What it does:** Given an address or area, pulls property records + AVM, neighborhood reviews, screenshots of listings, generates a buy/skip memo.

**Services:** `rentcast` → `tripadvisor` (neighborhood) → `screenshotone` → `firecrawl` → `openai` → `agentmail`

**Est cost/run:** ~$0.12

---

## 12. Competitor Intelligence Agent
**What it does:** Daily snapshot of competitor PPC, SEO keywords, ad creative, pricing page changes, with diff-based alerting.

**Services:** `spyfu` → `firecrawl` → `screenshotone` → `exa` → `anthropic` → `agentmail`

**Est cost/run:** ~$0.10

---

## 13. Market Research Agent
**What it does:** Synthesizes a market sizing/landscape report from web sources, computational queries, and competitor data.

**Services:** `perplexity` → `exa` → `firecrawl` → `browserbase` → `wolframalpha` → `anthropic`

**Est cost/run:** ~$0.15

---

## 14. Hardened Web Scraper
**What it does:** Scrapes sites that fight back — handles JS, captchas, geo-blocks, rotating IPs, returns clean structured data.

**Services:** `agent-camo` → `browserbase` / `hyperbrowser` / `anchor-browser` → `2captcha` → `firecrawl` → `openai`

**Est cost/run:** ~$0.08

---

## 15. AI Image Studio
**What it does:** Generate, edit, upscale, and publish AI images from a prompt. Stores final assets at a CDN-style URL.

**Services:** `fal` → `freepik` → `portal-foundation` → `openai` (caption) → `stableupload` + `pinata`

**Est cost/run:** ~$0.20/image

---

## 16. Podcast Production Pipeline
**What it does:** Transcribes raw audio, generates show notes + chapter markers + cover art, hosts the final file.

**Services:** `deepgram` → `dtelecom-stt` → `anthropic` → `fal` (cover art) → `stableupload`

**Est cost/run:** ~$0.30 per 30-min episode

---

## 17. Customer Support Agent
**What it does:** Reads incoming email/calls, classifies, drafts replies, escalates if confidence < threshold.

**Services:** `agentmail` + `stableemail` → `stablephone` → `anthropic` → `clado` (look up customer)

**Est cost/run:** ~$0.04/ticket

---

## 18. Web3 Influencer Outreach
**What it does:** Finds crypto Twitter accounts matching a niche, ranks by engagement, drafts DMs, can tip them as an icebreaker.

**Services:** `x-api` → `heurist-mesh` → `apollo` → `anthropic` → `snackmoney` (tip) → `agentmail`

**Est cost/run:** ~$0.06/contact

---

## 19. Code Sandbox Agent
**What it does:** Takes a coding task, writes code, runs it in an isolated sandbox, iterates on failures, returns a working artifact.

**Services:** `anthropic` (or `deepseek` / `groq`) → `e2b` → `pinata` (store result)

**Est cost/run:** ~$0.05

---

## 20. Document Intelligence Agent
**What it does:** Ingests a URL or uploaded doc, screenshots + scrapes it, extracts structured data, runs computational queries on numbers.

**Services:** `firecrawl` → `screenshotone` → `anthropic` → `wolframalpha` → `pinata`

**Est cost/run:** ~$0.06

---

## 21. Restaurant + Local Discovery Agent
**What it does:** Given a city + party size + cuisine, ranks restaurants with reviews, books or emails the venue, creates a calendar invite.

**Services:** `tripadvisor` → `amadeus` (activities) → `perplexity` → `openai` → `agentmail`

**Est cost/run:** ~$0.08

---

## 22. Crypto Merch Drop Agent
**What it does:** Generates a meme-coin themed shirt design, mocks it up, orders sample merch, tweets the launch.

**Services:** `fal` / `freepik` → `stablemerch` → `x-api` → `anthropic`

**Est cost/run:** ~$25 (merch dominates)

---

## 23. Multi-LLM Routing Agent
**What it does:** Takes a prompt, routes to the best model for the task (reasoning → DeepSeek, speed → Groq, vision → Gemini, etc.), returns the answer + cost telemetry.

**Services:** `blockrun-ai` (gateway) OR direct: `anthropic` + `openai` + `google-gemini` + `deepseek` + `grok` + `groq` + `venice`

**Est cost/run:** $0.001–$0.02

---

## 24. Domain Acquisition Agent
**What it does:** Brainstorms brandable domain names for a startup idea, checks availability, registers winners.

**Services:** `anthropic` → `stabledomains` → `agentmail`

**Est cost/run:** ~$10/domain

---

## 25. Onchain Risk Screener
**What it does:** Given a wallet or contract, returns a risk score combining sanctions, exposure to mixers, holder concentration, and counterparty data.

**Services:** `blackswan` → `nansen` → `heurist-mesh` → `allium` → `anthropic`

**Est cost/run:** ~$0.10
