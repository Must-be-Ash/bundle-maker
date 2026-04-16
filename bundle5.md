---
name: youtube-to-podcast
description: Convert a YouTube video into a podcast by fetching video metadata, extracting the transcript, generating an AI-enhanced script, and producing audio. Costs ~$0.05 USDC per run.
argument-hint: [youtube-video-url, youtube-video-id]
---

# YouTube to Podcast

Transform any YouTube video into a podcast-ready audio episode. This bundle fetches video metadata and transcript from YouTube, uses AI to reformat the content into an engaging podcast script, and generates text-to-speech audio output. Use it to repurpose long-form YouTube content for audio-first audiences.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.05/run |
| Payment | USDC on Base |
| Endpoints | 4 services |

## Steps

1. Fetch YouTube video details (title, description, duration, channel info)
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video?videoId={video_id}
   Cost: ~$0.01/call
   Source: Orthogonal

2. Extract full video transcript (spoken content as text)
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video/transcript?videoId={video_id}
   Cost: ~$0.01/call
   Source: Orthogonal

3. Fetch channel metadata (host name, branding, context for intro/outro)
   GET https://x402.orth.sh/scrapecreators/v1/youtube/channel?channelId={channel_id}
   Cost: ~$0.01/call
   Source: Orthogonal

4. Generate podcast script + text-to-speech audio using MiniMax (multimodal AI with TTS)
   POST https://api.questflow.ai/x402/agent/qrn:agent:68ee3d375e8bc20f70eba02c
   Body: { "input": "Convert this YouTube transcript into a podcast episode with a compelling intro, structured segments, and outro. Transcript: {transcript}. Video title: {title}. Channel: {channel_name}." }
   Cost: ~$0.10 max/call (maxAmountRequired: 100000 = $0.10 USDC)
   Source: x402 Bazaar

## Notes

- The transcript endpoint returns time-stamped captions — pass the raw text to the AI agent for script generation
- MiniMax supports text-to-speech as part of its multimodal capabilities; instruct it explicitly to produce both a written script and an audio file URL
- For videos without auto-generated captions, the transcript endpoint may return limited results
- Video ID is the `v=` parameter in a YouTube URL (e.g., `dQw4w9WgXcQ` from `youtube.com/watch?v=dQw4w9WgXcQ`)
- Channel ID can be retrieved from the video details response in Step 1
- All Orthogonal endpoints route through `https://x402.orth.sh/scrapecreators/` — individual per-call pricing is set by the Orthogonal proxy and billed in USDC on Base