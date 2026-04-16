---
name: vacation-planner
description: Research and plan a complete vacation with destination info, weather, maps, local attractions, and web search. Costs ~$0.10 USDC per run.
argument-hint: [destination, travel-dates, origin-city, budget]
---

# Vacation Planner

Research and plan a complete vacation end-to-end — search for destination information, check the weather forecast, explore local attractions and restaurants via Google Maps, scrape travel sites for deals, and compile everything into a comprehensive trip plan. Use this bundle when you want an AI-powered travel research workflow.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.10/run |
| Payment | USDC on Base |
| Endpoints | 8 services |

## Steps

1. **Web search for destination overview & travel tips**
   POST https://stableenrich.dev/api/exa/search
   Body: { "query": "best things to do in {destination} travel guide {travel-dates}", "numResults": 10 }
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

2. **Search for flights and hotels (web scrape travel sites)**
   POST https://stableenrich.dev/api/firecrawl/search
   Body: { "query": "flights from {origin-city} to {destination} {travel-dates} hotel deals" }
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

3. **Get weather forecast for destination**
   POST https://stableenrich.dev/api/exa/answer
   Body: { "query": "weather forecast for {destination} in {travel-dates} month — what to expect, temperature, rainfall" }
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

4. **Find top attractions via Google Maps text search**
   POST https://stableenrich.dev/api/google-maps/text-search/full
   Body: { "query": "top tourist attractions in {destination}", "limit": 10 }
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

5. **Find restaurants via Google Maps nearby search**
   POST https://stableenrich.dev/api/google-maps/nearby-search/full
   Body: { "query": "best restaurants in {destination}", "type": "restaurant", "limit": 10 }
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

6. **Get place details for top picks (repeat per venue)**
   POST https://stableenrich.dev/api/google-maps/place-details/full
   Body: { "place_id": "{place_id_from_step_4_or_5}" }
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

7. **Scrape a travel blog or booking site for itinerary ideas**
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{travel_site_url}", "wait_time": 7500, "debug": false }
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

8. **Deep web research — Reddit travel advice for destination**
   POST https://stableenrich.dev/api/reddit/search
   Body: { "query": "{destination} travel tips best time to visit", "subreddit": "travel", "limit": 20 }
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

## Notes

- **No dedicated flight or hotel booking APIs were found** in the x402 ecosystem at this time — use Steps 2 and 7 to scrape Skyscanner, Google Flights, Booking.com, or Airbnb URLs for pricing data
- Steps 4–6 use **Google Maps** via stableenrich.dev, which returns ratings, hours, addresses, and reviews — ideal for building a day-by-day itinerary
- Step 8 pulls **Reddit r/travel community advice**, which is often the most candid source for real traveler tips
- Run Step 6 multiple times (once per attraction or restaurant) to get full details on your shortlist — budget an extra $0.01 per venue
- For a full itinerary generator, pipe all collected data into a single AI prompt (e.g., via the Questflow Tars orchestrator at `https://api-staging.intra-tls2.dctx.link/x402/copilot/qrn:copilot:tars`, max $0.10/call) to synthesize a structured day-by-day plan
- All stableenrich.dev endpoints pay in **USDC on Base** — exact per-call pricing is not published in their x402 metadata; estimate $0.005–$0.02 per call based on similar providers