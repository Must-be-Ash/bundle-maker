export const skillMd = `---
name: crypto-trading-bot
description: Monitor crypto prices, analyze technical indicators, gauge social sentiment, and execute on-chain trades. Costs ~$0.17 USDC per run.
argument-hint: [symbol, interval, chain, trade-amount]
---

# Crypto Trading Bot

A complete pipeline for building an autonomous crypto trading bot: fetch real-time and historical price data, compute technical indicators, monitor social sentiment, discover trending tokens, and execute on-chain swaps.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.17/run |
| Payment | USDC on Base |
| Endpoints | 13 services |

## Steps

### Phase 1: Price Data

1. Fetch real-time price from Binance
   GET https://x402.orth.sh/dome/crypto-prices/binance?currency={symbol}
   Cost: USDC/call
   Source: Orthogonal

2. Fetch corroborating price from Chainlink oracle
   GET https://x402.orth.sh/dome/crypto-prices/chainlink?currency={symbol}
   Cost: USDC/call
   Source: Orthogonal

3. Get market data — price, market cap, volume, DeFi pool data
   POST https://api-staging.intra-tls2.dctx.link/x402/agent/qrn:agent:68f59a6a93d1a55ee56c7d3b
   Body: { "input": "Get current price, 24h change, volume and market cap for {symbol}" }
   Cost: $0.10/call
   Source: x402 Bazaar

### Phase 2: Technical Analysis

4. Compute indicators and trading signal (RSI, MACD, Bollinger, EMAs)
   POST https://mesh.heurist.xyz/x402/agents/YahooFinanceAgent/indicator_snapshot
   Body: { "symbol": "{symbol}-USD", "interval": "1d", "period": "6mo" }
   Cost: $0.01/call
   Source: x402 Bazaar

5. Get funding rates for perpetuals on Binance
   POST https://mesh.heurist.xyz/x402/agents/FundingRateAgent/get_all_funding_rates
   Cost: $0.01/call
   Source: x402 Bazaar

### Phase 3: Sentiment

6. Get trending tokens on Twitter
   POST https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/get_trending_tokens
   Body: { "time_window": "24h" }
   Cost: $0.01/call
   Source: x402 Bazaar

7. Search Twitter mentions for specific tokens
   POST https://mesh.heurist.xyz/x402/agents/ElfaTwitterIntelligenceAgent/search_mentions
   Body: { "keywords": ["{symbol}"], "days_ago": 3, "limit": 20 }
   Cost: $0.01/call
   Source: x402 Bazaar

### Phase 4: Execution

8. Execute on-chain token swap on Base
   POST https://dev.x420.dev/api/puff-custom
   Body: { "amount": "{usdc_amount}" }
   Cost: Up to $5.00/call
   Source: x402 Bazaar`;
