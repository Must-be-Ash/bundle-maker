"use client";

import { CDPReactProvider, type Theme } from "@coinbase/cdp-react";

const CONFIG = {
  disableAnalytics: true,
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID ?? "",
  appName: "Bundle Maker",
  authMethods: ["email", "oauth:google"] as ["email", "oauth:google"],
  ethereum: {
    createOnLogin: "eoa" as const,
  },
};

const themeOverrides: Partial<Theme> = {
  "colors-bg-default": "#1A1A1A",
  "colors-bg-alternate": "#212121",
  "colors-bg-primary": "#FFFFFF",
  "colors-bg-secondary": "#FFFFFF",
  "colors-fg-default": "#FFFFFF",
  "colors-fg-muted": "#CCCCCC",
  "colors-fg-primary": "#FFFFFF",
  "colors-fg-onPrimary": "#000000",
  "colors-fg-onSecondary": "#000000",
  "colors-line-default": "rgba(255, 255, 255, 0.15)",
  "colors-line-heavy": "rgba(255, 255, 255, 0.25)",
  "font-family-sans": "var(--font-geist-mono), system-ui, sans-serif",
  "font-size-base": "14px",
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CDPReactProvider config={CONFIG} theme={themeOverrides}>
      {children}
    </CDPReactProvider>
  );
}
