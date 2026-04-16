export const skillMd = `---
name: email-enrichment-agent
description: Enrich email addresses with person, company, and B2B contact data using multiple layered data sources. Costs ~$0.15-$0.50 USDC per email.
argument-hint: [email-address, company-domain]
---

# Email Enrichment Agent

Given email addresses, enrich each with full person profiles and company data using layered B2B data providers, then verify deliverability.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.15-$0.50/email |
| Payment | USDC on Base |
| Endpoints | 10 services |

## Steps

1. Verify email deliverability
   GET https://stableenrich.dev/api/hunter/email-verifier?email={email}
   Cost: $0.01/call
   Source: stableenrich.dev

2. Validate email and resolve identity
   POST https://stableenrich.dev/api/minerva/validate-emails
   Body: { "emails": ["{email}"] }
   Cost: $0.01/call
   Source: stableenrich.dev

3. Enrich person by email (Tomba)
   GET https://x402.orth.sh/tomba/v1/enrich?email={email}
   Cost: $0.01/call
   Source: Orthogonal

4. Deep person enrichment (People Data Labs)
   GET https://x402.orth.sh/peopledatalabs/v5/person/enrich?email={email}
   Cost: $0.05/call
   Source: Orthogonal

5. Person enrichment — LinkedIn, GitHub (Crustdata)
   GET https://x402.orth.sh/crustdata/screener/person/enrich?business_email={email}
   Cost: $0.05/call
   Source: Orthogonal

6. Enrich company by domain (People Data Labs)
   GET https://x402.orth.sh/peopledatalabs/v5/company/enrich?website={domain}
   Cost: $0.05/call
   Source: Orthogonal

7. Company firmographics (Crustdata)
   GET https://x402.orth.sh/crustdata/screener/company?company_domain={domain}
   Cost: $0.05/call
   Source: Orthogonal

8. Find additional contacts at same company (Apollo)
   POST https://stableenrich.dev/api/apollo/people-search
   Body: { "q_organization_domains": ["{domain}"] }
   Cost: $0.02/call
   Source: stableenrich.dev`;
