export const skillMd = `---
name: brand-mention-monitor
description: Monitor your brand across Twitter/X, Instagram, TikTok, Facebook, Reddit, and news sources, then send email notifications. Costs ~$0.17 per run.
argument-hint: [brand-name, keywords, notification-email]
---

# Brand Mention Monitor

Sweep your brand name across social media platforms and news sources, aggregate all mentions, and deliver a digest notification via email.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.17/run |
| Payment | USDC on Base |
| Endpoints | 12 services |

## Steps

1. Search Twitter/X for brand mentions
   POST https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions
   Body: { "keywords": ["{brand_name}"], "days_ago": 1, "limit": 20 }
   Cost: $0.01/call
   Source: x402 Bazaar

2. Fetch Instagram brand mentions
   POST https://stablesocial.dev/api/instagram/search
   Body: { "query": "{brand_name}" }
   Cost: $0.01/call
   Source: stablesocial.dev

3. Fetch TikTok brand mentions
   POST https://stablesocial.dev/api/tiktok/search
   Body: { "query": "{brand_name}" }
   Cost: $0.01/call
   Source: stablesocial.dev

4. Search Facebook for brand mentions
   POST https://stablesocial.dev/api/facebook/search
   Body: { "query": "{brand_name}" }
   Cost: $0.01/call
   Source: stablesocial.dev

5. Search Reddit for brand mentions
   POST https://stablesocial.dev/api/reddit/search
   Body: { "query": "{brand_name}" }
   Cost: $0.01/call
   Source: stablesocial.dev

6. Search news articles
   POST https://stableenrich.dev/api/serper/news
   Body: { "q": "{brand_name}", "num": 10 }
   Cost: $0.01/call
   Source: stableenrich.dev

7. Deep web search for brand coverage
   POST https://stableenrich.dev/api/exa/search
   Body: { "query": "{brand_name} mention OR review", "numResults": 10 }
   Cost: $0.01/call
   Source: stableenrich.dev

8. Send email digest
   POST https://stableemail.dev/api/send
   Body: { "to": "{notification_email}", "subject": "Brand Mention Digest: {brand_name}", "body": "{aggregated_results}" }
   Cost: $0.03/call
   Source: stableemail.dev`;
