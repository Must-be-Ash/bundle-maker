---
name: competitor-price-monitor
description: Scrape competitor websites for pricing data, extract structured price info, compare changes, and send email alerts when prices shift. Costs ~$0.08 USDC per run.
argument-hint: [competitor-urls, product-names, alert-email]
---

# Competitor Price Monitor

Scrape your competitors' pricing pages, extract structured price data using AI, detect changes from previous snapshots, and deliver email alerts when prices shift. Use this bundle to run on a schedule (daily or hourly) to stay ahead of competitor pricing moves.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.08/run |
| Payment | USDC on Base |
| Endpoints | 6 services |

## Steps

1. **Scrape each competitor pricing page**
   `POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url`
   Body:
   ```json
   {
     "url": "{competitor_pricing_url}",
     "wait_time": 7500,
     "debug": false
   }
   ```
   Cost: $0.01/call
   Source: x402 Bazaar

2. **Extract structured pricing data from scraped content**
   `POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data`
   Body:
   ```json
   {
     "urls": ["{competitor_pricing_url}"],
     "extraction_prompt": "Extract all product names, SKUs, prices, and plan tiers. Return as structured JSON with fields: product_name, price, currency, billing_period, tier.",
     "debug": false
   }
   ```
   Cost: $0.01/call
   Source: x402 Bazaar

3. **Search the web for competitor pricing announcements or changes**
   `POST https://stableenrich.dev/api/firecrawl/search`
   Body:
   ```json
   {
     "query": "{competitor_name} pricing changes {current_year}",
     "limit": 5
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

4. **Cross-reference with Exa for recent news about competitor pricing**
   `POST https://stableenrich.dev/api/exa/search`
   Body:
   ```json
   {
     "query": "{competitor_name} price increase OR price change OR new pricing",
     "numResults": 5,
     "useAutoprompt": true,
     "startPublishedDate": "{7_days_ago_ISO}"
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

5. **Enrich competitor company profile for context**
   `POST https://x402.orth.sh/openmart/api/v1/enrich_company`
   Body:
   ```json
   {
     "website": "{competitor_domain}"
   }
   ```
   Cost: varies (USDC on Base)
   Source: Orthogonal

6. **Send email alert with price change summary**
   `POST https://stableemail.dev/api/send`
   Body:
   ```json
   {
     "to": "{alert_email}",
     "subject": "Competitor Price Change Detected: {competitor_name}",
     "body": "Price changes detected:\n\n{price_diff_summary}\n\nScraped at: {timestamp}"
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableemail.dev)

## Notes

- **Run steps 1–2 for each competitor URL** — costs scale linearly with the number of competitors monitored
- **Store previous price snapshots** in your own database between runs so you can diff current vs. previous prices before triggering the email alert in step 6
- **Firecrawl scrape (step 1)** works best on public pricing pages; JavaScript-heavy SPAs may require the `wait_time` to be increased to 10000ms
- **Firecrawl extract (step 2)** uses natural language extraction — tune the `extraction_prompt` to match your competitors' specific pricing structures (e.g., SaaS tiers, e-commerce SKUs, per-unit costs)
- **Step 3 (web search) and step 4 (Exa)** catch pricing changes announced via blog posts or press releases that may not yet be reflected on live pricing pages
- **Scheduling**: Combine with a cron job or the Questflow Schedule Master agent (`https://api-dev.intra-tls2.dctx.link/x402/swarm/qrn:swarm:683984b8ec15a7b81ce4a4ac`, $0.50 max/call) to automate daily runs without manual intervention
- **Estimated cost per run** assumes 2 competitors × steps 1–2 + steps 3–6 once = ~$0.08 USDC; scales to ~$0.04 per additional competitor added