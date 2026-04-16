```
---
name: sec-filing-analyzer
description: Automate SEC filing discovery, document retrieval, data extraction, and AI-powered fundamental analysis for any public company. Costs ~$0.13 per run.
argument-hint: [company-name, ticker-symbol, filing-type, date-range]
---

# SEC Filing Analyzer

Automate the full pipeline for SEC filing analysis: search for companies, retrieve EDGAR filings, scrape and extract structured financial data, enrich with company fundamentals, and synthesize AI-powered analysis. Use this bundle for earnings research, due diligence, or building financial dashboards.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.13/run |
| Payment | USDC on Base |
| Endpoints | 8 services |

## Steps

1. Search for company identifier (CIK, ticker, name)
   GET https://x402.orth.sh/fundable/company/search?q={company_name}
   Cost: ~$0.01/call
   Source: Orthogonal (Fundable)

2. Enrich company profile with fundamentals and metadata
   POST https://x402.orth.sh/sixtyfour/enrich-company
   Body: { "company": "{company_name}", "domain": "{company_domain}" }
   Cost: ~$0.01/call
   Source: Orthogonal (Sixtyfour API)

3. Search EDGAR full-text for filings (10-K, 10-Q, 8-K)
   POST https://stableenrich.dev/api/exa/search
   Body: { "query": "{ticker} 10-K annual report SEC EDGAR", "type": "keyword", "numResults": 5, "includeDomains": ["sec.gov", "edgar.sec.gov"] }
   Cost: ~$0.005/call
   Source: x402 Bazaar (stableenrich.dev)

4. Scrape EDGAR filing index page to get document URLs
   POST https://stableenrich.dev/api/firecrawl/scrape
   Body: { "url": "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type=10-K&dateb=&owner=include&count=10", "formats": ["markdown"] }
   Cost: ~$0.005/call
   Source: x402 Bazaar (stableenrich.dev)

5. Extract structured financial data from the filing document
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["{edgar_filing_url}"], "extraction_prompt": "Extract all financial statements including income statement, balance sheet, cash flow statement, revenue figures, net income, EPS, total assets, total liabilities, operating cash flow, capital expenditures, and management discussion highlights" }
   Cost: $0.01/call (maxAmountRequired: 10000 = $0.01 USDC)
   Source: x402 Bazaar (Heurist)

6. Scrape full filing document content for deeper parsing
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{filing_document_url}", "wait_time": 7500, "debug": false }
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

7. Get technical indicators and stock performance context
   POST https://mesh.heurist.xyz/x402/agents/YahooFinanceAgent/indicator_snapshot
   Body: { "symbol": "{ticker}", "interval": "1d", "period": "1y", "debug": false }
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

8. AI synthesis — summarize filings, compute ratios, flag risks
   POST https://stableenrich.dev/api/exa/answer
   Body: { "query": "Based on the following SEC 10-K data for {company}, what are the key financial ratios (P/E, debt-to-equity, current ratio, ROE, gross margin), growth trends, and material risk factors? Data: {extracted_data}" }
   Cost: ~$0.01/call
   Source: x402 Bazaar (stableenrich.dev)

## Notes

- EDGAR is free and public — use `https://efts.sec.gov/LATEST/search-index?q={ticker}&dateRange=custom&startdt={date}&enddt={date}&forms=10-K` to build direct filing URLs before passing to scraper steps
- Step 3 (Exa search) can be targeted with `site:sec.gov` and the filing type to get precise document links
- Step 5 supports wildcard URLs like `https://www.sec.gov/Archives/edgar/data/{cik}/*` for crawling entire filing directories
- The Alpha Vantage agent at `https://api-dev.intra-tls2.dctx.link/x402/agent/qrn:agent:68dba0e582f61ca4a1686963` (max $0.10) can supplement with historical earnings and fundamental data if needed
- AML/compliance screening via `https://x402.orth.sh/didit/v3/aml` ($0.01) can be added for counterparty risk checks on company executives or insiders
- For portfolio-level analysis, loop steps 1–8 per ticker and aggregate results
- All costs are maximums (maxAmountRequired); actual charges may be lower per call
```