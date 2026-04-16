import { MONO_LOGOS } from "./logos";
import { skillMd as vacationPlannerMd } from "./bundles/vacation-planner";
import { skillMd as competitorPriceMonitorMd } from "./bundles/competitor-price-monitor";
import { skillMd as secFilingAnalyzerMd } from "./bundles/sec-filing-analyzer";
import { skillMd as cryptoTradingBotMd } from "./bundles/crypto-trading-bot";
import { skillMd as youtubeToPodcastMd } from "./bundles/youtube-to-podcast";
import { skillMd as b2bLeadQualifierMd } from "./bundles/b2b-lead-qualifier";
import { skillMd as brandMentionMonitorMd } from "./bundles/brand-mention-monitor";
import { skillMd as emailEnrichmentAgentMd } from "./bundles/email-enrichment-agent";
import { skillMd as meetingTranscriberMd } from "./bundles/meeting-transcriber";

/* ─── Types ─────────────────────────────────────────────────────── */

export type BundleService = {
  name: string;
  description: string;
  price: string;
  logoUrl: string;
};

export type Bundle = {
  id: string;
  name: string;
  description: string;
  services: BundleService[];
  estimatedCostPerRun: number;
  chain: string;
  skillMd: string;
};

/* ─── Helper ────────────────────────────────────────────────────── */

const logo = (name: string) => MONO_LOGOS[name] ?? "";

/* ─── 9 Featured Bundles ────────────────────────────────────────── */

export const BUNDLES: Bundle[] = [
  {
    id: "vacation-planner",
    name: "Vacation Planner",
    description:
      "Research and plan a vacation with web search, Google Maps, weather, Reddit tips, and travel site scraping.",
    services: [
      { name: "Exa", description: "Web search and AI-powered answers", price: "$0.01 / call", logoUrl: logo("Exa") },
      { name: "Google Maps", description: "Attractions, restaurants, and place details", price: "$0.01 / call", logoUrl: logo("Google Maps") },
      { name: "Firecrawl", description: "Scrape travel blogs and booking sites", price: "$0.01 / call", logoUrl: logo("Firecrawl") },
      { name: "Reddit API", description: "Community travel tips and advice", price: "$0.01 / call", logoUrl: logo("Reddit API") },
    ],
    estimatedCostPerRun: 0.10,
    chain: "Base",
    skillMd: vacationPlannerMd,
  },
  {
    id: "competitor-price-monitor",
    name: "Competitor Price Monitor",
    description:
      "Scrape competitor pricing pages, extract structured data, detect changes, and send email alerts.",
    services: [
      { name: "Firecrawl", description: "Scrape and extract structured pricing data", price: "$0.01 / call", logoUrl: logo("Firecrawl") },
      { name: "Exa", description: "Search for pricing announcements and changes", price: "$0.01 / call", logoUrl: logo("Exa") },
      { name: "Openmart", description: "Enrich competitor company profiles", price: "$0.01 / call", logoUrl: logo("Openmart") },
      { name: "StableEmail", description: "Send price change email alerts", price: "$0.01 / call", logoUrl: logo("StableEmail") },
    ],
    estimatedCostPerRun: 0.08,
    chain: "Base",
    skillMd: competitorPriceMonitorMd,
  },
  {
    id: "sec-filing-analyzer",
    name: "SEC Filing Analyzer",
    description:
      "Automate SEC filing discovery, extraction, and financial analysis for any public company.",
    services: [
      { name: "Fundable", description: "Company search by name or ticker", price: "$0.01 / call", logoUrl: logo("Fundable") },
      { name: "Firecrawl", description: "Scrape SEC EDGAR filings and extract data", price: "$0.01 / call", logoUrl: logo("Firecrawl") },
      { name: "Exa", description: "Search EDGAR and synthesize insights", price: "$0.01 / call", logoUrl: logo("Exa") },
      { name: "Yahoo Finance", description: "Technical indicators and stock performance", price: "$0.01 / call", logoUrl: logo("Yahoo Finance") },
    ],
    estimatedCostPerRun: 0.13,
    chain: "Base",
    skillMd: secFilingAnalyzerMd,
  },
  {
    id: "crypto-trading-bot",
    name: "Crypto Trading Bot",
    description:
      "Monitor crypto prices, analyze technical indicators, gauge social sentiment, and execute on-chain trades.",
    services: [
      { name: "Dome", description: "Real-time price feeds from Binance and Chainlink", price: "USDC / call", logoUrl: logo("Dome") },
      { name: "Yahoo Finance", description: "Technical indicators — RSI, MACD, Bollinger Bands", price: "$0.01 / call", logoUrl: logo("Yahoo Finance") },
      { name: "Elfa", description: "Twitter trending tokens and sentiment analysis", price: "$0.01 / call", logoUrl: logo("Elfa") },
      { name: "Questflow", description: "Market data agents and research swarms", price: "$0.10 / call", logoUrl: logo("Questflow") },
      { name: "Heurist", description: "Funding rates, wallet analysis, and token trends", price: "$0.01 / call", logoUrl: logo("Heurist") },
    ],
    estimatedCostPerRun: 0.17,
    chain: "Base",
    skillMd: cryptoTradingBotMd,
  },
  {
    id: "youtube-to-podcast",
    name: "YouTube to Podcast",
    description:
      "Convert any YouTube video into a podcast by extracting transcript, generating a script, and producing audio.",
    services: [
      { name: "ScrapeCreators", description: "Fetch YouTube video details and transcript", price: "$0.01 / call", logoUrl: logo("ScrapeCreators") },
      { name: "MiniMax", description: "AI script generation and text-to-speech", price: "$0.10 / call", logoUrl: logo("MiniMax") },
    ],
    estimatedCostPerRun: 0.05,
    chain: "Base",
    skillMd: youtubeToPodcastMd,
  },
  {
    id: "b2b-lead-qualifier",
    name: "B2B Lead Qualifier",
    description:
      "Find, enrich, and qualify B2B sales leads using company databases, contact enrichment, LinkedIn intelligence, and web scraping.",
    services: [
      { name: "Crustdata", description: "Company search, enrichment, and LinkedIn post monitoring", price: "$0.01 / call", logoUrl: logo("Crustdata") },
      { name: "Firecrawl", description: "Scrape company websites for tech stack signals", price: "$0.01 / call", logoUrl: logo("Firecrawl") },
      { name: "Openmart", description: "Business signal enrichment", price: "$0.01 / call", logoUrl: logo("Openmart") },
      { name: "Sixtyfour", description: "Email finding and lead enrichment", price: "$0.01 / call", logoUrl: logo("Sixtyfour") },
    ],
    estimatedCostPerRun: 0.13,
    chain: "Base",
    skillMd: b2bLeadQualifierMd,
  },
  {
    id: "brand-mention-monitor",
    name: "Brand Mention Monitor",
    description:
      "Monitor your brand across Twitter, Instagram, TikTok, Facebook, Reddit, and news — then get an email digest.",
    services: [
      { name: "Elfa", description: "Twitter/X influential mention search", price: "$0.01 / call", logoUrl: logo("Elfa") },
      { name: "StableSocial", description: "Instagram, TikTok, Facebook, Reddit search", price: "$0.01 / call", logoUrl: logo("StableSocial") },
      { name: "Exa", description: "Deep web search for brand coverage", price: "$0.01 / call", logoUrl: logo("Exa") },
      { name: "StableEmail", description: "Send email digest notifications", price: "$0.03 / call", logoUrl: logo("StableEmail") },
    ],
    estimatedCostPerRun: 0.17,
    chain: "Base",
    skillMd: brandMentionMonitorMd,
  },
  {
    id: "email-enrichment-agent",
    name: "Email Enrichment Agent",
    description:
      "Enrich email addresses with person profiles, company data, and contact info using layered B2B data providers.",
    services: [
      { name: "Hunter", description: "Email deliverability verification", price: "$0.01 / call", logoUrl: logo("Hunter") },
      { name: "Minerva", description: "Email validation and identity resolution", price: "$0.01 / call", logoUrl: logo("Minerva") },
      { name: "Crustdata", description: "Person enrichment and company firmographics", price: "$0.05 / call", logoUrl: logo("Crustdata") },
      { name: "Apollo", description: "People search at same company", price: "$0.02 / call", logoUrl: logo("Apollo") },
    ],
    estimatedCostPerRun: 0.30,
    chain: "Base",
    skillMd: emailEnrichmentAgentMd,
  },
  {
    id: "meeting-transcriber",
    name: "Meeting Transcriber",
    description:
      "Transcribe meeting recordings from YouTube, Twitter, TikTok, or Facebook and generate AI-powered summaries.",
    services: [
      { name: "ScrapeCreators", description: "Multi-platform video transcript extraction", price: "$0.01 / call", logoUrl: logo("ScrapeCreators") },
      { name: "StableUpload", description: "File hosting for local recordings", price: "$0.02 / call", logoUrl: logo("StableUpload") },
      { name: "Perplexity", description: "AI-powered transcript summarization", price: "$0.01 / call", logoUrl: logo("Perplexity") },
    ],
    estimatedCostPerRun: 0.05,
    chain: "Base",
    skillMd: meetingTranscriberMd,
  },
];
