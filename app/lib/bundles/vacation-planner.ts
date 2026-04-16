export const skillMd = `---
name: vacation-planner
description: Research and plan a complete vacation with destination info, weather, maps, local attractions, and web search. Costs ~$0.10 USDC per run.
argument-hint: [destination, travel-dates, origin-city, budget]
---

# Vacation Planner

Research and plan a complete vacation end-to-end — search for destination information, check the weather, explore local attractions and restaurants via Google Maps, scrape travel sites, and pull Reddit community tips.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.10/run |
| Payment | USDC on Base |
| Endpoints | 8 services |

## Steps

1. Web search for destination overview & travel tips
   POST https://stableenrich.dev/api/exa/search
   Body: { "query": "best things to do in {destination} travel guide {travel-dates}", "numResults": 10 }
   Cost: $0.01/call
   Source: stableenrich.dev

2. Search for flights and hotels
   POST https://stableenrich.dev/api/firecrawl/search
   Body: { "query": "flights from {origin-city} to {destination} {travel-dates} hotel deals" }
   Cost: $0.01/call
   Source: stableenrich.dev

3. Get weather forecast for destination
   POST https://stableenrich.dev/api/exa/answer
   Body: { "query": "weather forecast for {destination} in {travel-dates}" }
   Cost: $0.01/call
   Source: stableenrich.dev

4. Find top attractions via Google Maps
   POST https://stableenrich.dev/api/google-maps/text-search/full
   Body: { "query": "top tourist attractions in {destination}", "limit": 10 }
   Cost: $0.01/call
   Source: stableenrich.dev

5. Find restaurants via Google Maps
   POST https://stableenrich.dev/api/google-maps/nearby-search/full
   Body: { "query": "best restaurants in {destination}", "type": "restaurant", "limit": 10 }
   Cost: $0.01/call
   Source: stableenrich.dev

6. Get place details for top picks
   POST https://stableenrich.dev/api/google-maps/place-details/full
   Body: { "place_id": "{place_id}" }
   Cost: $0.01/call
   Source: stableenrich.dev

7. Scrape a travel blog or booking site
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{travel_site_url}", "wait_time": 7500 }
   Cost: $0.01/call
   Source: x402 Bazaar

8. Reddit travel advice for destination
   POST https://stableenrich.dev/api/reddit/search
   Body: { "query": "{destination} travel tips", "subreddit": "travel", "limit": 20 }
   Cost: $0.01/call
   Source: stableenrich.dev`;
