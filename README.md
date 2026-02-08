# Veo-3 Scene Generator

Professional cinematic prompt engineering for Veo-3 video generation.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (BROWSER)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │ APIKeyInput │───▶│ useSceneGenerator│───▶│ OpenAI API    │  │
│  │ (password)  │    │ (memory-only)    │    │ (direct call) │  │
│  └─────────────┘    └──────────────────┘    └───────────────┘  │
│         │                    │                      │           │
│         │                    ▼                      ▼           │
│         │           ┌──────────────────┐   ┌──────────────────┐│
│         └──────────▶│ promptEngine.ts  │   │ Response Parser  ││
│                     │ (5-layer system) │   │ (JSON validation)││
│                     └──────────────────┘   └──────────────────┘│
│                                                     │           │
│                                                     ▼           │
│                                            ┌──────────────────┐│
│                                            │  OutputViewer    ││
│                                            │  (Storyboard/    ││
│                                            │   Prompt/JSON)   ││
│                                            └──────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── components/
│   ├── APIKeyInput.tsx      # Secure password input
│   ├── SceneConfigForm.tsx  # Duration, type, mood, location
│   ├── ConsentCheckbox.tsx  # User consent confirmation
│   ├── GenerateButton.tsx   # Action trigger with loading state
│   ├── OutputViewer.tsx     # Tabbed result display
│   └── index.ts             # Barrel exports
├── hooks/
│   └── useSceneGenerator.ts # API orchestration, memory management
├── lib/
│   ├── types.ts             # TypeScript definitions
│   └── promptEngine.ts      # 5-layer prompt system + sample
├── App.tsx                  # Main application shell
├── main.tsx                 # React entry point
└── index.css                # Global styles + Tailwind
```

---

## Security Implementation

### API Key Handling

```typescript
// Key lifecycle:
1. User enters key → stored in React state (memory)
2. Key passed to generate() → copied to ref for tracking
3. Fetch request made → key used in Authorization header
4. Request completes → key immediately cleared:
   - apiKeyRef.current = '';  // overwrite
   - apiKeyRef.current = null; // nullify
5. Parent state also cleared after passing to hook
```

### Security Guarantees

| Threat | Mitigation |
|--------|------------|
| LocalStorage persistence | Never used |
| SessionStorage persistence | Never used |
| IndexedDB persistence | Never used |
| Server-side logging | No backend; direct API calls |
| Network interception | HTTPS only (OpenAI enforces) |
| Memory dump attack | Key overwritten before nullification |
| Browser extension access | Password input type; no autocomplete |

### Why Client-Side Only

**Decision**: No backend proxy.

**Rationale**:
1. Backend introduces additional trust surface
2. API key would transit server memory
3. Logging/monitoring could inadvertently capture keys
4. Direct browser-to-OpenAI minimizes exposure
5. OpenAI's CORS policy permits browser requests

**Trade-off**: User must trust their browser environment.

---

## Prompt Engine Architecture

### Layer 1: System Role
Establishes AI as elite cinematic prompt engineer with specific domain expertise.

### Layer 2: Research Layer
Embeds Veo-3 best practices:
- Long-form pacing rules
- Shot duration discipline
- Camera grammar vocabulary

### Layer 3: Scene Architecture
Calculates based on duration:
- Act count
- Shots per act
- Average shot duration
- Total runtime with ±2s tolerance

### Layer 4: Shot Generator
Enforces complete metadata per shot:
- Timing (start/end)
- Camera type and lens
- Movement specification
- Lighting design
- Emotional intent
- Sound/music cue

### Layer 5: Output Format
Strict JSON schema enforcement for:
- Overview object
- Architecture with nested acts/shots
- Timing map
- Copy-ready Veo-3 prompt
- Quality checklist

---

## Installation

```bash
cd veo3-scene-generator
npm install
npm run dev
```

Open http://localhost:3000

---

## Build for Production

```bash
npm run build
```

Output in `dist/` directory. Deploy to any static hosting.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool, dev server |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon system |
| Fetch API | HTTP client (native) |

---

## Sample Output

See `src/lib/promptEngine.ts` for complete 5-minute luxury commercial example:
- "The Artisan's Dawn"
- Swiss watchmaking atelier setting
- 25 shots across 3 acts
- Full Veo-3 prompt included

---

## Extension Roadmap

### Monetization Opportunities

1. **Freemium Model**
   - Free: 3-minute scenes, basic scene types
   - Pro ($19/mo): All durations, all types, priority generation
   - Agency ($99/mo): Batch generation, brand presets, team seats

2. **Credit System**
   - Users purchase generation credits
   - Different credit costs per duration
   - Bulk discounts for agencies

3. **White-Label Licensing**
   - Remove branding, custom domains
   - Enterprise pricing per seat

### Pro Features

- Scene templates (product launch, testimonial, event)
- Brand preset library (save color palettes, camera preferences)
- Multi-scene project management
- Storyboard PDF export
- Collaborative editing
- Version history
- A/B prompt variants

### Agency Use Cases

- Client presentation exports
- Approval workflows
- Shot list integration with production tools
- Budget estimation per shot
- Crew assignment templates
- Location scouting integration

### SaaS Conversion Path

1. Add authentication (Clerk, Auth0, Supabase Auth)
2. Implement user profiles and saved projects
3. Add Stripe for billing
4. Create admin dashboard
5. Add analytics (Mixpanel, Amplitude)
6. Implement rate limiting per tier
7. Add team/organization management
8. Build API for third-party integrations

---

## API Considerations

### Current: OpenAI GPT-4o
- Excellent instruction following
- Reliable JSON output
- High-quality cinematic understanding

### Future Options
- Anthropic Claude (for comparison testing)
- Fine-tuned model (on cinematic prompts)
- Local LLM option (Ollama integration)

---

## License

Proprietary. All rights reserved.

---

## Support

For production deployment or enterprise licensing inquiries, contact the development team.
