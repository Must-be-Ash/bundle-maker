# Bazaar Search Guide

This guide shows how to semantically search the x402 Bazaar to find endpoints that match a user's intent.

## Endpoint

Use the CDP Bazaar **search** endpoint. This is distinct from `/discovery/resources` — that one is a paginated browse (newest-first) and **silently ignores `query` and `network`**. For semantic search you must hit:

```
https://api.cdp.coinbase.com/platform/v2/x402/discovery/search
```

Core request shape:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=<YOUR_QUERY>&network=eip155:8453&limit=20"
```

Notes:

- Always quote the URL in `zsh` (`?` and `&` are special characters).
- `query` is vector-matched against resource descriptions, so meaning beats exact keywords.
- `limit` is hard-capped at **20** server-side. Larger values are silently clamped.
- There is no `offset` — this endpoint is top-K, not paginated. Use multiple queries for wider recall.
- Results are ranked by semantic relevance blended with quality signals (usage, description richness, domain trust).

### Response shape

Different from `/discovery/resources`. No `items`, no `pagination`:

```json
{
  "resources": [
    {
      "resource": "https://weather.hugen.tokyo/weather/current",
      "type": "http",
      "x402Version": 2,
      "description": "Instant weather by city name …",
      "accepts": [ { "scheme": "exact", "network": "eip155:8453", "amount": "5000", "asset": "0x…", "payTo": "0x…" } ],
      "lastUpdated": "2026-04-12T22:57:08.982Z"
    }
  ],
  "partialResults": true
}
```

`description` lives at the top level of each resource (not under `metadata` as in the browse endpoint). `partialResults: true` means the search is still warming — rerun if recall feels low.

---

## The Search Strategy (What Works)

Use a 2-stage approach:

1. **Semantic retrieval:** fan out 3–6 intent-rich queries to the search endpoint.
2. **Client-side precision filter:** dedupe on `resource` and optionally tighten with a keyword regex.

Semantic search is broad by design. Single-query recall is capped at 20, so fan-out + dedup is the highest-leverage move.

---

## 1) Start With A Good Query

Use intent-rich phrases, not one vague word.

Instead of:

- `travel`

Try:

- `travel booking flights hotels itinerary trip planning`
- `trading token swap dex market data portfolio`
- `news summarization sentiment analysis crypto`

Example:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=travel+booking+flights+hotels+itinerary+trip+planning&network=eip155:8453&limit=20"
```

---

## 2) Supported Filter Params

Query params accepted by `/discovery/search`:

- `query` — free-text semantic query
- `network` — e.g. `eip155:8453` (Base mainnet), `eip155:84532` (Base Sepolia)
- `asset` — payment asset contract address
- `scheme` — e.g. `exact`
- `payTo` — merchant wallet address
- `maxUsdPrice` — e.g. `0.05`
- `extensions` — e.g. `bazaar`
- `limit` — max 20

Example with filters:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=trading+market+data&network=eip155:8453&scheme=exact&maxUsdPrice=0.05&limit=20"
```

---

## 3) Optional: Apply A Strict Topic Filter With jq

Semantic search casts a wide net. If you want to post-filter by keywords on URL + description:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=travel+booking+flights+hotels+itinerary+trip+planning&network=eip155:8453&limit=20" \
| jq -r '
  .resources[]
  | select(
      (
        (.resource // "") + " " +
        (.description // "") + " " +
        (.accepts[0].description // "") + " " +
        (.metadata.description // "")
      )
      | test("travel|trip|flight|hotel|itinerary|vacation|tour|booking"; "i")
    )
  | .resource
'
```

Trading variant:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=trading+token+swap+dex+market+data&network=eip155:8453&limit=20" \
| jq -r '
  .resources[]
  | select(
      (
        (.resource // "") + " " +
        (.description // "") + " " +
        (.accepts[0].description // "") + " " +
        (.metadata.description // "")
      )
      | test("trade|trading|swap|token|dex|price|market|portfolio|crypto"; "i")
    )
  | .resource
'
```

---

## 4) Debug Why "Nothing Happened"

If `jq` prints nothing, it usually means **0 matches**, not a shell failure.

Count what came back:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=travel&network=eip155:8453&limit=20" \
| jq '{returned:(.resources|length), partial:.partialResults}'
```

Count matches for a strict filter:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=travel&network=eip155:8453&limit=20" \
| jq '[.resources[] | select((((.resource // "") + " " + (.description // "") + " " + (.accepts[0].description // "") + " " + (.metadata.description // "")) | test("travel|trip|flight|hotel|itinerary|vacation|tour|booking"; "i")))] | length'
```

---

## 5) Multi-Query Workflow For Better Recall

Because `limit` is capped at 20 and there's no `offset`, fan-out is the only way to expand coverage:

1. Plan 3–6 query variants around the same intent (broad, user language, domain jargon, action verb).
2. Fetch each at `limit=20` in parallel.
3. Concatenate `resources`.
4. Deduplicate by `resource`.
5. Optionally apply a strict keyword filter.
6. Rank by description richness + pricing fit.

Suggested pattern:

- Query A = broad intent
- Query B = user's own language
- Query C = domain jargon
- Query D = specific action verb

---

## 6) A Practical Checklist Per User Ask

When a user says "find me X on Bazaar":

1. Rewrite the ask into 3–6 intent-rich query strings.
2. Fan out to `/discovery/search` in parallel, `limit=20` each.
3. Add server-side constraints (`network`, `scheme`, `maxUsdPrice`, `extensions`) when known.
4. Dedupe on `resource`.
5. Optionally apply a strict local keyword filter.
6. Return: resource URLs, `description`, network/asset/price fields from `accepts[0]`.
7. If recall is poor: broaden query vocabulary, loosen the regex, rerun.

---

## Quick Templates

### Generic semantic search

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=<TOPIC_WORDS>&network=eip155:8453&limit=20" | jq
```

### Just list resource URLs

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=<TOPIC_WORDS>&network=eip155:8453&limit=20" \
| jq -r '.resources[].resource'
```

### Show URL + description + first payment option

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/search?query=<TOPIC_WORDS>&network=eip155:8453&limit=20" \
| jq -r '.resources[] | {resource, desc: (.description // .accepts[0].description // .metadata.description // "n/a"), payment: .accepts[0]}'
```
