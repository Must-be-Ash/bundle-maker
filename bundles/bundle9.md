---
name: meeting-transcribe-summarize
description: Transcribe meeting recordings from video/audio sources and generate AI-powered summaries with key takeaways. Costs ~$0.05 USDC per run.
argument-hint: [recording-url, platform, summary-style]
---

# Meeting Transcription & Summarization

Automatically transcribe meeting recordings from YouTube, Twitter, TikTok, Facebook, or Instagram, then generate structured AI summaries with key decisions, action items, and highlights. Use this when you need to process recorded meetings, webinars, or video calls without manual note-taking.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.05/run |
| Payment | USDC on Base |
| Endpoints | 6 services |

## Steps

1. **Upload or reference your recording** (if local file, upload first)
   POST https://stableupload.dev/api/upload
   Body: { "file": "<binary audio/video file>" }
   Cost: usage-based
   Source: x402 Bazaar (stableupload.dev)

2. **Transcribe a YouTube meeting recording**
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video/transcript
   Query: `?videoUrl={youtube_meeting_url}`
   Cost: ~$0.01/call
   Source: Orthogonal

3. **Transcribe a Twitter/X Spaces or video recording**
   GET https://x402.orth.sh/scrapecreators/v1/twitter/tweet/transcript
   Query: `?tweetUrl={twitter_video_url}`
   Cost: ~$0.01/call
   Source: Orthogonal

4. **Transcribe a TikTok video recording** (if applicable)
   GET https://x402.orth.sh/scrapecreators/v1/tiktok/video/transcript
   Query: `?videoUrl={tiktok_url}`
   Cost: ~$0.01/call
   Source: Orthogonal

5. **Transcribe a Facebook meeting post** (if applicable)
   GET https://x402.orth.sh/scrapecreators/v1/facebook/post/transcript
   Query: `?postUrl={facebook_video_url}`
   Cost: ~$0.01/call
   Source: Orthogonal

6. **Summarize the transcript with AI** (key decisions, action items, highlights)
   POST https://x402.orth.sh/perplexity/async/chat/completions
   Body: {
     "model": "sonar-pro",
     "messages": [
       {
         "role": "system",
         "content": "You are a meeting summarizer. Extract: 1) Key decisions, 2) Action items with owners, 3) Main discussion topics, 4) Next steps."
       },
       {
         "role": "user",
         "content": "Summarize this meeting transcript:\n\n{transcript}"
       }
     ]
   }
   Cost: ~$0.01/call
   Source: Orthogonal

## Notes

- **Platform coverage**: Steps 2–5 cover the most common meeting recording platforms (YouTube, Twitter/X Spaces, TikTok, Facebook). Only run the step matching your recording's platform — you won't need all four per run, bringing typical cost closer to ~$0.02–$0.03/run.
- **Local files**: Use Step 1 (stableupload.dev) to upload local audio/video files first and get a URL; skip if your recording is already hosted online.
- **Transcript quality**: The Scrape Creators transcript endpoints return auto-generated captions — quality depends on the source platform's captioning accuracy.
- **Summary customization**: Adjust the system prompt in Step 6 to tailor output format (e.g., bullet points, TLDR, structured JSON with action items).
- **Instagram recordings**: Use `https://x402.orth.sh/scrapecreators/v2/instagram/media/transcript` for Instagram Live or Reel recordings (same pattern as other Scrape Creators endpoints).
- **Pricing note**: Exact per-call pricing for Orthogonal endpoints is not listed in the discovery data; the ~$0.01/call estimate is based on typical transcript API pricing. Verify before running at scale.