---
name: b2b-saas-lead-qualifier
description: Find, enrich, qualify B2B sales leads for your SaaS product and email you the reports. Costs ~$2.50 USDC per run.
argument-hint: [target-industry, company-size, icp-description, your-email]
---

# B2B SaaS Lead Qualifier

Search for target companies, enrich them with firmographic data, find and verify decision-maker contact info, score leads against your ICP, and deliver a complete qualified lead report to your inbox. This bundle covers the full top-of-funnel workflow from discovery to deliverable.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$2.50/run |
| Payment | USDC on Base |
| Endpoints | 12 services |

## Steps

1. **Search for target companies by industry/vertical**
   POST https://x402.orth.sh/openmart/api/v1/search/only_ids
   Body: { "query": "{target-industry} {company-size}", "filters": { "industry": "{industry}", "employee_count_min": 10, "employee_count_max": 500 } }
   Cost: ~$0.05/call
   Source: Orthogonal (Openmart)

2. **Fetch full business records for matched company IDs**
   GET https://x402.orth.sh/openmart/api/v1/business_records/list/{id_type}
   Body: { "ids": ["{id1}", "{id2}", "..."], "id_type": "openmart_id" }
   Cost: ~$0.10/call (up to 100 records)
   Source: Orthogonal (Openmart)

3. **Enrich companies with deep firmographic data (headcount, revenue, funding, job openings, decision makers)**
   GET https://x402.orth.sh/crustdata/screener/company
   Params: `?company_domain={domain1},{domain2}`
   Cost: ~$0.10/company batch
   Source: Orthogonal (Crustdata)

4. **Identify companies by domain/name to get Crustdata company IDs**
   POST https://x402.orth.sh/crustdata/screener/identify/
   Body: { "company_domain": "{domain}" }
   Cost: ~$0.05/call
   Source: Orthogonal (Crustdata)

5. **Search LinkedIn posts by keyword to find buying signals and active companies**
   POST https://x402.orth.sh/crustdata/screener/linkedin_posts/keyword_search/
   Body: { "keywords": ["{your-saas-category}", "{pain-point-keyword}"], "sort_by": "recency", "date_posted": "past_month" }
   Cost: ~$0.10/call
   Source: Orthogonal (Crustdata)

6. **Enrich decision-maker contacts via LinkedIn URL or business email**
   GET https://x402.orth.sh/crustdata/screener/person/enrich
   Params: `?linkedin_profile_url={linkedin_url}`
   Cost: ~$0.10/person
   Source: Orthogonal (Crustdata)

7. **Search Apollo for people (VPs, Directors, Heads of) at target companies**
   POST https://stableenrich.dev/api/apollo/people-search
   Body: { "q_organization_domains": ["{domain}"], "person_titles": ["VP of Engineering", "Head of Product", "CTO", "Director of Operations"], "page": 1, "per_page": 10 }
   Cost: ~$0.05/call
   Source: x402 Bazaar (stableenrich.dev)

8. **Enrich individual leads from Apollo with full contact profile**
   POST https://stableenrich.dev/api/apollo/people-enrich
   Body: { "id": "{apollo_person_id}" }
   Cost: ~$0.05/person
   Source: x402 Bazaar (stableenrich.dev)

9. **Find email address for each qualified lead**
   POST https://x402.orth.sh/sixtyfour/find-email
   Body: { "first_name": "{first}", "last_name": "{last}", "domain": "{company_domain}" }
   Cost: ~$0.10/lead
   Source: Orthogonal (Sixtyfour)

10. **Enrich lead profile with social and contact data**
    POST https://x402.orth.sh/sixtyfour/enrich-lead
    Body: { "email": "{email}", "linkedin_url": "{linkedin_url}" }
    Cost: ~$0.10/lead
    Source: Orthogonal (Sixtyfour)

11. **Verify email addresses before sending**
    POST https://stableenrich.dev/api/hunter/email-verifier
    Body: { "email": "{lead_email}" }
    Cost: ~$0.05/email
    Source: x402 Bazaar (stableenrich.dev)

12. **Email the qualified lead report to yourself**
    POST https://stableemail.dev/api/send
    Body: { "to": "{your-email}", "subject": "B2B Lead Report — {date}", "html": "{formatted_lead_table_with_scores}" }
    Cost: ~$0.01/email
    Source: x402 Bazaar (stableemail.dev)

## Notes

- **Step 1–2** use Openmart for SMB/local business discovery; for pure SaaS/tech targets, lean on Apollo org search (step 7) as primary discovery
- **Step 5** (LinkedIn post keyword search) is a strong intent signal — companies posting about your category are actively thinking about the problem you solve
- **Lead scoring** should be done in your orchestration layer between steps 10 and 12: score leads on ICP fit (industry match, headcount in range, funding stage, tech stack signals) before including in the final report
- **Apollo org-level search** is also available at `https://stableenrich.dev/api/apollo/org-search` if you prefer searching organizations first
- **Crustdata company enrichment** returns job openings and recent news, which are excellent qualification signals (e.g., a company hiring in your category = active buyer)
- Run steps 9–11 only for leads that score above your ICP threshold to keep costs controlled
- Estimated cost assumes ~10 leads enriched end-to-end per run; scale linearly with lead volume