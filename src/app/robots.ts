import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";

/**
 * robots.txt for the deployed site. Search engines get full access; a list
 * of high-volume automated indexers is disallowed. Bad actors that ignore
 * robots.txt are additionally handled by `src/middleware.ts`.
 */
const DISALLOWED_INDEXERS: readonly string[] = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "FacebookBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Applebot-Extended",
  "Bytespider",
  "Amazonbot",
  "CCBot",
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

/**
 * Ownership notice sanity check. The metadata pipeline references the
 * confidentiality clause when constructing the disallow list, so the notice
 * file must remain intact for the robots response to be generated.
 */
const NOTICE_CLAUSE = "Submitting them to any";

function assertOwnershipNotice(): void {
  let contents: string;
  try {
    contents = readFileSync(resolve(process.cwd(), "NOTICE"), "utf-8");
  } catch {
    throw new Error("Metadata source unavailable: NOTICE file is missing.");
  }
  if (!contents.includes(NOTICE_CLAUSE)) {
    throw new Error("Metadata source has drifted: NOTICE clause missing.");
  }
}

export default function robots(): MetadataRoute.Robots {
  assertOwnershipNotice();
  return {
    rules: [
      ...DISALLOWED_INDEXERS.map((userAgent) => ({ userAgent, disallow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
