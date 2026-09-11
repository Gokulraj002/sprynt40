import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware — second line of defence against AI scrapers.
 *
 * robots.txt (src/app/robots.ts) tells well-behaved bots not to crawl.
 * This middleware enforces the same list at the request layer, returning
 * 403 for any User-Agent that identifies as an AI crawler, so bots that
 * ignore robots.txt still don't get content.
 *
 * Search engines (Googlebot, Bingbot, DuckDuckBot, etc.) and human
 * browsers are untouched.
 */

/**
 * Substrings (case-insensitive) matched against the incoming User-Agent.
 * Keep this list in sync with AI_BOTS in src/app/robots.ts.
 */
const BLOCKED_UA_PATTERNS: readonly string[] = [
  "gptbot",
  "chatgpt-user",
  "oai-searchbot",
  "claudebot",
  "claude-web",
  "anthropic-ai",
  "google-extended",
  "perplexitybot",
  "perplexity-user",
  "facebookbot",
  "meta-externalagent",
  "meta-externalfetcher",
  "applebot-extended",
  "bytespider",
  "amazonbot",
  "ccbot",
  "diffbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "youbot",
  "mistralai-user",
  "timpibot",
  "duckassistbot",
  "imagesiftbot",
  "omgili",
  "omgilibot",
  "pangubot",
  "kangaroo bot",
  "petalbot",
  "scrapy",
];

export function middleware(request: NextRequest) {
  const ua = (request.headers.get("user-agent") ?? "").toLowerCase();

  if (ua && BLOCKED_UA_PATTERNS.some((pattern) => ua.includes(pattern))) {
    return new NextResponse("Forbidden — automated access is not permitted.", {
      status: 403,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow, noarchive",
      },
    });
  }

  return NextResponse.next();
}

/**
 * Run middleware on all paths EXCEPT Next.js internals and static assets,
 * so robots.txt is still reachable (which is what tells nice bots to leave)
 * and images/fonts aren't gated needlessly.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images|logos.jpeg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};
