---
name: competitor-price-monitor
description: Monitor competitors' pricing by scraping their websites, extracting structured price data, and enriching company intelligence. Costs ~$0.04 per run.
argument-hint: [competitor-urls, product-names, competitor-company-names]
---

# Competitor Price Monitor

Scrape competitor product pages, extract structured pricing data using AI-powered web extraction, and enrich company profiles to build a comprehensive picture of your competitive landscape. Use this bundle to run scheduled price sweeps across multiple competitor sites and surface pricing changes before they impact your business.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.04/run |
| Payment | USDC on Base |
| Endpoints | 5 services |

## Steps

1. Search the web for competitor pricing pages
   POST https://api.questflow.ai/x402/agent/qrn:agent:68ee1cfebd72982773cd07e8
   Body: { "input": "Search for pricing pages and product listings for {competitor_name} site:{competitor_domain}" }
   Cost: $0.10/call (max)
   Source: x402 Bazaar

2. Scrape competitor product/pricing page (run per URL)
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{competitor_pricing_url}", "wait_time": 7500, "debug": false }
   Cost: $0.01/call
   Source: x402 Bazaar

3. Extract structured pricing data from scraped pages (run per competitor domain)
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["{competitor_domain}/pricing", "{competitor_domain}/products/*"], "extraction_prompt": "Extract all product names, SKUs, prices, discount prices, subscription tiers, and any promotional pricing. Return as structured JSON with fields: product_name, regular_price, sale_price, currency, plan_tier.", "debug": false }
   Cost: $0.01/call
   Source: x402 Bazaar

4. Enrich competitor company profile for context
   POST https://x402.orth.sh/openmart/api/v1/enrich_company
   Body: { "website": "{competitor_domain}" }
   Cost: ~$0.01/call
   Source: Orthogonal

5. Deep research pass — synthesize pricing intelligence report
   POST https://api-staging.intra-tls2.dctx.link/x402/agent/qrn:agent:682306635380bd59df4992fa
   Body: { "input": "Research and summarize current pricing strategy for {competitor_name}. Compare their tiers, discounts, and positioning vs our pricing at {your_price_points}. Identify any recent changes." }
   Cost: $0.10/call (max)
   Source: x402 Bazaar

## Notes

- **Run steps 2 & 3 for each competitor URL** — costs scale linearly with the number of competitors monitored (e.g., 5 competitors ≈ $0.10 in scraping costs)
- Step 3 supports wildcard URLs like `competitor.com/products/*` to crawl entire product catalogs in one call
- Step 1 (Tavily search) is useful when you don't know the exact pricing page URL for a competitor
- Step 4 (Openmart enrichment) returns company size, industry, and contact info — useful for contextualizing pricing strategy (e.g., enterprise vs. SMB focus)
- Step 5 (Gemini deep search) can be used as a final synthesis step to generate a human-readable competitive pricing report
- For ongoing monitoring, schedule this bundle to run daily or weekly and diff the extracted prices against your stored baseline to detect changes
- Some competitor sites use JavaScript-heavy rendering — the `wait_time` parameter in step 2 can be increased up to 15000ms for slow-loading pages