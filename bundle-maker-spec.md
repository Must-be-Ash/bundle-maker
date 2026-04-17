# Bundle Maker - Technical Specification

> A Next.js serverless app that takes a user's need description, searches x402 Bazaar and Orthogonal for relevant paid API endpoints, and generates a ready-to-use skill markdown bundle.

---

## Architecture Overview

- **Framework**: Next.js (App Router, serverless)
- **LLM**: Claude (Anthropic SDK, `@anthropic-ai/sdk`)
- **UI**: shadcn + Tailwind CSS
- **Deployment**: Vercel-ready (serverless functions)
- **Auth**: Server-side env vars only (no user auth)

---

## Checklist

### 1. Project Setup

- [x] Initialize Next.js project in `/Users/ashnouruzi/bundle-maker` with TypeScript, Tailwind CSS, App Router
- [x] Install dependencies: `@anthropic-ai/sdk`, `shadcn` components (button, input, textarea, card)
- [x] Set up `.env.local` with `ANTHROPIC_API_KEY` and `ORTHOGONAL_API_KEY`
- [x] Set up Tailwind with Coinbase design tokens (colors, fonts) matching the `/endpoints` project
- [x] Copy Coinbase fonts (Sans + Mono) from `/Users/ashnouruzi/endpoints/public/fonts/` into `public/fonts/`
- [x] Set up `globals.css` with the same CSS custom properties as `/endpoints` (--cb-blue, --cb-black, --cb-gray-*, etc.)

### 2. API Route: `POST /api/generate`

This is the core endpoint. It receives a user prompt and returns a skill markdown bundle.

- [x] Create `app/api/generate/route.ts`
- [x] Accept JSON body: `{ "prompt": string }` (e.g., "plan me a vacation")
- [x] **Step 1 - Search x402 Bazaar**: Call `GET https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query={prompt}&network=eip155:8453&limit=20` to find relevant x402 endpoints via semantic search. Parse `resources[]` from the response to extract: resource URL, top-level `description`, pricing (from `accepts` array), input/output schemas (from `metadata`). No auth needed. Note: this is `/discovery/search`, NOT `/discovery/resources` — the latter is a paginated browse endpoint that silently ignores `query`. `limit` is hard-capped at 20 server-side; fan out across multiple planned queries for better recall.
- [x] **Step 2 - Search Orthogonal**: Call `POST https://api.orthogonal.com/v1/search` with body `{ "prompt": "{prompt}", "limit": 10 }` and header `Authorization: Bearer {ORTHOGONAL_API_KEY}`. Parse results to extract: API name, endpoint path, description, pricing.
- [x] **Step 3 - Send to Claude**: Call Anthropic messages API with a system prompt that instructs Claude to:
  - Analyze the user's need
  - Review the discovered endpoints from both Bazaar and Orthogonal
  - Select the most relevant endpoints that work together to satisfy the need
  - Generate a skill markdown file in the exact format (see Skill Markdown Format below)
  - Include pricing per call for each endpoint
  - Include usage examples with curl and TypeScript (@x402/fetch)
  - Estimate total cost per run of the bundle
- [x] Return the generated markdown as `text/plain` response (content-type: text/plain)
- [x] Handle errors gracefully: if Bazaar returns empty, still use Orthogonal results (and vice versa). If both empty, return helpful message.
- [x] Add timeout handling (60s max for the full pipeline)

### 3. Skill Markdown Output Format

The generated markdown must follow this structure (matching `video-agent-skill.md` and `mock-bundles.ts` patterns):

```markdown
---
name: {bundle-slug}
description: {one-line description of what this bundle does}. Costs ~${estimated_cost} per run.
argument-hint: [{relevant-arguments}]
---

# {Bundle Name}

{2-3 sentence description of what this bundle does and when to use it.}

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~${cost}/run |
| Payment | USDC on Base via x402 / Orthogonal |
| Endpoints | {count} services |

## Steps

1. {Step description}
   {METHOD} {URL}
   Body: { ... }
   Cost: ${price}/call
   Source: x402 Bazaar | Orthogonal

2. {Step description}
   ...

## Usage with @x402/fetch (Node.js)

```typescript
// Example code showing how to call the bundled endpoints
```

## Usage with curl

```bash
# Example curl commands for each endpoint
```

## Notes

- {Important notes about the bundle}
```

### 4. Claude System Prompt

- [x] Create `app/lib/system-prompt.ts` containing the system prompt for Claude
- [x] The system prompt should:
  - Define Claude's role as an API bundle curator / skill creator
  - Explain the skill markdown format with examples
  - Instruct Claude to select only the most relevant endpoints (not dump everything)
  - Tell Claude to organize endpoints into logical steps (workflow order)
  - Instruct Claude to include accurate pricing from the search results
  - Tell Claude to generate working code examples (curl + TypeScript)
  - Instruct Claude to estimate total cost per run
  - Tell Claude to attribute each endpoint's source (x402 Bazaar or Orthogonal)
  - Include the full video-agent-skill.md as a reference example
  - Include a mock-bundles example (e.g., the recruiter-agent skillMd) as another reference

### 5. Frontend - Page Layout (`app/page.tsx`)

Single-page layout with two sections:

- [x] **Section 1: Featured Bundles (top)**
  - Port the `TrendingBundles` component from `/Users/ashnouruzi/endpoints/app/components/TrendingBundles.tsx`
  - Port the `BundleModal` component from `/Users/ashnouruzi/endpoints/app/components/BundleModal.tsx`
  - Port the `ModalShell` component from `/Users/ashnouruzi/endpoints/app/components/ModalShell.tsx`
  - Port the `FeaturedSection` component from `/Users/ashnouruzi/endpoints/app/components/FeaturedSection.tsx`
  - Port the mock data from `/Users/ashnouruzi/endpoints/app/lib/mock-bundles.ts`
  - Port logo utilities from `/Users/ashnouruzi/endpoints/app/lib/logos.ts`
  - Port any required logos from `/Users/ashnouruzi/endpoints/public/logos/`
  - Keep the exact same styling, animations, and behavior
  - Section heading: "Trending Bundles" (same as original)

- [x] **Section 2: Bundle Generator (bottom)**
  - Section heading: "Create Your Own Bundle"
  - Subheading: "Describe what you need and we'll find the right APIs for you"
  - shadcn `Input` or `Textarea` for the user's need description (placeholder: "e.g., Plan me a vacation, Help me hire developers, Create a marketing campaign...")
  - shadcn `Button` to submit (label: "Generate Bundle", loading state while processing)
  - Output area: a styled `<pre>` or `<textarea readonly>` block showing the generated skill markdown
  - Copy-to-clipboard button on the output area (top-right corner, like the BundleModal's copy button)
  - Show loading/spinner state while the API call is in progress
  - Error state if generation fails

### 6. Frontend Components

- [x] `app/components/BundleGenerator.tsx` — Client component with:
  - Text input (shadcn)
  - Submit button with loading state (shadcn)
  - Output text box (styled code block with monospace font)
  - Copy button (copies markdown to clipboard, shows "Copied!" feedback)
  - Calls `POST /api/generate` with the user's prompt
  - Displays the returned markdown in the output box

- [x] Port from `/endpoints` (copy and adapt as needed):
  - `app/components/TrendingBundles.tsx`
  - `app/components/BundleModal.tsx`
  - `app/components/ModalShell.tsx`
  - `app/components/FeaturedSection.tsx`
  - `app/lib/mock-bundles.ts`
  - `app/lib/logos.ts`
  - `lib/utils.ts` (cn utility)

### 7. Layout & Styling (`app/layout.tsx`)

- [x] Root layout with Coinbase fonts (Sans + Mono) — match `/endpoints` font setup
- [x] Metadata: title "Bundle Maker — x402 Skill Creator", description
- [x] Simple navbar with logo/title (no need to replicate the full endpoints navbar)
- [x] Footer with link to x402 docs

### 8. Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...         # Anthropic API key for Claude
ORTHOGONAL_API_KEY=orth_live_...     # Orthogonal API key for search
```

- [x] Create `.env.example` documenting required env vars
- [x] Add `.env.local` to `.gitignore`

### 9. Error Handling & Edge Cases

- [x] If Bazaar returns 0 results: still proceed with Orthogonal results only, note in output
- [x] If Orthogonal returns 0 results: still proceed with Bazaar results only, note in output
- [x] If both return 0 results: Claude should generate a helpful response explaining no endpoints were found and suggest refining the query
- [x] If Anthropic API fails: return 500 with user-friendly error message
- [x] If user submits empty prompt: client-side validation, disable submit
- [x] Rate limiting: not required for v1 (env-key gated)

### 10. File Structure

```
bundle-maker/
├── app/
│   ├── page.tsx                    # Main page (featured bundles + generator)
│   ├── layout.tsx                  # Root layout, fonts, metadata
│   ├── globals.css                 # Coinbase design tokens, Tailwind
│   ├── api/
│   │   └── generate/
│   │       └── route.ts            # POST /api/generate — core bundle generation
│   ├── components/
│   │   ├── BundleGenerator.tsx     # Input + output + copy button
│   │   ├── TrendingBundles.tsx     # Ported from /endpoints
│   │   ├── BundleModal.tsx         # Ported from /endpoints
│   │   ├── ModalShell.tsx          # Ported from /endpoints
│   │   └── FeaturedSection.tsx     # Ported from /endpoints
│   └── lib/
│       ├── system-prompt.ts        # Claude system prompt
│       ├── mock-bundles.ts         # Ported featured bundles data
│       └── logos.ts                # Ported logo utilities
├── components/
│   └── ui/                         # shadcn components (button, input, textarea, card)
├── lib/
│   └── utils.ts                    # cn() utility
├── public/
│   ├── fonts/                      # Coinbase Sans + Mono
│   └── logos/                      # Service logos
├── .env.example
├── .env.local                      # (gitignored)
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### 11. API Endpoint Details

#### `POST /api/generate`

**Request:**
```json
{
  "prompt": "plan me a vacation"
}
```

**Response (200):**
```
Content-Type: text/plain

---
name: vacation-planner
description: Search flights, hotels, weather, and car rentals to plan a complete trip. Costs ~$0.05 per run.
argument-hint: [destination, dates]
---

# Vacation Planner

...full skill markdown...
```

**Response (400):**
```json
{ "error": "Prompt is required" }
```

**Response (500):**
```json
{ "error": "Failed to generate bundle. Please try again." }
```

#### Internal API Call Flow

```
User prompt
    │
    ├──► Bazaar: GET https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query={prompt}&network=eip155:8453&limit=20
    │         Returns: resources[] with resource, description, accepts, metadata, partialResults
    │
    ├──► Orthogonal: POST https://api.orthogonal.com/v1/search
    │         Body: { "prompt": "{prompt}", "limit": 10 }
    │         Returns: results[] with api, path, description, pricing
    │
    └──► Claude: POST https://api.anthropic.com/v1/messages
              System: skill-creator prompt + reference examples
              User: "Need: {prompt}\n\nBazaar results: {bazaar_json}\n\nOrthogonal results: {orthogonal_json}"
              Returns: skill markdown string
```

### 12. Testing

- [ ] Manually test with diverse prompts: "plan a vacation", "hire developers", "create a facebook ad", "build a trading bot", "monitor my website"
- [ ] Verify the generated markdown follows the skill format
- [ ] Verify copy-to-clipboard works in the UI
- [ ] Verify the API endpoint works standalone (curl test)
- [ ] Verify graceful handling when Bazaar or Orthogonal return empty results

---

## Dependencies

```json
{
  "@anthropic-ai/sdk": "latest",
  "next": "latest",
  "react": "latest",
  "react-dom": "latest",
  "framer-motion": "latest",
  "lucide-react": "latest",
  "clsx": "latest",
  "tailwind-merge": "latest",
  "class-variance-authority": "latest"
}
```

shadcn components to install: `button`, `input`, `textarea`, `card`

---

## Notes

- The Bazaar discovery endpoint is **public** (no API key needed)
- Orthogonal requires an API key (`Authorization: Bearer {key}`)
- Both Bazaar and Orthogonal searches run **in parallel** for speed
- Claude receives the combined results and curates the final bundle
- The featured bundles section uses static data (ported from /endpoints) — in the future these will be agent-generated
- The output is plain markdown text, copyable with one click
