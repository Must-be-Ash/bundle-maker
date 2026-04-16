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
    id: "vacation-planner",
    name: "Vacation Planner",
    description:
      "Research and plan a complete vacation using web search, destination content extraction, and itinerary synthesis.",
    services: [
      {
        name: "Questflow",
        description: "AI agent for deep web search and travel data",
        price: "$0.10 / call",
        logoUrl: logo("Questflow"),
      },
      {
        name: "Firecrawl",
        description: "Scrape and extract structured data from travel sites",
        price: "$0.01 / call",
        logoUrl: logo("Firecrawl"),
      },
      {
        name: "Tavily",
        description: "Map and crawl tourism websites via Orthogonal",
        price: "$0.10 / call",
        logoUrl: logo("Tavily"),
      },
      {
        name: "Exa",
        description: "Research swarm for itinerary synthesis",
        price: "$0.50 / call",
        logoUrl: logo("Exa"),
      },
    ],
    estimatedCostPerRun: 0.60,
    chain: "Base",
    skillMd: `---
name: vacation-planner
description: Research and plan a complete vacation with web search, destination intel, and travel content extraction. Costs ~$0.60 USDC per run.
argument-hint: [destination, travel-dates, origin-city, interests]
---

# Vacation Planner

Research and plan a complete vacation using AI-powered web search, destination content extraction, and structured data gathering. This bundle covers destination research, attraction discovery, weather and travel info scraping, and itinerary synthesis.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.60/run |
| Payment | USDC on Base |
| Endpoints | 6 services |

## Steps

1. Deep web search for destination travel info (flights, hotels, attractions)
   POST https://api-staging.intra-tls2.dctx.link/x402/agent/qrn:agent:682306635380bd59df4992fa
   Body: { "input": "Best flights, hotels, and things to do in {destination} for {travel-dates} from {origin-city}" }
   Cost: $0.10/call
   Source: x402 Bazaar

2. Search and extract structured travel data from destination websites
   POST https://api.questflow.ai/x402/agent/qrn:agent:68ee1cfebd72982773cd07e8
   Body: { "input": "Search for top attractions, restaurants, and neighborhoods in {destination}" }
   Cost: $0.10/call
   Source: x402 Bazaar

3. Scrape a specific travel/tourism URL for destination details
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{destination_travel_guide_url}", "wait_time": 7500 }
   Cost: $0.01/call
   Source: x402 Bazaar

4. Extract structured data from multiple travel pages
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["{hotel_listing_url}", "{attractions_url}"], "extraction_prompt": "Extract hotel names, prices, ratings, amenities." }
   Cost: $0.01/call
   Source: x402 Bazaar

5. Map and crawl destination tourism websites
   POST https://x402.orth.sh/tavily/map
   Body: { "url": "https://www.lonelyplanet.com/{destination}", "max_depth": 2 }
   Cost: $0.10/call
   Source: Orthogonal

6. Synthesize all data into a full vacation itinerary
   POST https://api.questflow.ai/x402/swarm/qrn:swarm:68d0f3afc7dc21123d8d5b85
   Body: { "input": "Create a day-by-day itinerary for {destination} covering flights, hotels, attractions, restaurants, and packing tips: {aggregated_data}" }
   Cost: $0.50/call
   Source: x402 Bazaar`,
  },
  {
    id: "competitor-price-monitor",
    name: "Competitor Price Monitor",
    description:
      "Scrape competitor product pages, extract structured pricing data, and enrich company profiles for competitive intelligence.",
    services: [
      {
        name: "Questflow",
        description: "Web search for competitor pricing pages",
        price: "$0.10 / call",
        logoUrl: logo("Questflow"),
      },
      {
        name: "Firecrawl",
        description: "Scrape and extract structured pricing data",
        price: "$0.01 / call",
        logoUrl: logo("Firecrawl"),
      },
      {
        name: "Openmart",
        description: "Enrich competitor company profiles",
        price: "$0.01 / call",
        logoUrl: logo("Openmart"),
      },
    ],
    estimatedCostPerRun: 0.24,
    chain: "Base",
    skillMd: `---
name: competitor-price-monitor
description: Monitor competitors' pricing by scraping their websites, extracting structured price data, and enriching company intelligence. Costs ~$0.24 per run.
argument-hint: [competitor-urls, product-names, competitor-company-names]
---

# Competitor Price Monitor

Scrape competitor product pages, extract structured pricing data using AI-powered web extraction, and enrich company profiles to build a comprehensive picture of your competitive landscape.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.24/run |
| Payment | USDC on Base |
| Endpoints | 5 services |

## Steps

1. Search the web for competitor pricing pages
   POST https://api.questflow.ai/x402/agent/qrn:agent:68ee1cfebd72982773cd07e8
   Body: { "input": "Search for pricing pages and product listings for {competitor_name} site:{competitor_domain}" }
   Cost: $0.10/call
   Source: x402 Bazaar

2. Scrape competitor product/pricing page
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{competitor_pricing_url}", "wait_time": 7500 }
   Cost: $0.01/call
   Source: x402 Bazaar

3. Extract structured pricing data from scraped pages
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["{competitor_domain}/pricing"], "extraction_prompt": "Extract product names, prices, discount prices, subscription tiers, and promotional pricing." }
   Cost: $0.01/call
   Source: x402 Bazaar

4. Enrich competitor company profile
   POST https://x402.orth.sh/openmart/api/v1/enrich_company
   Body: { "website": "{competitor_domain}" }
   Cost: $0.01/call
   Source: Orthogonal

5. Synthesize pricing intelligence report
   POST https://api-staging.intra-tls2.dctx.link/x402/agent/qrn:agent:682306635380bd59df4992fa
   Body: { "input": "Summarize current pricing strategy for {competitor_name}. Compare tiers, discounts, and positioning." }
   Cost: $0.10/call
   Source: x402 Bazaar`,
  },
  {
    id: "sec-filing-analyzer",
    name: "SEC Filing Analyzer",
    description:
      "Automate SEC filing discovery, extraction, and financial analysis for any public company with 8 chained endpoints.",
    services: [
      {
        name: "Fundable",
        description: "Company search by name or ticker",
        price: "$0.01 / call",
        logoUrl: logo("Fundable"),
      },
      {
        name: "Firecrawl",
        description: "Scrape SEC EDGAR filings and extract data",
        price: "$0.01 / call",
        logoUrl: logo("Firecrawl"),
      },
      {
        name: "Notte",
        description: "Extract structured financial data from HTML",
        price: "$0.01 / call",
        logoUrl: logo("Notte"),
      },
      {
        name: "Yahoo Finance",
        description: "Technical indicators and stock performance",
        price: "$0.01 / call",
        logoUrl: logo("Yahoo Finance"),
      },
      {
        name: "Didit",
        description: "AML/regulatory risk screening",
        price: "$0.01 / call",
        logoUrl: logo("Didit"),
      },
    ],
    estimatedCostPerRun: 0.17,
    chain: "Base",
    skillMd: `---
name: sec-filing-analyzer
description: Automate SEC filing discovery, extraction, and financial analysis for any public company. Costs ~$0.17 USDC per run.
argument-hint: [company-name, ticker-symbol, filing-type, fiscal-period]
---

# SEC Filing Analyzer

Automate the end-to-end process of finding, retrieving, and analyzing SEC filings (10-K, 10-Q, 8-K) for any publicly traded company.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.17/run |
| Payment | USDC on Base |
| Endpoints | 8 services |

## Steps

1. Search and identify the company by name or ticker
   GET https://x402.orth.sh/fundable/company/search?q={company_name_or_ticker}
   Cost: $0.01/call
   Source: Orthogonal

2. Enrich company profile with metadata (sector, SIC code, CIK)
   POST https://x402.orth.sh/sixtyfour/enrich-company
   Body: { "company": "{company_name}", "ticker": "{ticker}" }
   Cost: $0.01/call
   Source: Orthogonal

3. Search SEC EDGAR for the target filing
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type={form_type}&count=10"], "extraction_prompt": "Extract filing links, dates, and accession numbers" }
   Cost: $0.01/call
   Source: x402 Bazaar

4. Scrape and retrieve the full filing document
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{sec_filing_url}", "wait_time": 7500 }
   Cost: $0.01/call
   Source: x402 Bazaar

5. Extract structured financial data from the filing
   POST https://x402.orth.sh/notte/scrape_from_html
   Body: { "html": "{filing_html}", "schema": { "revenue": "string", "net_income": "string", "eps": "string" } }
   Cost: $0.01/call
   Source: Orthogonal

6. Pull technical indicators and historical stock performance
   POST https://mesh.heurist.xyz/x402/agents/YahooFinanceAgent/indicator_snapshot
   Body: { "symbol": "{ticker}", "interval": "1d", "period": "1y" }
   Cost: $0.01/call
   Source: x402 Bazaar

7. Screen the company for AML/regulatory risk flags
   POST https://x402.orth.sh/didit/v3/aml
   Body: { "name": "{company_name}", "entity_type": "company" }
   Cost: $0.01/call
   Source: Orthogonal

8. Synthesize filing insights and flag risks
   POST https://api-dev.intra-tls2.dctx.link/x402/agent/qrn:agent:68dba0e582f61ca4a1686963
   Body: { "input": "Analyze the {form_type} filing for {company_name}. Identify revenue drivers, risk factors, management outlook, and red flags: {extracted_financial_data}" }
   Cost: $0.10/call
   Source: x402 Bazaar`,
  },
  {
    id: "crypto-trading-bot",
    name: "Crypto Trading Bot",
    description:
      "Monitor crypto prices, analyze technical indicators, gauge social sentiment, and execute on-chain trades with 13 endpoints.",
    services: [
      {
        name: "Dome",
        description: "Real-time price feeds from Binance and Chainlink",
        price: "USDC / call",
        logoUrl: logo("Dome"),
      },
      {
        name: "Yahoo Finance",
        description: "Technical indicators — RSI, MACD, Bollinger Bands",
        price: "$0.01 / call",
        logoUrl: logo("Yahoo Finance"),
      },
      {
        name: "Elfa",
        description: "Twitter trending tokens and sentiment analysis",
        price: "$0.01 / call",
        logoUrl: logo("Elfa"),
      },
      {
        name: "Questflow",
        description: "Market data agents and research swarms",
        price: "$0.10 / call",
        logoUrl: logo("Questflow"),
      },
      {
        name: "Heurist",
        description: "Funding rates, wallet analysis, and token trends",
        price: "$0.01 / call",
        logoUrl: logo("Heurist"),
      },
    ],
    estimatedCostPerRun: 0.17,
    chain: "Base",
    skillMd: `---
name: crypto-trading-bot
description: Monitor crypto prices, analyze technical indicators, gauge social sentiment, and execute on-chain trades. Costs ~$0.17 USDC per run.
argument-hint: [symbol, interval, chain, trade-amount]
---

# Crypto Trading Bot

A complete pipeline for building an autonomous crypto trading bot: fetch real-time and historical price data, compute technical indicators, monitor social sentiment, discover trending tokens, and execute on-chain swaps.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.17/run |
| Payment | USDC on Base |
| Endpoints | 13 services |

## Steps

### Phase 1: Price Data

1. Fetch real-time price from Binance
   GET https://x402.orth.sh/dome/crypto-prices/binance?currency={symbol}
   Cost: USDC/call
   Source: Orthogonal

2. Fetch corroborating price from Chainlink oracle
   GET https://x402.orth.sh/dome/crypto-prices/chainlink?currency={symbol}
   Cost: USDC/call
   Source: Orthogonal

3. Get market data — price, market cap, volume, DeFi pool data
   POST https://api-staging.intra-tls2.dctx.link/x402/agent/qrn:agent:68f59a6a93d1a55ee56c7d3b
   Body: { "input": "Get current price, 24h change, volume and market cap for {symbol}" }
   Cost: $0.10/call
   Source: x402 Bazaar

### Phase 2: Technical Analysis

4. Compute indicators and trading signal (RSI, MACD, Bollinger, EMAs)
   POST https://mesh.heurist.xyz/x402/agents/YahooFinanceAgent/indicator_snapshot
   Body: { "symbol": "{symbol}-USD", "interval": "1d", "period": "6mo" }
   Cost: $0.01/call
   Source: x402 Bazaar

5. Get funding rates for perpetuals on Binance
   POST https://mesh.heurist.xyz/x402/agents/FundingRateAgent/get_all_funding_rates
   Cost: $0.01/call
   Source: x402 Bazaar

### Phase 3: Sentiment

6. Get trending tokens on Twitter
   POST https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/get_trending_tokens
   Body: { "time_window": "24h" }
   Cost: $0.01/call
   Source: x402 Bazaar

7. Search Twitter mentions for specific tokens
   POST https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions
   Body: { "keywords": ["{symbol}"], "days_ago": 3, "limit": 20 }
   Cost: $0.01/call
   Source: x402 Bazaar

### Phase 4: Execution

8. Execute on-chain token swap on Base
   POST https://dev.x420.dev/api/puff-custom
   Body: { "amount": "{usdc_amount}" }
   Cost: Up to $5.00/call
   Source: x402 Bazaar`,
  },
  {
    id: "youtube-to-podcast",
    name: "YouTube to Podcast",
    description:
      "Convert any YouTube video into a podcast by extracting transcript, generating a script, and producing audio.",
    services: [
      {
        name: "ScrapeCreators",
        description: "Fetch YouTube video details and transcript",
        price: "$0.01 / call",
        logoUrl: logo("ScrapeCreators"),
      },
      {
        name: "MiniMax",
        description: "AI script generation and text-to-speech",
        price: "$0.10 / call",
        logoUrl: logo("MiniMax"),
      },
    ],
    estimatedCostPerRun: 0.05,
    chain: "Base",
    skillMd: `---
name: youtube-to-podcast
description: Convert a YouTube video into a podcast by fetching video metadata, extracting the transcript, generating an AI-enhanced script, and producing audio. Costs ~$0.05 USDC per run.
argument-hint: [youtube-video-url, youtube-video-id]
---

# YouTube to Podcast

Transform any YouTube video into a podcast-ready audio episode. Fetch video metadata and transcript, use AI to reformat content into an engaging podcast script, and generate text-to-speech audio.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.05/run |
| Payment | USDC on Base |
| Endpoints | 4 services |

## Steps

1. Fetch YouTube video details (title, description, duration, channel info)
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video?videoId={video_id}
   Cost: $0.01/call
   Source: Orthogonal

2. Extract full video transcript
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video/transcript?videoId={video_id}
   Cost: $0.01/call
   Source: Orthogonal

3. Fetch channel metadata (host name, branding)
   GET https://x402.orth.sh/scrapecreators/v1/youtube/channel?channelId={channel_id}
   Cost: $0.01/call
   Source: Orthogonal

4. Generate podcast script + text-to-speech audio
   POST https://api.questflow.ai/x402/agent/qrn:agent:68ee3d375e8bc20f70eba02c
   Body: { "input": "Convert this YouTube transcript into a podcast episode with intro, segments, and outro. Transcript: {transcript}. Video title: {title}." }
   Cost: $0.10/call
   Source: x402 Bazaar`,
  },
  {
    id: "b2b-lead-qualifier",
    name: "B2B Lead Qualifier",
    description:
      "Find, enrich, and qualify B2B sales leads using company databases, contact enrichment, LinkedIn intelligence, and web scraping.",
    services: [
      {
        name: "Crustdata",
        description: "Company search, enrichment, and LinkedIn post monitoring",
        price: "$0.01 / call",
        logoUrl: logo("Crustdata"),
      },
      {
        name: "Firecrawl",
        description: "Scrape company websites for tech stack signals",
        price: "$0.01 / call",
        logoUrl: logo("Firecrawl"),
      },
      {
        name: "Openmart",
        description: "Business signal enrichment",
        price: "$0.01 / call",
        logoUrl: logo("Openmart"),
      },
      {
        name: "Sixtyfour",
        description: "Email finding and lead enrichment",
        price: "$0.01 / call",
        logoUrl: logo("Sixtyfour"),
      },
    ],
    estimatedCostPerRun: 0.13,
    chain: "Base",
    skillMd: `---
name: b2b-saas-lead-qualifier
description: Find, enrich, and qualify B2B sales leads for your SaaS product using company databases, contact enrichment, LinkedIn intelligence, and web scraping. Costs ~$0.13 USDC per lead run.
argument-hint: [target-industry, company-size, icp-description, product-category]
---

# B2B SaaS Lead Qualifier

Discover and qualify B2B sales leads end-to-end: search companies by ICP criteria, enrich with firmographic and contact data, find decision-maker emails, scrape company websites for tech stack signals, and surface LinkedIn activity.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.13/lead |
| Payment | USDC on Base |
| Endpoints | 10 services |

## Steps

1. Search company database by ICP filters
   POST https://x402.orth.sh/crustdata/screener/companydb/search
   Body: { "filters": { "op": "and", "conditions": [{ "field": "industry", "op": "contains", "value": "{target-industry}" }] }, "limit": 25 }
   Cost: $0.01/call
   Source: Orthogonal

2. Identify & confirm company records
   POST https://x402.orth.sh/crustdata/screener/identify/
   Body: { "company_domain": "{company_domain}" }
   Cost: $0.01/call
   Source: Orthogonal

3. Enrich company with firmographic data
   GET https://x402.orth.sh/crustdata/screener/company?company_domain={company_domain}
   Cost: $0.02/call
   Source: Orthogonal

4. Enrich via Openmart for business signals
   POST https://x402.orth.sh/openmart/api/v1/enrich_company
   Body: { "website_url": "https://{company_domain}" }
   Cost: $0.01/call
   Source: Orthogonal

5. Scrape company website for tech stack clues
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "https://{company_domain}", "wait_time": 7500 }
   Cost: $0.01/call
   Source: x402 Bazaar

6. Extract structured data from company pages
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["https://{company_domain}/pricing"], "extraction_prompt": "Extract tools, tech stack, pricing tiers, and company size indicators." }
   Cost: $0.01/call
   Source: x402 Bazaar

7. Search LinkedIn posts for buying signals
   POST https://x402.orth.sh/crustdata/screener/linkedin_posts/keyword_search/
   Body: { "keywords": ["{product-category} software"], "author_company_domain": "{company_domain}" }
   Cost: $0.01/call
   Source: Orthogonal

8. Enrich decision-maker contact
   GET https://x402.orth.sh/crustdata/screener/person/enrich?linkedin_profile_url={linkedin_url}
   Cost: $0.02/call
   Source: Orthogonal

9. Find decision-maker email
   POST https://x402.orth.sh/sixtyfour/find-email
   Body: { "first_name": "{first_name}", "last_name": "{last_name}", "company_domain": "{company_domain}" }
   Cost: $0.01/call
   Source: Orthogonal

10. Enrich lead with full contact profile
    POST https://x402.orth.sh/sixtyfour/enrich-lead
    Body: { "email": "{email}", "company_domain": "{company_domain}" }
    Cost: $0.01/call
    Source: Orthogonal`,
  },
];
