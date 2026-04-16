---
name: crypto-trading-bot
description: Monitor crypto prices, compute technical indicators, scan social sentiment, and execute on-chain token swaps. Costs ~$0.17 USDC per run.
argument-hint: [token-symbol, trade-amount-usdc, price-alert-threshold]
---

# Crypto Trading Bot

A full-stack crypto trading bot pipeline that fetches real-time and historical price data from multiple sources, computes technical indicators (RSI, MACD, Bollinger Bands), monitors social sentiment and trending tokens, checks funding rates, and executes token swaps on-chain via DEX integrations. Use this when you want an autonomous agent loop that monitors markets and acts on signals.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.17/run |
| Payment | USDC on Base |
| Endpoints | 13 services |

## Steps

### Phase 1 — Price Data Collection

1. **Fetch real-time Binance price data**
   GET `https://x402.orth.sh/dome/crypto-prices/binance`
   Query params: `?currency=btcusdt` (or `ethusdt`, `solusdt`, etc.)
   Cost: ~$0.01/call
   Source: Orthogonal (Dome API)

2. **Fetch Chainlink oracle price (on-chain verified)**
   GET `https://x402.orth.sh/dome/crypto-prices/chainlink`
   Query params: `?currency=btc/usd`
   Cost: ~$0.01/call
   Source: Orthogonal (Dome API)

3. **Fetch CoinGecko market data (price, volume, market cap)**
   POST `https://api-staging.intra-tls2.dctx.link/x402/agent/qrn:agent:68f59a6a93d1a55ee56c7d3b`
   Body: `{ "input": "Get current price, 24h volume, market cap, and 7-day trend for BTC, ETH, SOL" }`
   Cost: ~$0.10/call
   Source: x402 Bazaar (Questflow / CoinGecko agent)

### Phase 2 — Technical Analysis

4. **Compute technical indicators (RSI, MACD, Bollinger Bands, EMAs)**
   POST `https://mesh.heurist.xyz/x402/agents/YahooFinanceAgent/indicator_snapshot`
   Body:
   ```json
   {
     "symbol": "BTC-USD",
     "interval": "1d",
     "period": "6mo",
     "debug": false
   }
   ```
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

5. **Get funding rates for perpetuals (BTC, ETH, SOL, BNB, XRP)**
   POST `https://mesh.heurist.xyz/x402/agents/FundingRateAgent/get_all_funding_rates`
   Body: `{ "debug": false }`
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

6. **Get funding rate arbitrage signals**
   POST `https://evplus-funding-server.onrender.com/api/x402/signals/current`
   Cost: $0.10/call
   Source: x402 Bazaar

### Phase 3 — Social Sentiment & Trend Scanning

7. **Get trending tokens on Twitter right now**
   POST `https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/get_trending_tokens`
   Body: `{ "time_window": "24h", "debug": false }`
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

8. **Search Twitter mentions for specific token**
   POST `https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions`
   Body:
   ```json
   {
     "keywords": ["BTC", "bitcoin"],
     "days_ago": 1,
     "limit": 20,
     "debug": false
   }
   ```
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

9. **Get trending tokens across CEXs and DEXs**
   POST `https://mesh.heurist.xyz/x402/agents/TrendingTokenAgent/get_trending_tokens`
   Body: `{ "include_memes": false, "debug": false }`
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

10. **Search crypto project fundamentals (news, signals, social activity)**
    POST `https://mesh.heurist.xyz/x402/agents/AIXBTProjectInfoAgent/search_projects`
    Body:
    ```json
    {
      "ticker": "BTC",
      "minScore": 0.2,
      "limit": 5,
      "debug": false
    }
    ```
    Cost: $0.01/call
    Source: x402 Bazaar (Heurist)

### Phase 4 — Portfolio Monitoring

11. **Check current wallet token holdings and PnL**
    POST `https://mesh.heurist.xyz/x402/agents/ZerionWalletAnalysisAgent/fetch_wallet_tokens`
    Body: `{ "wallet_address": "{your_wallet_address}", "debug": false }`
    Cost: $0.01/call
    Source: x402 Bazaar (Heurist)

12. **Analyze Base wallet DEX trading history and PnL (last 30 days)**
    POST `https://mesh.heurist.xyz/x402/agents/PondWalletAnalysisAgent/analyze_base_wallet`
    Body: `{ "address": "{your_wallet_address}", "debug": false }`
    Cost: $0.01/call
    Source: x402 Bazaar (Heurist)

### Phase 5 — Trade Execution

13. **Execute on-chain token swap via DEX (custom USDC amount)**
    POST `https://dev.x420.dev/api/puff-custom`
    Body:
    ```json
    {
      "amount": "10"
    }
    ```
    Cost: up to $5.00 USDC (trade amount) + service fee
    Source: x402 Bazaar (x420.dev DEX swap)

## Notes

- **Price sources**: Use both Binance (step 1) and Chainlink (step 2) to cross-verify prices before trading — divergence may signal manipulation or latency issues.
- **Technical signals**: The `indicator_snapshot` endpoint (step 4) returns a pre-computed `buy/sell/neutral` signal with confidence level — use this as a primary trigger condition.
- **Funding rates**: Positive funding rates (step 5) indicate bullish perp market; large positive rates can signal overheated longs and potential reversal.
- **Arbitrage signals**: Step 6 provides ready-made funding rate arbitrage entry/exit levels — useful for delta-neutral strategies.
- **Trade execution**: Step 13 executes a real on-chain swap on Base. Always test with small amounts first. The `amount` field is in USDC (e.g., `"0.5"` = $0.50 trade).
- **CoinGecko agent** (step 3) and the **Web3 Trader swarms** are on `base-sepolia` — suitable for testnet dry runs before going live on mainnet.
- **Cost estimate** assumes one call per step for price monitoring; actual costs scale with polling frequency. Running every 5 minutes = ~$49/day.
- The Dome API endpoints (steps 1–2) are unverified on Orthogonal — test before relying on them in production.