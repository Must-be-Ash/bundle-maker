# x402 Paywall — Technical Spec & Checklist

Pay-gate `POST /api/generate` at **$0.01 USDC** on **Base mainnet** (`eip155:8453`)
using the **CDP facilitator** and the x402 v2 `exact` scheme (EVM).

References:
- Transport spec: <https://github.com/coinbase/x402/blob/main/specs/transports-v2/http.md>
- Exact scheme (EVM): <https://github.com/coinbase/x402/blob/main/specs/schemes/exact/scheme_exact_evm.md>
- Exact scheme (general): <https://github.com/coinbase/x402/blob/main/specs/schemes/exact/scheme_exact.md>
- Working example (testnet): `/Users/ashnouruzi/basic-x402-endpoint`

---

## Decisions (locked from clarification round)

| Decision | Value |
| --- | --- |
| Routes paywalled | **Only** `POST /api/generate` |
| Price | `$0.01` (USDC) |
| Network | `eip155:8453` (Base mainnet) |
| Scheme | `exact` (EVM) |
| Facilitator | CDP (`@coinbase/x402` `facilitator`) |
| `payTo` | `process.env.EVM_ADDRESS` (already in `.env.local`) |
| Bazaar discovery | **Yes** — full input + output schema via `declareDiscoveryExtension` |
| Cache policy | Always pay-per-call (no caching) |
| Frontend changes | **None** — backend-only paywall (existing UI will need a paying client to call it) |
| Self-discovery | Add `/.well-known/x402` exposing `/api/generate` |
| Docs | README usage section with `curl` + `@x402/fetch` examples |
| Wrapper choice | `withX402FromHTTPServer` (charges only on `status < 400`, supports extensions) |

### Why `withX402FromHTTPServer` and not `paymentProxyFromHTTPServer`

The example uses `paymentProxyFromHTTPServer` in `proxy.ts`. Per the
`@x402/next` README, the proxy form **charges clients even on failed
responses**. For `POST /api/generate` — which calls Anthropic and can fail with
500s on Anthropic outages or 400s on missing prompts — we want
`withX402FromHTTPServer`, which only settles after a successful response.
We still get the bazaar extension because we wire it into the same
`x402HTTPResourceServer` instance.

### Input / output schemas (locked)

```jsonc
// input
{
  "type": "object",
  "properties": {
    "prompt": {
      "type": "string",
      "description": "Describe the bundle of x402 endpoints you want."
    }
  },
  "required": ["prompt"]
}

// output — markdown string
{
  "type": "string",
  "description": "Markdown-formatted bundle recommendation"
}
```

Output `mimeType`: `text/markdown` (current route returns `text/plain;
charset=utf-8` markdown — we will switch the `Content-Type` to
`text/markdown; charset=utf-8` so it matches what bazaar advertises).

---

## Checklist

### 1. Dependencies & env

- [x] Install x402 packages into `bundle-maker`:
  ```
  npm install @coinbase/x402 @x402/core @x402/evm @x402/extensions @x402/next viem
  ```
  (Installed: `@coinbase/x402@^2.1.0`, `@x402/core@^2.10.0`,
  `@x402/evm@^2.10.0`, `@x402/extensions@~2.6.0`, `@x402/next@^2.10.0`,
  `viem@^2.48.1` — newer than the example but compatible.)
- [x] Verify `.env.local` already has:
  - `CDP_API_KEY_ID` ✅ (present)
  - `CDP_API_KEY_SECRET` ✅ (present)
  - `EVM_ADDRESS` ✅ (present — used as `payTo`)
- [x] Confirm `EVM_ADDRESS` is a **mainnet-controllable** EOA / smart-wallet you
      actually own. **Real USDC will land here.** *(User-asserted at spec time.)*
- [ ] Add fallback safety: in the proxy/server file, throw at module load if
      `EVM_ADDRESS` is missing (don't silently default to `0x0…`).
      *(Deferred to §3 — the file doesn't exist yet.)*

### 2. Refactor `app/api/generate/route.ts`

- [x] Extract the existing handler body into a function that takes a
      `NextRequest` and returns `NextResponse`. All existing logic preserved
      (planner, bazaar/orthogonal/well-known fan-out, Anthropic call).
      `export const POST = handler;` — to be wrapped in §4.
- [x] Response uses `new NextResponse(markdown, { status: 200, headers: {
      "Content-Type": "text/markdown; charset=utf-8" } })`.
- [x] 400 (missing prompt) and 500 (generation failed) branches return
      `NextResponse.json(...)` — `withX402` will not settle on these.
- [x] `tsc --noEmit` passes.

### 3. Wire x402 server (new file: `app/api/generate/x402.ts`)

- [x] Created `app/api/generate/x402.ts` exporting `httpServer`
      (`x402HTTPResourceServer`) for `/api/generate`. Includes fail-fast
      throw when `EVM_ADDRESS` is missing. Uses `bodyType: "json"` for the
      bazaar discovery extension (POST + JSON body). `tsc --noEmit` passes.

      Original sub-checklist (kept for reference):
  - `HTTPFacilitatorClient(cdpFacilitator)` from `@coinbase/x402`
  - `x402ResourceServer(facilitatorClient).register("eip155:8453", new ExactEvmScheme()).registerExtension(bazaarResourceServerExtension)`
  - Routes config:
    ```ts
    {
      "/api/generate": {
        accepts: [{
          scheme: "exact",
          price: "$0.01",
          network: "eip155:8453",
          payTo: process.env.EVM_ADDRESS!,
          maxTimeoutSeconds: 120, // generate can take ~30s+
        }],
        description: "Generate a curated bundle of x402 endpoints from a natural-language prompt.",
        mimeType: "text/markdown",
        extensions: {
          ...declareDiscoveryExtension({
            input: {
              schema: {
                type: "object",
                properties: {
                  prompt: { type: "string", description: "Describe the bundle you want." }
                },
                required: ["prompt"],
              },
              example: { prompt: "Plan me a vacation to Tokyo" },
            },
            output: {
              schema: { type: "string", description: "Markdown bundle recommendation" },
              example: "# Tokyo trip bundle\n- ...",
            },
          }),
        },
      },
    }
    ```
  - `new x402HTTPResourceServer(resourceServer, routes)`
- [ ] Module must be safe to import from `route.ts` (no top-level network IO).

### 4. Apply `withX402FromHTTPServer` to the route

- [x] `app/api/generate/route.ts:338` —
      `export const POST = withX402FromHTTPServer(handler, httpServer);`
- [x] Confirmed `withX402FromHTTPServer` is method-agnostic (signature in
      `node_modules/@x402/next/dist/esm/index.d.ts:196` takes any handler with
      `(NextRequest) => Promise<NextResponse>` regardless of HTTP verb).
- [x] `tsc --noEmit` passes.

      Original sub-checklist (kept for reference):
  ```ts
  import { withX402FromHTTPServer } from "@x402/next";
  import { httpServer } from "./x402";

  async function handler(req: NextRequest): Promise<NextResponse<string>> { /* existing logic */ }

  export const POST = withX402FromHTTPServer(handler, httpServer);
  ```
- [ ] Confirm `POST` is supported (the README's examples show `GET`, but
      `withX402` is method-agnostic — verify by inspecting
      `node_modules/@x402/next/dist/esm/index.d.ts` after install; if it
      only branches on method internally, we may need `paymentProxyFromHTTPServer`
      in `proxy.ts` as a fallback).

### 5. `/.well-known/x402` self-discovery

- [x] Created `app/.well-known/x402/route.ts`. Live test against running dev
      server returned `200 OK` with `Content-Type: application/json` and body
      `{"version":2,"description":"bundle-maker — generates curated x402 bundles","resources":["http://localhost:3000/api/generate"]}`.
- [x] Origin derives from `NEXT_PUBLIC_SITE_URL` if set (trailing slash
      stripped), otherwise from the inbound request URL — both yield absolute
      URLs.
- [x] No payment required (only `GET` exported, not wrapped with x402).

      Original sub-checklist (kept for reference):
  ```json
  {
    "version": 2,
    "description": "bundle-maker — generates curated x402 bundles",
    "resources": ["https://<your-prod-host>/api/generate"]
  }
  ```
- [ ] Resource URL must be **absolute**. Derive from `process.env.NEXT_PUBLIC_SITE_URL`
      (add this env var) or from the request `host` header at runtime.
- [ ] Set `Content-Type: application/json`.
- [ ] No payment required on this route (it's discovery metadata).

### 6. Validation — no real money yet

- [x] `npm run build` — clean. Route table shows
      `ƒ /.well-known/x402` and `ƒ /api/generate`.
- [x] `POST /api/generate` without payment → **HTTP 402**. Decoded
      `payment-required` header:
      - `scheme: exact` ✅
      - `network: eip155:8453` ✅
      - `amount: 10000` (= 0.01 USDC; USDC has 6 decimals) ✅
      - `asset: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` (official USDC on
        Base mainnet) ✅
      - `payTo: 0xAbF01df9428EaD5418473A7c91244826A3Af23b3` (matches
        `EVM_ADDRESS`) ✅
      - `maxTimeoutSeconds: 120` ✅
      - Bazaar extension carries full input + output JSON schema with
        `bodyType: "json"` and `method: "POST"` ✅
- [x] `GET /.well-known/x402` → 200 with
      `Content-Type: application/json` and absolute resource URL.
- [x] Empty-body POST also returns 402 (paywall intercepts before handler
      runs). Settlement-on-failure protection comes from the
      `withX402FromHTTPServer` contract (`status < 400` gate); fully E2E
      verifying it requires §7's real-money test.

### 7. End-to-end mainnet test ($0.01 of real money)

- [ ] Use `@x402/fetch` from a script (Node, with a viem account holding ≥ $0.02
      USDC on Base) to call `POST /api/generate` with a real prompt.
- [ ] Confirm a successful 200 markdown response.
- [ ] Confirm the on-chain transfer of 0.01 USDC to `EVM_ADDRESS` on Base
      (BaseScan).
- [ ] Confirm in the CDP dashboard that the `/api/generate` resource is
      indexed in the Bazaar (status `awaiting_first_payment` → `indexed`
      after first settle).

### 8. README usage section

- [ ] Append a "Calling the paid endpoint" section to `README.md` covering:
  - **`curl` flow** — first call returns 402 with payment requirements; client
    constructs `X-PAYMENT` header per
    <https://github.com/coinbase/x402/blob/main/specs/transports-v2/http.md>
    and retries.
  - **`@x402/fetch` snippet** —
    ```ts
    import { wrapFetchWithPayment } from "@x402/fetch";
    import { privateKeyToAccount } from "viem/accounts";
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
    const fetchWithPay = wrapFetchWithPayment(fetch, account);
    const res = await fetchWithPay("https://<host>/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Plan a trip to Tokyo" }),
    });
    ```
  - Note that price is **$0.01 USDC on Base mainnet** — real funds, not testnet.
  - Link to `/.well-known/x402` for discovery.
- [ ] Append a "Frontend gap" note: the existing `app/page.tsx` UI calls
      `/api/generate` with plain `fetch` and **will start receiving 402s**.
      Mark wiring an in-browser paying client as a follow-up task (out of scope
      for this spec).

### 9. Frontend non-goal (explicit)

- [ ] Do **not** modify `app/page.tsx` or any UI code. The browser fetch will
      now fail with 402 — this is intentional per the answered clarification.
      Add a follow-up issue/note: "wire CDP embedded wallet + `@x402/fetch` into
      the bundle-maker UI" so the form keeps working for end users.

### 10. Cleanup & deploy

- [ ] Add `NEXT_PUBLIC_SITE_URL` (or equivalent) to deployment env (Vercel etc).
- [ ] Verify `CDP_API_KEY_ID`, `CDP_API_KEY_SECRET`, `EVM_ADDRESS` are set in
      production env.
- [ ] Deploy and re-run §6 + §7 checks against the production URL.

---

## Risks / things to watch

- **Mainnet = real money.** Every successful call settles 0.01 USDC. Unbounded
  /spammed traffic = real cost to clients (and a real revenue stream to you).
  Consider adding rate limiting at a future date.
- **Anthropic latency.** `maxTimeoutSeconds: 120` accommodates Anthropic
  delays; the existing route uses a 55s `AbortController`. Keep that timeout
  ≤ `maxTimeoutSeconds` so we never charge for a request the server already
  abandoned.
- **POST + `withX402`.** Verify post-install that `withX402FromHTTPServer`
  intercepts POSTs (it should — the README only happens to use GET examples).
  If it doesn't, fall back to `paymentProxyFromHTTPServer` in `proxy.ts` and
  accept that failed requests will be charged (or add `if (path === "/api/generate" && method !== "POST") next()` logic).
- **Browser CORS / preflight.** If anyone calls from a browser cross-origin,
  the OPTIONS preflight must not be paywalled. `withX402` only wraps `POST` so
  this is fine, but if we ever switch to `paymentProxy*`, add an OPTIONS
  bypass.
- **`mimeType` mismatch.** Bazaar advertises `text/markdown` — make sure the
  route actually sets that `Content-Type` (currently it sends
  `text/plain; charset=utf-8`).
