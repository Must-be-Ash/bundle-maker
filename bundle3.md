```
---
name: sec-filing-analyzer
description: Automate SEC filing discovery, extraction, and financial analysis for any public company. Costs ~$0.17 USDC per run.
argument-hint: [company-name, ticker-symbol, filing-type, fiscal-period]
---

# SEC Filing Analyzer

Automate the end-to-end process of finding, retrieving, and analyzing SEC filings (10-K, 10-Q, 8-K, and more) for any publicly traded company. This bundle combines company lookup, document retrieval, structured data extraction, financial metrics analysis, and AI-powered summarization into a complete research workflow.

## Overview

| Property | Value |
|----------|-------|
| Estimated Cost | ~$0.17/run |
| Payment | USDC on Base |
| Endpoints | 8 services |

## Steps

1. Search and identify the company by name or ticker
   GET https://x402.orth.sh/fundable/company/search?q={company_name_or_ticker}
   Cost: ~$0.01/call
   Source: Orthogonal (Fundable)

2. Enrich company profile with additional metadata (sector, SIC code, CIK)
   POST https://x402.orth.sh/sixtyfour/enrich-company
   Body: { "company": "{company_name}", "ticker": "{ticker}" }
   Cost: ~$0.01/call
   Source: Orthogonal (Sixtyfour API)

3. Search SEC EDGAR for the target filing (10-K, 10-Q, 8-K)
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_extract_web_data
   Body: { "urls": ["https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type={form_type}&dateb=&owner=include&count=10"], "extraction_prompt": "Extract all filing links, dates, and accession numbers for {form_type} filings" }
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

4. Scrape and retrieve the full filing document content
   POST https://mesh.heurist.xyz/x402/agents/FirecrawlSearchDigestAgent/firecrawl_scrape_url
   Body: { "url": "{sec_filing_url}", "wait_time": 7500 }
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

5. Extract structured financial data from the filing HTML
   POST https://x402.orth.sh/notte/scrape_from_html
   Body: { "html": "{filing_html}", "schema": { "revenue": "string", "net_income": "string", "eps": "string", "total_assets": "string", "total_liabilities": "string", "operating_cash_flow": "string", "guidance": "string" } }
   Cost: ~$0.01/call
   Source: Orthogonal (Notte)

6. Pull technical indicators and historical stock performance for context
   POST https://mesh.heurist.xyz/x402/agents/YahooFinanceAgent/indicator_snapshot
   Body: { "symbol": "{ticker}", "interval": "1d", "period": "1y" }
   Cost: $0.01/call
   Source: x402 Bazaar (Heurist)

7. Screen the company for AML/regulatory risk flags
   POST https://x402.orth.sh/didit/v3/aml
   Body: { "name": "{company_name}", "entity_type": "company" }
   Cost: ~$0.01/call
   Source: Orthogonal (Didit API)

8. Run deep-search AI analysis to synthesize filing insights and flag risks
   POST https://api-dev.intra-tls2.dctx.link/x402/agent/qrn:agent:68dba0e582f61ca4a1686963
   Body: { "input": "Analyze the following SEC {form_type} filing for {company_name} ({ticker}). Identify: 1) key revenue drivers and YoY trends, 2) risk factors, 3) management outlook, 4) red flags or accounting concerns, 5) comparison to analyst consensus. Data: {extracted_financial_data}" }
   Cost: $0.10/call
   Source: x402 Bazaar (Alpha Vantage / Questflow Agent)

## Notes

- Steps 3–5 target SEC EDGAR directly; substitute the filing URL from step 3 into steps 4 and 5
- The Notte HTML extractor (step 5) works best when fed the raw HTML from the EDGAR viewer page
- For 10-K annual filings, run step 6 with `period: "1y"`; for 10-Q quarterly filings use `period: "3mo"`
- AML screening in step 7 is optional but recommended for due-diligence workflows involving foreign-listed or recently redomiciled companies
- Alpha Vantage agent in step 8 also supports direct OVERVIEW, INCOME_STATEMENT, BALANCE_SHEET, and CASH_FLOW queries — pass those as natural language in the `input` field
- Total cost assumes one filing per run; scraping multiple exhibits (MD&A, footnotes, risk factors) will add ~$0.01 per additional URL scraped
- All endpoints pay in USDC on Base mainnet except step 2 (Questflow Alpha Vantage agent runs on base-sepolia)
```