import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware — request-layer filter for high-volume automated
 * indexers. Complements the robots.txt declaration in src/app/robots.ts;
 * clients that ignore robots.txt still get 403 here.
 *
 * Regular search engines (Googlebot, Bingbot, DuckDuckBot, etc.) and
 * human browsers are untouched.
 */

/**
 * User-Agent substrings (case-insensitive) matched against the incoming
 * request. Keep this list in sync with the disallow list in
 * src/app/robots.ts.
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
