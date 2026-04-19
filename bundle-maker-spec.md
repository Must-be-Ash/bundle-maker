 Plan: CDP embedded wallet + x402 pay-per-call in bundle-maker frontend                         
                                                                                                                     
 Context                                                                                                             
                                                                                                                     
 Today the bundle-maker frontend (app/components/BundleGenerator.tsx) calls                                          
 the paywalled POST /api/generate with a plain fetch. That endpoint is now
 gated at $0.01 USDC on Base mainnet (eip155:8453), so the browser always
 gets a 402 and the UI shows "Payment required". This plan wires a CDP
 embedded wallet into the page so end users can sign in, fund a wallet, and
 pay $0.01 USDC per generation — without leaving the app.

 We are porting the exact pattern proven in /Users/ashnouruzi/bob (which
 gates a $0.50 onboarding call the same way). Reusing that code path keeps
 risk low: the signer + EIP-712 quirks are already debugged there.

 End state:
 - Signed out → BundleGenerator renders an <AuthGate /> (sign-in CTA) instead
 of the textarea + Generate button.
 - Signed in with USDC ≥ $0.01 → click Generate → CDP signs EIP-712 →
 wrapFetchWithPayment pays inline → handler returns the bundle markdown.
 - Signed in but USDC < $0.01 → fund step shows the user's address + QR code
 with "Send USDC on Base" copy.

 ---
 What we're porting from /Users/ashnouruzi/bob

 ┌─────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────┐
 │                 Source file                 │                        What it gives us                         │
 ├─────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
 │ src/app/providers.tsx:1-37                  │ CDPReactProvider setup with theme overrides + createOnLogin:    │
 │                                             │ "eoa"                                                           │
 ├─────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
 │                                             │ The full hook: CDP signer adapter + bigIntToString +            │
 │ src/hooks/useFetchWithX402.ts:1-114         │ ensureEIP712Domain shims +                                      │
 │                                             │ wrapFetchWithPayment(globalThis.fetch, x402Client)              │
 ├─────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
 │ src/components/OnboardingWizard.tsx:58-111  │ Pay-per-call flow pattern: if (!fetchWithPayment) → wallet not  │
 │                                             │ ready, if (status === 402) rejection messaging, success path    │
 ├─────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
 │ src/components/OnboardingWizard.tsx:349-429 │ Fund step UI: address + copy + QR code + balance polling        │
 └─────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────┘

 useFetchWithX402.ts should be copied verbatim — the BigInt and EIP712Domain shims exist to work around real bugs in
  the CDP signEvmTypedData API. Don't simplify them.

 ---
 Implementation steps

 1. Install CDP packages

 npm install @coinbase/cdp-core @coinbase/cdp-react @coinbase/cdp-hooks qrcode.react
 (@x402/fetch, @x402/evm, viem are already in package.json.)

 2. Add env var

 - NEXT_PUBLIC_CDP_PROJECT_ID — copy from bob's .env.local. Set in
 bundle-maker/.env.local and Vercel.

 3. Create app/providers.tsx (new client component)

 Port bob/src/app/providers.tsx:1-37 with these adjustments:
 - appName: "Bundle Maker"
 - authMethods: ["email", "oauth:google"] (drop X / Solana to match user's
 selection)
 - Keep dark theme overrides — they already match bundle-maker's globals.css
 Geist Mono / #111111 background.
 - Drop solana: {}.

 4. Mount provider in app/layout.tsx:51-58

 Wrap <main> with <Providers>. Layout itself stays a server component;
 Providers is the client boundary.

 5. Create app/hooks/useFetchWithX402.ts

 Copy bob/src/hooks/useFetchWithX402.ts:1-114 verbatim. No edits — the
 network (eip155:8453), the BigInt shim, the EIP712Domain shim are all
 identical to what we need.

 6. Create app/components/AuthGate.tsx (new client component)

 Renders one of three states based on CDP hooks (useIsSignedIn,
 useCurrentUser):
 - Signed out: A single-card UI matching the existing GlowButton aesthetic
 with a primary CTA. Use CDP-provided sign-in components from
 @coinbase/cdp-react (research the exact export name — typical options are
 <AuthButton />, <SignInButton />, or composing with
 useSignInWithEmail / useSignInWithOAuth hooks). If the prebuilt
 components don't fit visually, build a button that triggers the CDP modal.
 - Signed in & balance check pending or sufficient: render children
 (i.e. the textarea + Generate button).
 - Signed in but insufficient balance: render <FundStep address={...} />.

 Component signature:
 <AuthGate requiredUsdc={0.01}>
   {/* textarea + Generate button */}
 </AuthGate>

 7. Create app/components/FundStep.tsx

 Port bob/src/components/OnboardingWizard.tsx:349-429. Shows:
 - The user's EOA address (truncated + copyable, full on tap)
 - A qrcode.react <QRCodeSVG /> of the address
 - "Send USDC on Base — at least $0.01 required" caption
 - "Sign out" link (uses useSignOut)
 - Auto-polls balance every 5s; once balance ≥ required, AuthGate flips back
 to render children.

 For balance reads, reuse the viem pattern from
 bob/src/components/NavWalletButton.tsx:23-49 — readContract USDC
 balanceOf(address) on Base mainnet (USDC contract
 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, 6 decimals). Build the
 publicClient once at module scope, like
 bob/src/hooks/useFetchWithX402.ts:10.

 8. Modify app/components/BundleGenerator.tsx

 - Wrap the textarea + GlowButton block in <AuthGate requiredUsdc={0.01}>.
 - Replace fetch("/api/generate", ...) with fetchWithPayment("/api/generate", ...)
 from useFetchWithX402().
 - Remove the current static "Payment required — pay with an x402-enabled
 client" branch — payment now happens automatically via CDP.
 - Keep the JSON parser (data.markdown) and copy-to-clipboard logic as is.
 - Add explicit handling: if fetchWithPayment is null (signer not ready)
 show "Wallet not ready, please wait."; if response.status === 402 after a
 paid call (race with empty balance), surface the facilitator reason from
 the body.

 9. Local + prod test (manual)

 - npm run dev → load http://localhost:3000.
 - Confirm: signed out shows AuthGate sign-in card; clicking sign-in opens
 CDP flow; after sign-in, see address truncated.
 - With < $0.01 USDC: confirm FundStep renders with QR + address; send a
 small amount of USDC; confirm it auto-flips to the textarea once balance
 arrives.
 - With ≥ $0.01 USDC: type "planning a vacation" → click Generate → confirm
 one EIP-712 sign prompt from CDP → bundle markdown renders → wallet
 balance drops $0.01 → BaseScan tx visible.
 - Confirm /.well-known/x402 and direct curl POST /api/generate still
 return 402 (paywall unaffected).

 10. Out of scope

 - No header/nav wallet button (per user's choice — AuthGate replaces the
 generator UI when signed out).
 - No Coinbase onramp widget (user picked address+QR funding).
 - No persisted history of generations.
 - No spend limits / per-session caps — single $0.01 per click is the limit
 surface. Revisit if abuse appears.

 ---
 Files touched

 ┌────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────┐
 │                Path                │                                  Action                                  │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ package.json                       │ + @coinbase/cdp-core, @coinbase/cdp-react, @coinbase/cdp-hooks,          │
 │                                    │ qrcode.react                                                             │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ .env.local (and Vercel)            │ + NEXT_PUBLIC_CDP_PROJECT_ID                                             │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ app/providers.tsx                  │ NEW — CDPReactProvider wrapper                                           │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ app/layout.tsx                     │ wrap <main> in <Providers>                                               │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ app/hooks/useFetchWithX402.ts      │ NEW — verbatim port from bob                                             │
 ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ app/components/AuthGate.tsx        │ NEW — gates children on auth + balance                                   │
     │                                                                                                            
     ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────
     ┤                                                                                                            
     │ package.json                       │ + @coinbase/cdp-core, @coinbase/cdp-react, @coinbase/cdp-hooks,       
     │                                                                                                            
     │                                    │ qrcode.react
     │
     ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────
     ┤
     │ .env.local (and Vercel)            │ + NEXT_PUBLIC_CDP_PROJECT_ID
     │                  
     ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────
     ┤                                           
     │ app/providers.tsx                  │ NEW — CDPReactProvider wrapper  
     │                 
     ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────
     ┤                                                               
     │ app/layout.tsx                     │ wrap <main> in <Providers>
     │                                                                  
     ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────
     ┤                                                                      
     │ app/hooks/useFetchWithX402.ts      │ NEW — verbatim port from bob                                             
     │
     ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────
     ┤
     │ app/components/AuthGate.tsx        │ NEW — gates children on auth + balance
     │                           
     ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────
     ┤                                       
     │ app/components/FundStep.tsx        │ NEW — address + QR + balance polling
     │                                                                                            
     ├────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────
     ┤
     │ app/components/BundleGenerator.tsx │ wrap UI in <AuthGate>, swap fetch → fetchWithPayment
     │
     └────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────
     ┘

     ---
     Verification (must all pass before considering done)

     1. npx tsc --noEmit clean.
     2. npm run build clean.
     3. Signed-out browser: AuthGate sign-in card visible; no textarea.
     4. CDP sign-in works (email OTP + Google OAuth).
     5. Wallet with 0 USDC: FundStep renders address + QR; balance poll triggers
     re-render once funded.
     6. Wallet with ≥ $0.01: Generate triggers exactly one EIP-712 sign; on
     success, markdown bundle renders; wallet balance decreases by $0.01;
     BaseScan tx visible.
     7. Direct curl POST /api/generate (no payment) still returns HTTP 402 —
     server-side paywall is unchanged.
     8. /.well-known/x402 still returns the resource list — discovery unchanged.