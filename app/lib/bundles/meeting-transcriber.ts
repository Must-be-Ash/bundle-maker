export const skillMd = `---
name: meeting-transcribe-summarize
description: Transcribe meeting recordings and generate AI-powered summaries with key takeaways. Costs ~$0.05 USDC per run.
argument-hint: [recording-url, platform, summary-style]
---

# Meeting Transcription & Summarization

Transcribe meeting recordings from YouTube, Twitter, TikTok, or Facebook, then generate structured AI summaries with key decisions and action items.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.05/run |
| Payment | USDC on Base |
| Endpoints | 6 services |

## Steps

1. Upload local recording (if needed)
   POST https://stableupload.dev/api/upload
   Cost: $0.02/call
   Source: stableupload.dev

2. Transcribe YouTube recording
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video/transcript?videoUrl={url}
   Cost: $0.01/call
   Source: Orthogonal

3. Transcribe Twitter/X recording
   GET https://x402.orth.sh/scrapecreators/v1/twitter/tweet/transcript?tweetUrl={url}
   Cost: $0.01/call
   Source: Orthogonal

4. Transcribe TikTok recording
   GET https://x402.orth.sh/scrapecreators/v1/tiktok/video/transcript?videoUrl={url}
   Cost: $0.01/call
   Source: Orthogonal

5. Transcribe Facebook recording
   GET https://x402.orth.sh/scrapecreators/v1/facebook/post/transcript?postUrl={url}
   Cost: $0.01/call
   Source: Orthogonal

6. Summarize transcript with AI
   POST https://x402.orth.sh/perplexity/async/chat/completions
   Body: { "model": "sonar-pro", "messages": [{ "role": "user", "content": "Summarize this meeting transcript with key decisions, action items, and next steps: {transcript}" }] }
   Cost: $0.01/call
   Source: Orthogonal`;
