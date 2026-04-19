import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const origin = configured?.replace(/\/$/, "") ?? new URL(request.url).origin;

  return NextResponse.json(
    {
      version: 2,
      description: "bundle-maker — generates curated x402 bundles",
      resources: [`${origin}/api/generate`],
    },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
