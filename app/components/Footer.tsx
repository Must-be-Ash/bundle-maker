import Link from "next/link";

export function Footer() {
  return (
    <footer className="hidden sm:block mt-16 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span>Built on</span>
          <a
            href="https://github.com/coinbase/x402"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-foreground/80 hover:text-foreground transition-colors"
          >
            x402
          </a>
          <span>·</span>
          <span>$0.01 USDC on Base per generation</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/.well-known/x402"
            className="hover:text-foreground transition-colors"
          >
            Discovery
          </Link>
          <Link
            href="/openapi.json"
            className="hover:text-foreground transition-colors"
          >
            OpenAPI
          </Link>
          <Link
            href="/llms.txt"
            className="hover:text-foreground transition-colors"
          >
            llms.txt
          </Link>
          <a
            href="https://github.com/coinbase/x402"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Docs
          </a>
        </nav>
      </div>
    </footer>
  );
}
