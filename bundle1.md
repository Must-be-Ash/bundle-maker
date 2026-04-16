```
---
name: vacation-planner
description: Research and plan a complete vacation with web search, destination intel, and travel content extraction. Costs ~$0.60 USDC per run.
argument-hint: [destination, travel-dates, origin-city, interests]
---

# Vacation Planner

Research and plan a complete vacation using AI-powered web search, destination content extraction, and structured data gathering. This bundle covers destination research, attraction discovery, weather and travel info scraping, and itinerary synthesis — everything needed to go from idea to a full trip plan.

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
   Body: { "url": "{destination_travel_guide_url}", "wait_time": 7500, "debug": false }
   Cost: $0.01/call
   Source: x402 Bazaar

4. Extract structured data from multiple travel pages (hotels, tours, etc.)
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["{hotel_listing_url}", "{attractions_url}"], "extraction_prompt": "Extract hotel names, prices, ratings, amenities, and availability. Extract attraction names, hours, prices, and descriptions.", "debug": false }
   Cost: $0.01/call
   Source: x402 Bazaar

5. Map and crawl destination tourism websites for comprehensive coverage
   POST https://x402.orth.sh/tavily/map
   Body: { "url": "https://www.lonelyplanet.com/{destination}", "max_depth": 2 }
   Cost: $0.10/call
   Source: Orthogonal

6. Synthesize all gathered data into a full vacation itinerary using Exa + Firecrawl research swarm
   POST https://api.questflow.ai/x402/swarm/qrn:swarm:68d0f3afc7dc21123d8d5b85
   Body: { "input": "Using the following travel data, create a day-by-day itinerary for {destination} covering flights from {origin-city}, hotel recommendations, must-see attractions, restaurant picks, and packing tips for {travel-dates}: {aggregated_data}" }
   Cost: $0.50/call
   Source: x402 Bazaar

## Notes

- Run steps 1–5 in parallel to gather all raw data, then feed results into step 6 for synthesis
- For step 3, use URLs discovered in step 1 (e.g., TripAdvisor, Lonely Planet, official tourism boards)
- The Firecrawl extract (step 4) works best with listing pages that have structured content (hotel aggregators, tour booking sites)
- The Tavily map (step 5) is useful for crawling official city/country tourism websites to discover hidden gems
- The Exa+Firecrawl swarm (step 6) can also independently research and compile the plan if you skip earlier steps
- All endpoints accept USDC on Base mainnet except step 1 (base-sepolia testnet) — adjust your wallet network accordingly
- Estimated cost assumes one call per step; scraping multiple hotel/attraction URLs will increase cost proportionally at $0.01/URL
```