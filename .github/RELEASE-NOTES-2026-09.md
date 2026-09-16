# 2026.09 — Maintenance release

- Maintenance review of `veo3-scene-generator` — a browser-only tool that turns a scene configuration (duration, type, mood, location) into cinematic Veo-3 video prompts through a five-layer prompt engine, then renders the result as a storyboard, a prompt, or raw JSON.
- Stack: React 18 + TypeScript + Vite + Tailwind CSS with Lucide icons and the native Fetch API. Source is small and flat: six components, one `useSceneGenerator` hook, and `lib/promptEngine.ts` + `lib/types.ts`. The OpenAI key is entered in the UI, held in memory only, and called directly from the client — the README documents this client-side-only design and its security rationale.
- Status: public repo, still on its initial commit from 2026-02-08, package version 1.0.0. Scripts are `dev` / `build` (tsc + vite) / `preview` / `lint`. No live URL is stated in the repo.
- Reviewed September 2026: documentation refreshed, package version bumped to 1.1.0, released as v2026.09. No component, prompt-engine or build-config changes.
- Known gaps visible in the repo: no CHANGELOG before this release, no tests, no LICENSE file (the README states "Proprietary. All rights reserved."), and the `lint` script calls ESLint although no ESLint config file is checked in.
