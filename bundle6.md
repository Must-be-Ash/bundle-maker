---
name: b2b-saas-lead-qualifier
description: Find, enrich, and qualify B2B sales leads for your SaaS product using company databases, contact enrichment, LinkedIn intelligence, and web scraping. Costs ~$0.13 USDC per lead run.
argument-hint: [target-industry, company-size, icp-description, product-category]
---

# B2B SaaS Lead Qualifier

Discover and qualify B2B sales leads end-to-end: search millions of companies by ICP criteria, enrich with firmographic and contact data, find decision-maker emails, scrape company websites for tech stack signals, and surface LinkedIn activity — all in a single automated workflow.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.13/lead |
| Payment | USDC on Base |
| Endpoints | 10 services |

## Steps

1. **Search company database by ICP filters** (industry, size, HQ, funding, revenue)
   POST `https://x402.orth.sh/crustdata/screener/companydb/search`
   Body:
   ```json
   {
     "filters": {
       "op": "and",
       "conditions": [
         { "field": "hq_country", "op": "eq", "value": "United States" },
         { "field": "headcount", "op": "gte", "value": 50 },
         { "field": "industry", "op": "contains", "value": "{target-industry}" }
       ]
     },
     "sort": { "field": "headcount", "order": "desc" },
     "limit": 25
   }
   ```
   Cost: ~$0.01/call
   Source: Orthogonal

2. **Identify & confirm company records** by domain or name
   POST `https://x402.orth.sh/crustdata/screener/identify/`
   Body:
   ```json
   {
     "company_domain": "{company_domain}"
   }
   ```
   Cost: ~$0.01/call
   Source: Orthogonal

3. **Enrich company with full firmographic data** (headcount, funding, revenue, job openings, decision makers)
   GET `https://x402.orth.sh/crustdata/screener/company?company_domain={company_domain}`
   Cost: ~$0.02/call
   Source: Orthogonal

4. **Enrich company via Openmart** for additional business signals and categories
   POST `https://x402.orth.sh/openmart/api/v1/enrich_company`
   Body:
   ```json
   {
     "website_url": "https://{company_domain}"
   }
   ```
   Cost: ~$0.01/call
   Source: Orthogonal

5. **Scrape company website** for tech stack clues, product language, and pain point signals
   POST `https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url`
   Body:
   ```json
   {
     "url": "https://{company_domain}",
     "wait_time": 7500,
     "debug": false
   }
   ```
   Cost: $0.01/call
   Source: x402 Bazaar

6. **Extract structured data from company website** (pricing pages, integrations, tech stack mentions)
   POST `https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data`
   Body:
   ```json
   {
     "urls": ["https://{company_domain}/pricing", "https://{company_domain}/integrations"],
     "extraction_prompt": "Extract current software tools, tech stack, pricing tiers, company size indicators, and any pain points mentioned.",
     "debug": false
   }
   ```
   Cost: $0.01/call
   Source: x402 Bazaar

7. **Search LinkedIn posts by keyword** to find buying signals and company activity
   POST `https://x402.orth.sh/crustdata/screener/linkedin_posts/keyword_search/`
   Body:
   ```json
   {
     "keywords": ["{product-category} software", "{target-industry} automation"],
     "sort_by": "recency",
     "date_posted": "past_month",
     "author_company_domain": "{company_domain}"
   }
   ```
   Cost: ~$0.01/call
   Source: Orthogonal

8. **Enrich decision-maker contact** (VP, Director, C-suite) by LinkedIn URL or email
   GET `https://x402.orth.sh/crustdata/screener/person/enrich?linkedin_profile_url={linkedin_url}&fields=employment_history,contact_info,skills`
   Cost: ~$0.02/call
   Source: Orthogonal

9. **Find decision-maker email address**
   POST `https://x402.orth.sh/sixtyfour/find-email`
   Body:
   ```json
   {
     "first_name": "{first_name}",
     "last_name": "{last_name}",
     "company_domain": "{company_domain}"
   }
   ```
   Cost: ~$0.01/call
   Source: Orthogonal

10. **Enrich lead with full contact and social profile**
    POST `https://x402.orth.sh/sixtyfour/enrich-lead`
    Body:
    ```json
    {
      "email": "{email}",
      "company_domain": "{company_domain}"
    }
    ```
    Cost: ~$0.01/call
    Source: Orthogonal

11. **Deep web research on company** for recent news, funding rounds, or trigger events
    POST `https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data`
    Body:
    ```json
    {
      "urls": ["https://news.google.com/search?q={company_name}"],
      "extraction_prompt": "Find recent funding announcements, leadership changes, product launches, or expansion news for {company_name}.",
      "debug": false
    }
    ```
    Cost: $0.01/call
    Source: x402 Bazaar

## Notes

- **ICP targeting**: Tune the `companydb/search` filters in Step 1 with your exact ICP — headcount range, funding stage, industry vertical, HQ country, and year founded all supported
- **Buying signals to watch**: LinkedIn posts mentioning competitor tools, job postings for roles your SaaS serves, recent funding (expansion budget), and pricing page visits are strong intent signals
- **Estimated cost** of ~$0.13 is per full lead enrichment cycle (all 11 steps); batch Step 1 to get 25 companies at once, then run Steps 2–11 per qualified target
- **Crustdata** endpoints (Steps 1–4, 7–8) require USDC on Base via Orthogonal's x402 gateway
- **Sixtyfour** (Steps 9–10) and **Heurist Firecrawl** (Steps 5–6, 11) are paid per-call via x402 on Base mainnet
- For higher-volume prospecting, run Step 1 with cursor-based pagination (up to 1000 results/request) and batch-qualify before running full enrichment on top matches