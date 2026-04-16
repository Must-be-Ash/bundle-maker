---
name: youtube-to-podcast
description: Convert a YouTube video into a podcast by fetching the transcript, rewriting it as a podcast script, and generating audio via text-to-speech. Costs ~$0.03 per run.
argument-hint: [youtube-video-url, podcast-tone, host-name]
---

# YouTube to Podcast Converter

Transform any YouTube video into a listenable podcast episode. This bundle fetches video metadata and transcript, rewrites the content into an engaging podcast script using AI, and synthesizes the final audio. Use it to repurpose educational videos, interviews, or talks into audio-first content.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.03/run |
| Payment | USDC on Base |
| Endpoints | 4 services |

## Steps

1. Fetch YouTube video details (title, description, duration, channel)
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video?videoUrl={youtube_video_url}
   Cost: USDC (Orthogonal pay-per-call)
   Source: Orthogonal

2. Fetch the video transcript (captions/subtitles)
   GET https://x402.orth.sh/scrapecreators/v1/youtube/video/transcript?videoUrl={youtube_video_url}
   Cost: USDC (Orthogonal pay-per-call)
   Source: Orthogonal

3. Rewrite transcript into a podcast script using AI
   POST https://api-staging.intra-tls2.dctx.link/x402/agent/qrn:agent:68ee0521d8b26d2e2dff7dc3
   Body: { "input": "Rewrite the following YouTube video transcript as an engaging podcast script with a natural conversational tone. Add an intro, smooth transitions, and an outro. Video title: {title}. Transcript: {transcript}" }
   Cost: $0.10/call (max)
   Source: x402 Bazaar (MiniMax multimodal AI — supports TTS)

4. Generate spoken audio from the podcast script (text-to-speech)
   POST https://api.questflow.ai/x402/agent/qrn:agent:68ee3d375e8bc20f70eba02c
   Body: { "input": "Convert the following podcast script to speech audio using a natural-sounding voice: {podcast_script}" }
   Cost: $0.10/call (max)
   Source: x402 Bazaar (MiniMax — image/video/TTS platform)

5. Upload the generated audio file for hosting and sharing
   POST https://stableupload.dev/api/upload
   Body: { multipart audio file }
   Cost: USDC (pay-per-call)
   Source: x402 .well-known discovery (stableupload.dev)

## Notes

- **Step 1 & 2** use the Scrape Creators API via Orthogonal's x402 proxy — pass the full YouTube URL (e.g., `https://www.youtube.com/watch?v=abc123`) as the `videoUrl` query parameter.
- **Step 3** rewrites the raw transcript into a podcast-friendly script. You can customize the tone (e.g., "casual", "professional", "interview style") in the prompt.
- **Step 4** uses MiniMax's text-to-speech capability. The MiniMax platform supports voice synthesis — specify a voice style in the prompt for best results.
- **Step 5** uploads the final audio to stableupload.dev, which provides a hosted download URL you can share or embed.
- If the YouTube video has no auto-generated captions, the transcript endpoint may return empty — in that case, use the video description from Step 1 as fallback content for the script.
- For videos longer than ~30 minutes, consider chunking the transcript before sending to the AI rewriter to stay within context limits.
- MiniMax costs are capped at $0.10 per call on base-sepolia; mainnet pricing may differ.