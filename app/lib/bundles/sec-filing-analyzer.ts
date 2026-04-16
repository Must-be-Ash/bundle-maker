export const skillMd = `---
name: sec-filing-analyzer
description: Automate SEC filing discovery, extraction, and financial analysis for any public company. Costs ~$0.17 USDC per run.
argument-hint: [company-name, ticker-symbol, filing-type, fiscal-period]
---

# SEC Filing Analyzer

Automate the end-to-end process of finding, retrieving, and analyzing SEC filings (10-K, 10-Q, 8-K) for any publicly traded company.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.17/run |
| Payment | USDC on Base |
| Endpoints | 8 services |

## Steps

1. Search and identify the company by name or ticker
   GET https://x402.orth.sh/fundable/company/search?q={company_name_or_ticker}
   Cost: $0.01/call
   Source: Orthogonal

2. Enrich company profile with metadata (sector, SIC code, CIK)
   POST https://x402.orth.sh/sixtyfour/enrich-company
   Body: { "company": "{company_name}", "ticker": "{ticker}" }
   Cost: $0.01/call
   Source: Orthogonal

3. Search SEC EDGAR for the target filing
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type={form_type}&count=10"], "extraction_prompt": "Extract filing links, dates, and accession numbers" }
   Cost: $0.01/call
   Source: x402 Bazaar

4. Scrape and retrieve the full filing document
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{sec_filing_url}", "wait_time": 7500 }
   Cost: $0.01/call
   Source: x402 Bazaar

5. Extract structured financial data from the filing
   POST https://x402.orth.sh/notte/scrape_from_html
   Body: { "html": "{filing_html}", "schema": { "revenue": "string", "net_income": "string", "eps": "string" } }
   Cost: $0.01/call
   Source: Orthogonal

6. Pull technical indicators and historical stock performance
   POST https://mesh.heurist.xyz/x402/agents/YahooFinanceAgent/indicator_snapshot
   Body: { "symbol": "{ticker}", "interval": "1d", "period": "1y" }
   Cost: $0.01/call
   Source: x402 Bazaar

7. Screen the company for AML/regulatory risk flags
   POST https://x402.orth.sh/didit/v3/aml
   Body: { "name": "{company_name}", "entity_type": "company" }
   Cost: $0.01/call
   Source: Orthogonal

8. Synthesize filing insights and flag risks
   POST https://api-dev.intra-tls2.dctx.link/x402/agent/qrn:agent:68dba0e582f61ca4a1686963
   Body: { "input": "Analyze the {form_type} filing for {company_name}. Identify revenue drivers, risk factors, management outlook, and red flags: {extracted_financial_data}" }
   Cost: $0.10/call
   Source: x402 Bazaar`;
