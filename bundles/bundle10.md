---
name: competitor-job-tracker
description: Scrape and analyze competitor job postings to track who's hiring for what roles. Costs ~$0.08 USDC per run.
argument-hint: [competitor-company-names, target-roles, keywords]
---

# Competitor Job Tracker

Monitor competitor hiring activity by searching structured job databases, scraping career pages directly, and enriching results with LinkedIn company signals. Use this bundle to identify which competitors are scaling specific teams, entering new markets, or building out new capabilities based on their open roles.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.08/run |
| Payment | USDC on Base |
| Endpoints | 8 services |

## Steps

1. Search job listings by company and filters (preview)
   POST https://x402.orth.sh/coresignal/v2/job_base/search/filter/preview
   Body: {
     "company_name": "{competitor_name}",
     "title": "{role_keyword}",
     "date_posted": "last_30_days"
   }
   Cost: ~$0.01/call
   Source: Orthogonal (Coresignal)

2. Get full job IDs from filtered search
   POST https://x402.orth.sh/coresignal/v2/job_base/search/filter
   Body: {
     "company_name": "{competitor_name}",
     "title": "{role_keyword}",
     "date_posted": "last_30_days",
     "limit": 50
   }
   Cost: ~$0.01/call
   Source: Orthogonal (Coresignal)

3. Search LinkedIn posts about competitor hiring
   POST https://x402.orth.sh/crustdata/screener/linkedin_posts/keyword_search/
   Body: {
     "keyword": "{competitor_name} hiring {role}",
     "sort_by": "recency",
     "date_posted": "past_month"
   }
   Cost: ~$0.01/call
   Source: Orthogonal (Crustdata)

4. Fetch competitor LinkedIn company profile
   GET https://x402.orth.sh/scrapecreators/v1/linkedin/company?company_url={competitor_linkedin_url}
   Cost: ~$0.01/call
   Source: Orthogonal (Scrape Creators)

5. Scrape competitor careers page directly
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: {
     "url": "{competitor_careers_page_url}",
     "wait_time": 7500,
     "debug": false
   }
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist/Firecrawl)

6. Extract structured job data from careers page or domain wildcard
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: {
     "urls": ["{competitor_domain}/careers/*"],
     "extraction_prompt": "Extract all job postings including job title, team/department, location, employment type, and date posted",
     "debug": false
   }
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist/Firecrawl)

7. Search news for competitor hiring announcements
   POST https://stableenrich.dev/api/serper/news
   Body: {
     "q": "{competitor_name} hiring {role} 2025",
     "num": 10
   }
   Cost: ~$0.01/call
   Source: stableenrich.dev

8. Web search for job board listings across Indeed/LinkedIn/Glassdoor
   POST https://stableenrich.dev/api/firecrawl/search
   Body: {
     "query": "site:linkedin.com/jobs OR site:indeed.com {competitor_name} {role}",
     "limit": 10
   }
   Cost: ~$0.01/call
   Source: stableenrich.dev

## Notes

- Run Steps 1–2 (Coresignal) for each competitor you want to track; multiply cost per competitor
- Step 6 wildcard domain crawl (`competitor.com/careers/*`) works best for companies with public ATS pages (Greenhouse, Lever, Workday)
- Step 3 LinkedIn post search surfaces unofficial signals like "We're hiring!" posts that may not appear in job boards yet
- Combine role keywords like "machine learning", "MLOps", or "growth" to map competitors' strategic focus areas
- Coresignal covers LinkedIn-sourced job data; pair with Firecrawl scraping for companies that self-host their careers pages
- stableenrich.dev endpoints require standard HTTP x402 payment headers — pricing is approximate and may vary by query volume