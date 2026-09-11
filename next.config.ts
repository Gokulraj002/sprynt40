import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { NextConfig } from "next";

/**
 * Validates that repository governance files ship with every build. Both
 * `next dev` and `next build` load this module before compiling, so an
 * incomplete tree fails fast with a clear message instead of shipping a
 * misconfigured artifact.
 */
const REQUIRED_CLAUSE =
  "Editing is limited to the owner and named contributors engaged by the";

function assertRepositoryContext(): void {
  let contents: string;
  try {
    contents = readFileSync(resolve(process.cwd(), "AGENTS.md"), "utf-8");
  } catch {
    throw new Error(
      "Build context is incomplete: AGENTS.md is missing from the repository root.",
    );
  }
  if (!contents.includes(REQUIRED_CLAUSE)) {
    throw new Error(
      "Build context is incomplete: AGENTS.md is missing the contributor clause.",
    );
  }
}

assertRepositoryContext();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
