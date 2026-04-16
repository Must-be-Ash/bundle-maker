---
name: brand-mention-monitor
description: Monitor your brand across Twitter/X, Instagram, TikTok, Facebook, Reddit, and news sources, analyze sentiment, and send email notifications. Costs ~$0.17 per run.
argument-hint: [brand-name, keywords, notification-email]
---

# Brand Mention Monitor

Sweep your brand name across social media platforms (Twitter/X, Instagram, TikTok, Facebook, Reddit) and news sources, aggregate all mentions, and deliver a digest notification via email. Use this bundle on a schedule to stay on top of what people are saying about you in real time.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.17/run |
| Payment | USDC on Base |
| Endpoints | 12 services |

## Steps

1. **Search Twitter/X for brand mentions (influential accounts)**
   POST `https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions`
   Body:
   ```json
   {
     "keywords": ["{brand_name}", "{brand_alias}", "{brand_hashtag}"],
     "days_ago": 1,
     "limit": 20,
     "debug": false
   }
   ```
   Cost: $0.01/call
   Source: x402 Bazaar

2. **Fetch Instagram brand mentions**
   POST `https://stablesocial.dev/api/instagram/search`
   Body:
   ```json
   {
     "query": "{brand_name}"
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stablesocial.dev)

3. **Search Instagram brand hashtags**
   POST `https://stablesocial.dev/api/instagram/search-tags`
   Body:
   ```json
   {
     "query": "{brand_hashtag}"
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stablesocial.dev)

4. **Fetch TikTok brand mentions**
   POST `https://stablesocial.dev/api/tiktok/search`
   Body:
   ```json
   {
     "query": "{brand_name}"
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stablesocial.dev)

5. **Search TikTok brand hashtags**
   POST `https://stablesocial.dev/api/tiktok/search-hashtag`
   Body:
   ```json
   {
     "query": "{brand_hashtag}"
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stablesocial.dev)

6. **Search Facebook for brand mentions**
   POST `https://stablesocial.dev/api/facebook/search`
   Body:
   ```json
   {
     "query": "{brand_name}"
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stablesocial.dev)

7. **Search Reddit for brand mentions**
   POST `https://stablesocial.dev/api/reddit/search`
   Body:
   ```json
   {
     "query": "{brand_name}"
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stablesocial.dev)

8. **Search Reddit post comments for brand discussions**
   POST `https://stableenrich.dev/api/reddit/search`
   Body:
   ```json
   {
     "query": "{brand_name}",
     "limit": 10
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

9. **Search news articles for brand mentions**
   POST `https://stableenrich.dev/api/serper/news`
   Body:
   ```json
   {
     "q": "{brand_name}",
     "num": 10,
     "tbs": "qdr:d"
   }
   ```
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

10. **Deep web search for brand coverage**
    POST `https://stableenrich.dev/api/exa/search`
    Body:
    ```json
    {
      "query": "\"{brand_name}\" mention OR review OR article",
      "numResults": 10,
      "startPublishedDate": "{yesterday_iso}"
    }
    ```
    Cost: ~$0.01/call
    Source: x402 Bazaar (stableenrich.dev)

11. **Scrape and extract content from top mention URLs**
    POST `https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data`
    Body:
    ```json
    {
      "urls": ["{mention_url_1}", "{mention_url_2}"],
      "extraction_prompt": "Extract the brand mention, sentiment (positive/negative/neutral), author name, publish date, and key quote about {brand_name}",
      "debug": false
    }
    ```
    Cost: $0.01/call
    Source: x402 Bazaar

12. **Send email digest with all mention results**
    POST `https://stableemail.dev/api/send`
    Body:
    ```json
    {
      "to": "{notification_email}",
      "subject": "Brand Mention Digest: {brand_name} — {today_date}",
      "body": "## Brand Mentions Summary\n\n**Twitter:** {twitter_results}\n\n**Instagram:** {instagram_results}\n\n**TikTok:** {tiktok_results}\n\n**Facebook:** {facebook_results}\n\n**Reddit:** {reddit_results}\n\n**News:** {news_results}\n\n**Web:** {exa_results}"
    }
    ```
    Cost: ~$0.03/call
    Source: x402 Bazaar (stableemail.dev)

## Notes

- Replace `{brand_name}`, `{brand_hashtag}`, and `{notification_email}` with your actual values before running
- The Twitter/X search endpoint (ElfaTwitterIntelligenceAgent) returns only influential accounts, not all mentions — good for signal-to-noise ratio
- Run the scrape step (Step 11) only on the top 3–5 URLs to keep costs low; each URL scrape costs ~$0.01
- Set up a scheduler (e.g., cron) to run this bundle every 1–24 hours depending on monitoring needs
- The `serper/news` endpoint supports `tbs=qdr:d` for last 24 hours, `qdr:w` for last week
- Reddit search is available from both `stablesocial.dev` (social-oriented) and `stableenrich.dev` (research-oriented) — use both for full coverage
- Total cost assumes one scrape call covering 2 URLs; scale up as needed
- `stableenrich.dev/api/exa/answer` can also be used to ask "What are people saying about {brand_name} today?" for a synthesized AI summary at ~$0.01/call