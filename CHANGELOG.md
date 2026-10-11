# Changelog

All notable changes to this project are documented in this file.

## [2026.10] - 2026-10-12

- veo3-scene-generator is a public browser-only React 18 + TypeScript + Vite + Tailwind tool that turns a scene configuration into Veo-3 prompts via a five-layer prompt engine. The user's OpenAI key is held in memory and called directly from the client, as the README documents.
- State: unchanged since the initial commit in February 2026; no live URL stated.
- Re-reviewed October 2026: README, file tree and commit history re-read; documentation and version metadata only, no code changes. The README has no external links to verify.
- Known gaps: no tests; no LICENSE (README says proprietary); the lint script calls ESLint but no ESLint config is checked in.

## [2026.09] - 2026-09-16

- Maintenance review of `veo3-scene-generator` — a browser-only tool that turns a scene configuration (duration, type, mood, location) into cinematic Veo-3 video prompts through a five-layer prompt engine, then renders the result as a storyboard, a prompt, or raw JSON.
- Stack: React 18 + TypeScript + Vite + Tailwind CSS with Lucide icons and the native Fetch API. Source is small and flat: six components, one `useSceneGenerator` hook, and `lib/promptEngine.ts` + `lib/types.ts`. The OpenAI key is entered in the UI, held in memory only, and called directly from the client — the README documents this client-side-only design and its security rationale.
- Status: public repo, still on its initial commit from 2026-02-08, package version 1.0.0. Scripts are `dev` / `build` (tsc + vite) / `preview` / `lint`. No live URL is stated in the repo.
- Reviewed September 2026: documentation refreshed, package version bumped to 1.1.0, released as v2026.09. No component, prompt-engine or build-config changes.
- Known gaps visible in the repo: no CHANGELOG before this release, no tests, no LICENSE file (the README states "Proprietary. All rights reserved."), and the `lint` script calls ESLint although no ESLint config file is checked in.
