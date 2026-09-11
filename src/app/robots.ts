import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";

/**
 * robots.txt — first line of defence against AI scrapers and model
 * training crawlers.
 *
 * Blocked user agents get an explicit `Disallow: /`. Well-behaved crawlers
 * (OpenAI/GPTBot, Anthropic/ClaudeBot, Google-Extended, Perplexity, Meta,
 * Apple, ByteDance, Amazon, CommonCrawl, etc.) honour this. Bad actors that
 * ignore robots.txt are caught by src/middleware.ts, which returns 403 on
 * the same user-agent list.
 *
 * Regular search engines (Googlebot, Bingbot, DuckDuckBot) still get
 * full access via the wildcard `*` rule at the bottom.
 */
const AI_BOTS: readonly string[] = [
  // OpenAI
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  // Anthropic
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  // Google (Bard / Gemini training)
  "Google-Extended",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Meta / Facebook
  "FacebookBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  // Apple Intelligence
  "Applebot-Extended",
  // ByteDance / TikTok
  "Bytespider",
  // Amazon
  "Amazonbot",
  // Common Crawl (feeds many AI training sets)
  "CCBot",
  // Others
  "Diffbot",
  "cohere-ai",
  "cohere-training-data-crawler",
  "YouBot",
  "MistralAI-User",
  "Timpibot",
  "DuckAssistBot",
  "ImagesiftBot",
  "omgili",
  "omgilibot",
  "PanguBot",
  "Kangaroo Bot",
  "PetalBot",
  "Scrapy",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_BOTS.map((userAgent) => ({ userAgent, disallow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
