# Bazaar Search Guide

This guide shows how to search the x402 Bazaar in a way that actually returns useful results for a topic or user ask.

## Endpoint

Use the CDP Bazaar discovery endpoint:

```bash
https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources
```

Core request shape:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=<YOUR_QUERY>&network=eip155:8453&limit=100"
```

Notes:
- Always quote the URL in `zsh` (`?` and `&` are special characters).
- `query` enables semantic search.
- `network` and other params are filters.
- `limit` controls how many items you inspect per request.

---

## The Search Strategy (What Works)

Use a 2-stage approach:

1. **Semantic retrieval:** ask the Bazaar for conceptually related results.
2. **Client-side precision filter:** remove noisy matches with `jq`.

Semantic search alone is broad by design. You get better quality if you add local filtering for your exact intent.

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
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=travel+booking+flights+hotels+itinerary+trip+planning&network=eip155:8453&limit=100"
```

---

## 2) Add Server-Side Filters

Useful query params from docs:
- `network`
- `asset`
- `scheme`
- `payTo`
- `maxUsdPrice`
- `extensions`
- `limit`
- `offset`

Example:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=trading+market+data&network=eip155:8453&scheme=exact&maxUsdPrice=0.05&limit=100"
```

---

## 3) Apply A Strict Topic Filter With jq

Filter by keywords in URL + descriptions to keep only clearly relevant endpoints.

### Travel-focused filter

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=travel+booking+flights+hotels+itinerary+trip+planning&network=eip155:8453&limit=100" \
| jq -r '
  .items[]
  | select(
      (
        (.resource // "") + " " +
        (.accepts[0].description // "") + " " +
        (.metadata.description // "")
      )
      | test("travel|trip|flight|hotel|itinerary|vacation|tour|booking"; "i")
    )
  | .resource
'
```

### Trading-focused filter

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=trading+token+swap+dex+market+data&network=eip155:8453&limit=100" \
| jq -r '
  .items[]
  | select(
      (
        (.resource // "") + " " +
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

Check quickly:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=travel&network=eip155:8453&limit=100" \
| jq '{returned:(.items|length), versions:([.items[].x402Version]|unique)}'
```

Count matches for your strict filter:

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=travel&network=eip155:8453&limit=100" \
| jq '[.items[] | select((((.resource // "") + " " + (.accepts[0].description // "") + " " + (.metadata.description // "")) | test("travel|trip|flight|hotel|itinerary|vacation|tour|booking"; "i")))] | length'
```

---

## 5) Understand x402Version Correctly

In response payloads, you may see:
- top-level `x402Version: 2` (response/protocol wrapper),
- while each resource item can still be `x402Version: 1`.

So filtering with `.items[] | select(.x402Version == 2)` may legitimately return nothing for many queries.

---

## 6) Multi-Query Workflow For Better Recall

Run multiple semantically close queries and merge results:

1. Choose 3-5 query variants around the same ask.
2. Fetch each with `limit=100`.
3. Concatenate items.
4. Deduplicate by `resource`.
5. Apply strict topic filter.
6. Rank manually by description quality + pricing fit.

Suggested pattern:
- Query A = broad intent
- Query B = user language
- Query C = domain jargon
- Query D = specific action verb

---

## 7) A Practical Checklist Per User Ask

When a user says "find me X on Bazaar":

1. Rewrite ask into 2-3 intent-rich query strings.
2. Pull 100 results each from Bazaar.
3. Add server-side constraints (`network`, `scheme`, `maxUsdPrice`) when known.
4. Apply strict local keyword filter for the ask.
5. Return:
   - relevant resource URLs,
   - short description,
   - network/asset/price fields from `accepts`.
6. If poor results:
   - broaden query vocabulary,
   - loosen strict regex,
   - rerun and compare.

---

## Quick Templates

### Generic semantic search

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=<TOPIC_WORDS>&network=eip155:8453&limit=100" | jq
```

### Just list resource URLs

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=<TOPIC_WORDS>&network=eip155:8453&limit=100" \
| jq -r '.items[].resource'
```

### Show URL + description + first payment option

```bash
curl -s "https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources?query=<TOPIC_WORDS>&network=eip155:8453&limit=100" \
| jq -r '.items[] | {resource, desc: (.accepts[0].description // .metadata.description // "n/a"), payment: .accepts[0]}'
```

