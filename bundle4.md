---
name: crypto-trading-bot
description: Monitor crypto prices, analyze technical indicators, gauge social sentiment, and execute on-chain trades. Costs ~$0.17 USDC per run.
argument-hint: [symbol, interval, chain, trade-amount]
---

# Crypto Trading Bot

A complete pipeline for building an autonomous crypto trading bot: fetch real-time and historical price data from multiple sources, compute technical indicators with buy/sell signals, monitor social sentiment and funding rates, discover trending tokens, and execute on-chain token swaps. Use this bundle to power signal-driven or sentiment-driven trading strategies.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.17/run |
| Payment | USDC on Base |
| Endpoints | 13 services |

## Steps

### Phase 1: Price Data Collection

1. Fetch real-time crypto price from Binance (e.g. `btcusdt`, `ethusdt`)
   `GET https://x402.orth.sh/dome/crypto-prices/binance?currency={symbol}&from={timestamp}&to={timestamp}`
   Cost: USDC/call (Dome API)
   Source: Orthogonal

2. Fetch corroborating price data from Chainlink oracle (e.g. `btc/usd`, `eth/usd`)
   `GET https://x402.orth.sh/dome/crypto-prices/chainlink?currency={symbol}`
   Cost: USDC/call (Dome API)
   Source: Orthogonal

3. Get comprehensive market data — price, market cap, volume, DeFi pool data, trending coins
   `POST https://api-staging.intra-tls2.dctx.link/x402/agent/qrn:agent:68f59a6a93d1a55ee56c7d3b`
   Body: `{ "input": "Get current price, 24h change, volume and market cap for {symbol}" }`
   Cost: $0.10/call (max)
   Source: x402 Bazaar

4. Get Alpha Vantage stock & crypto data — historical OHLCV, forex, fundamentals
   `POST https://api-dev.intra-tls2.dctx.link/x402/agent/qrn:agent:68dba0e582f61ca4a1686963`
   Body: `{ "input": "Fetch daily OHLCV data for {symbol} for the past 90 days" }`
   Cost: $0.10/call (max)
   Source: x402 Bazaar

### Phase 2: Technical Analysis

5. Compute technical indicators and get trading signal (RSI, MACD, Bollinger Bands, EMAs)
   `POST https://mesh.heurist.xyz/x402/agents/YahooFinanceAgent/indicator_snapshot`
   Body: `{ "symbol": "{symbol}-USD", "interval": "1d", "period": "6mo", "debug": false }`
   Cost: $0.01/call
   Source: x402 Bazaar

6. Get current funding rates for BTC, ETH, SOL, BNB, XRP perpetuals on Binance
   `POST https://mesh.heurist.xyz/x402/agents/FundingRateAgent/get_all_funding_rates`
   Body: `{ "debug": false }`
   Cost: $0.01/call
   Source: x402 Bazaar

7. Get best funding rate arbitrage opportunities with entry/exit levels
   `POST https://evplus-funding-server.onrender.com/api/x402/signals/current`
   Cost: $0.10/call (max)
   Source: x402 Bazaar

### Phase 3: Sentiment & Trend Analysis

8. Get currently trending tokens on Twitter (social buzz indicator)
   `POST https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/get_trending_tokens`
   Body: `{ "time_window": "24h", "debug": false }`
   Cost: $0.01/call
   Source: x402 Bazaar

9. Search influential Twitter mentions for specific tokens
   `POST https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions`
   Body: `{ "keywords": ["{symbol}", "crypto", "trading"], "days_ago": 3, "limit": 20, "debug": false }`
   Cost: $0.01/call
   Source: x402 Bazaar

10. Get trending tokens across CEXs and DEXs (cross-chain)
    `POST https://mesh.heurist.xyz/x402/agents/TrendingTokenAgent/get_trending_tokens`
    Body: `{ "chain": "{chain}", "include_memes": false, "debug": false }`
    Cost: $0.01/call
    Source: x402 Bazaar

11. Research project fundamentals, team, and recent signals
    `POST https://mesh.heurist.xyz/x402/agents/AIXBTProjectInfoAgent/search_projects`
    Body: `{ "ticker": "{symbol}", "minScore": 0.2, "limit": 5, "debug": false }`
    Cost: $0.01/call
    Source: x402 Bazaar

### Phase 4: On-Chain Analysis

12. Analyze wallet trading PnL and DEX frequency on Base (smart money tracking)
    `POST https://mesh.heurist.xyz/x402/agents/PondWalletAnalysisAgent/analyze_base_wallet`
    Body: `{ "address": "{wallet_address}", "debug": false }`
    Cost: $0.01/call
    Source: x402 Bazaar

### Phase 5: Trade Execution

13. Execute on-chain token swap (buy custom USDC amount of target token via DEX on Base)
    `POST https://dev.x420.dev/api/puff-custom`
    Body: `{ "amount": "{usdc_amount}" }`
    Cost: Up to $5.00/call (covers swap amount, max $5 USDC per call)
    Source: x402 Bazaar

## Notes

- **Price sources**: Steps 1 (Binance) and 2 (Chainlink) provide independent price feeds — use both for cross-validation before trading.
- **Technical signal**: Step 5 returns a rule-based `buy/sell/neutral` action with confidence level and rationale — this is your primary signal trigger.
- **Funding rates**: Steps 6 and 7 are essential for perpetual/futures arbitrage strategies; positive funding = crowded longs = bearish signal.
- **Sentiment loop**: Run Steps 8–10 on each cycle to catch social momentum shifts before they appear in price data.
- **Trade execution**: Step 13 executes swaps on Base mainnet via DEX. Start with small amounts and validate your signal logic thoroughly before increasing position sizes.
- **Cost estimate** of ~$0.17 covers data + analysis steps only; trade execution cost scales with your swap amount (not included in base estimate).
- **Snipr swarm** (`https://api.questflow.ai/x402/swarm/qrn:swarm:688a23cbc6520a7b2678f77a`) is an optional add-on for early low-FDV token discovery on Base/BNB/Solana with whale detection and contract safety scanning ($0.50/call).
- All Heurist mesh endpoints (`mesh.heurist.xyz`) operate on Base mainnet USDC. Questflow agents on `base-sepolia` require testnet USDC — swap to mainnet equivalents for production use.