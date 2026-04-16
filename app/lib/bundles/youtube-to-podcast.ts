export const skillMd = `---
name: youtube-to-podcast
description: Convert a YouTube video into a podcast by fetching video metadata, extracting the transcript, generating an AI-enhanced script, and producing audio. Costs ~$0.05 USDC per run.
argument-hint: [youtube-video-url, youtube-video-id]
---

# YouTube to Podcast

Transform any YouTube video into a podcast-ready audio episode. Fetch video metadata and transcript, use AI to reformat content into an engaging podcast script, and generate text-to-speech audio.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.05/run |
| Payment | USDC on Base |
| Endpoints | 4 services |

## Steps

1. Fetch YouTube video details (title, description, duration, channel info)
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video?videoId={video_id}
   Cost: $0.01/call
   Source: Orthogonal

2. Extract full video transcript
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video/transcript?videoId={video_id}
   Cost: $0.01/call
   Source: Orthogonal

3. Fetch channel metadata (host name, branding)
   GET https://x402.orth.sh/scrapecreators/v1/youtube/channel?channelId={channel_id}
   Cost: $0.01/call
   Source: Orthogonal

4. Generate podcast script + text-to-speech audio
   POST https://api.questflow.ai/x402/agent/qrn:agent:68ee3d375e8bc20f70eba02c
   Body: { "input": "Convert this YouTube transcript into a podcast episode with intro, segments, and outro. Transcript: {transcript}. Video title: {title}." }
   Cost: $0.10/call
   Source: x402 Bazaar`;
