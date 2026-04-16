export const skillMd = `---
name: competitor-price-monitor
description: Scrape competitor websites for pricing data, extract structured price info, and send email alerts when prices shift. Costs ~$0.08 USDC per run.
argument-hint: [competitor-urls, product-names, alert-email]
---

# Competitor Price Monitor

Scrape competitors' pricing pages, extract structured price data, detect changes, and deliver email alerts when prices shift.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.08/run |
| Payment | USDC on Base |
| Endpoints | 6 services |

## Steps

1. Scrape each competitor pricing page
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{competitor_pricing_url}", "wait_time": 7500 }
   Cost: $0.01/call
   Source: x402 Bazaar

2. Extract structured pricing data from scraped content
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["{competitor_pricing_url}"], "extraction_prompt": "Extract all product names, prices, and plan tiers as structured JSON." }
   Cost: $0.01/call
   Source: x402 Bazaar

3. Search web for competitor pricing announcements
   POST https://stableenrich.dev/api/firecrawl/search
   Body: { "query": "{competitor_name} pricing changes", "limit": 5 }
   Cost: $0.01/call
   Source: stableenrich.dev

4. Cross-reference with Exa for recent pricing news
   POST https://stableenrich.dev/api/exa/search
   Body: { "query": "{competitor_name} price increase OR price change", "numResults": 5 }
   Cost: $0.01/call
   Source: stableenrich.dev

5. Enrich competitor company profile
   POST https://x402.orth.sh/openmart/api/v1/enrich_company
   Body: { "website": "{competitor_domain}" }
   Cost: $0.01/call
   Source: Orthogonal

6. Send email alert with price change summary
   POST https://stableemail.dev/api/send
   Body: { "to": "{alert_email}", "subject": "Price Change Detected: {competitor_name}", "body": "{price_diff_summary}" }
   Cost: $0.01/call
   Source: stableemail.dev`;
