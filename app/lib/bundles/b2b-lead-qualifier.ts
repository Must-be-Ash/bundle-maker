export const skillMd = `---
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
    Source: Orthogonal`;
