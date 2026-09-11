# Sprynt40 — AI Coding Assistant Policy

**Effective date:** 11 September 2026
**Owner:** Sprynt40 · Andhra Pradesh, India · [support@sprynt20.com](mailto:support@sprynt20.com)

## Summary

This repository is proprietary. Using AI coding assistants — Claude Code,
ChatGPT, Cursor, GitHub Copilot, Codeium, Gemini Code Assist, or any similar
tool — to read, edit, generate, or derive changes from this codebase is
**prohibited** unless you have received written permission from the owner.

By cloning this repository, you agree to this policy.

## What is not allowed

Without prior written permission from the owner you must not:

1. Feed any file from this repository into any AI assistant (upload, paste,
   attach, or grant filesystem access via an agent like Claude Code).
2. Ask an AI tool to generate, rewrite, refactor, translate, or complete
   code that will be committed back to this repository.
3. Use this codebase — in whole or in part — as input, context, fine-tuning
   data, RAG index, or grounding material for any model or agent.
4. Bypass the technical guards in this repository (AGENTS.md / CLAUDE.md
   authorization block, `.cursorignore`, `.aiexclude`, `.aiignore`,
   `.copilotignore`, or the `no-ai-commits` GitHub Action).

## What is allowed

- Reading the code with a normal editor (VS Code without AI plug-ins, Vim,
  Sublime, JetBrains without AI Assistant, etc.).
- Running the site locally for review and testing.
- Opening pull requests written by a human.

## Enforcement

- Every pull request must include a signed attestation that no AI tool was
  used (see the pull-request template).
- Server-side checks reject pushes that contain AI attribution trailers
  (e.g. `Co-Authored-By: Claude`, `Co-Authored-By: Copilot`).
- Violation is a breach of this repository's licence (see `LICENSE`) and
  of any contract you have with Sprynt40. Consequences include revocation
  of access, removal from the project, and pursuit of legal remedies.

## Owner authorization

If you need to use an AI tool on this repository, email
[support@sprynt20.com](mailto:support@sprynt20.com) with the scope of use
before you start. Written permission from the owner overrides this policy
only for the specific scope granted, and only for the person named in the
authorization.

Any question about whether a specific action is permitted → default to
"no" and ask first.
