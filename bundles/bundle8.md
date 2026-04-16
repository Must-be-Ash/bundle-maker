---
name: email-enrichment-agent
description: Enrich a list of email addresses with person, company, and B2B contact data using multiple layered data sources. Costs ~$0.15–$0.50 USDC per email enriched.
argument-hint: [email-address, company-domain, person-name]
---

# Email Enrichment Agent

Given a list of email addresses, this bundle enriches each one with full person profiles (name, title, location, social handles, work history) and company data (industry, size, funding, headcount, web traffic). It layers multiple B2B data providers for maximum coverage, then optionally verifies email deliverability before use.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.15–$0.50/email enriched |
| Payment | USDC on Base |
| Endpoints | 10 services |

## Steps

1. **Verify email deliverability before enriching**
   GET https://stableenrich.dev/api/hunter/email-verifier
   Query: `{ "email": "{email_address}" }`
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

2. **Validate email format and resolve identity**
   POST https://stableenrich.dev/api/minerva/validate-emails
   Body: `{ "emails": ["{email_address}"] }`
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

3. **Enrich person by email — primary (Tomba)**
   GET https://x402.orth.sh/tomba/v1/enrich
   Query: `{ "email": "{email_address}" }`
   Cost: ~$0.01/call
   Source: Orthogonal

4. **Get combined person + company data from email (Tomba)**
   GET https://x402.orth.sh/tomba/v1/combined/find
   Query: `{ "email": "{email_address}" }`
   Cost: ~$0.01/call
   Source: Orthogonal

5. **Deep person enrichment — work history, education, skills (People Data Labs)**
   GET https://x402.orth.sh/peopledatalabs/v5/person/enrich
   Query: `{ "email": "{email_address}" }`
   Cost: ~$0.05/call
   Source: Orthogonal

6. **Enrich person by business email — LinkedIn history, GitHub (Crustdata)**
   GET https://x402.orth.sh/crustdata/screener/person/enrich
   Query: `{ "business_email": "{email_address}" }`
   Cost: ~$0.05/call
   Source: Orthogonal

7. **Enrich company by domain extracted from email (People Data Labs)**
   GET https://x402.orth.sh/peopledatalabs/v5/company/enrich
   Query: `{ "website": "{email_domain}" }`
   Cost: ~$0.05/call
   Source: Orthogonal

8. **Deep company firmographics — headcount, funding, job openings, news (Crustdata)**
   GET https://x402.orth.sh/crustdata/screener/company
   Query: `{ "company_domain": "{email_domain}" }`
   Cost: ~$0.05/call
   Source: Orthogonal

9. **Async company enrichment — social, phone, additional signals (Nyne.ai)**
   POST https://x402.orth.sh/nyne/company/enrichment
   Body: `{ "email": "{email_address}" }`
   Cost: ~$0.05/call
   Source: Orthogonal

10. **Apollo people search — find additional contacts at same company**
    POST https://stableenrich.dev/api/apollo/people-search
    Body: `{ "q_organization_domains": ["{email_domain}"], "person_titles": ["decision maker"] }`
    Cost: ~$0.02/call
    Source: x402 Bazaar (stableenrich.dev)

## Notes

- **Run step 1 first** — skip enrichment on invalid/undeliverable emails to avoid wasting credits
- **Steps 3–4 (Tomba)** are fastest for basic person+company lookups from a cold email
- **Steps 5–6 (PDL + Crustdata)** provide deeper professional history and are best for sales/recruiting use cases
- **Steps 7–9** enrich the company domain extracted from the email (e.g. `john@stripe.com` → `stripe.com`)
- **Step 10** is optional — use it to discover additional decision-makers at the same organization
- For bulk lists, process emails in parallel batches; most endpoints support single-email lookups
- Nyne.ai (step 9) is async — poll for results or use a webhook if provided in the response
- Total cost per email depends on which steps yield hits; not all providers will have data on every email