# Portfolio Website — Master Plan

A **config-driven**, **animation-rich**, optionally **3D** personal portfolio with an integrated **RAG-powered chatbot** as the unique selling point (MSP).

---

## 1. Goals & Principles

| Principle | What it means |
|---|---|
| **Config-first** | All content (bio, jobs, projects, achievements, links, theme) lives in typed JSON/YAML files. Zero code edits to update content. |
| **Animation-rich** | Page transitions, scroll-driven reveals, magnetic cursors, parallax, text scrambling — but tunable via config (`animations.intensity: low \| medium \| high \| off`). |
| **Performance-aware** | 3D and heavy effects lazy-loaded, respect `prefers-reduced-motion`, mobile fallback to 2D. |
| **AI-native** | Chatbot is a first-class navigation primitive, not a widget bolted on. |
| **Type-safe** | Config validated by Zod schemas at build-time → broken config fails the build, not the browser. |

---

## 2. Tech Stack (Recommended)

### Frontend
- **Next.js 15 (App Router)** + **TypeScript** — SSR/ISR, route handlers for the chatbot API, great SEO.
- **Tailwind CSS** + **shadcn/ui** — utility styling + accessible primitives.
- **Framer Motion** — orchestrated animations, layout transitions, gestures.
- **GSAP + ScrollTrigger** — scroll-driven timelines, pinned sections, complex sequencing.
- **Lenis** — buttery smooth scroll (pairs with GSAP).
- **Three.js + React Three Fiber + Drei** — optional 3D scenes.
- **Zod** — config schema validation.

### Backend / AI  *(decisions locked in)*
- **Next.js Route Handlers** (`/api/chat`) — serverless, streaming responses.
- **Vercel AI SDK** + `@ai-sdk/groq` — unified streaming UI.
- **LLM**: **Groq** — `llama-3.3-70b-versatile` (quality) or `llama-3.1-8b-instant` (speed). Free tier is generous.
- **Vector store + Embeddings**: **Supabase** with `pgvector` extension. Embeddings generated at build time with `@xenova/transformers` (`Xenova/bge-small-en-v1.5`, 384-dim) — runs locally, zero API cost.
- **Rate limiting**: simple in-memory LRU per IP (or Supabase row-based counter) — protects the Groq key without needing Redis.

### Hosting  *(locked in)*
- **Vercel** — Next.js native, edge streaming, free hobby tier.

---

## 3. Project Structure

```
PortfolioWebsite/
├── content/                      # ← YOU EDIT THESE, nothing else
│   ├── profile.yaml              # name, tagline, bio, socials, photo
│   ├── education.yaml
│   ├── achievements.yaml
│   ├── experience.yaml           # jobs (used for RAG too)
│   ├── projects.yaml             # projects (used for RAG too)
│   ├── contact.yaml
│   └── theme.yaml                # colors, fonts, animation intensity, 3d on/off
├── content/rag/                  # extra long-form context for chatbot
│   ├── about-me.md
│   ├── projects/<slug>.md
│   └── jobs/<company>.md
├── src/
│   ├── app/
│   │   ├── (site)/page.tsx       # Home
│   │   ├── experience/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── projects/[slug]/page.tsx
│   │   ├── contact/page.tsx
│   │   └── api/chat/route.ts     # streaming RAG endpoint
│   ├── components/
│   │   ├── sections/             # Hero, Education, Achievements, ...
│   │   ├── animations/           # Reveal, Magnetic, TextScramble, Parallax
│   │   ├── three/                # Scene, ParticleField, ModelViewer (lazy)
│   │   └── chat/                 # ChatLauncher, ChatPanel, MessageList
│   ├── config/
│   │   ├── schema.ts             # Zod schemas
│   │   └── loader.ts             # reads content/*.yaml, validates, exports
│   ├── lib/
│   │   ├── rag/
│   │   │   ├── ingest.ts         # build-time: chunk + embed + upsert
│   │   │   ├── retrieve.ts       # runtime: query vector store
│   │   │   └── prompt.ts         # system prompt + guardrails
│   │   └── motion/               # shared variants, easings
│   └── styles/
├── scripts/
│   └── build-rag-index.ts        # `pnpm rag:build`
└── PLAN.md
```

---

## 4. Config Schema (sketch)

```ts
// src/config/schema.ts
export const Profile = z.object({
  name: z.string(),
  tagline: z.string(),
  bio: z.string(),                  // markdown
  photo: z.string(),
  location: z.string().optional(),
  socials: z.array(z.object({ label: z.string(), url: z.string().url(), icon: z.string() })),
});

export const Project = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),          // markdown — fed to RAG
  tech: z.array(z.string()),
  role: z.string().optional(),
  period: z.string().optional(),
  links: z.object({ repo: z.string().url().optional(), demo: z.string().url().optional() }),
  cover: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export const Theme = z.object({
  colors: z.object({ primary: z.string(), accent: z.string(), bg: z.string(), fg: z.string() }),
  font: z.object({ heading: z.string(), body: z.string() }),
  animations: z.object({
    intensity: z.enum(["off", "low", "medium", "high"]).default("high"),
    smoothScroll: z.boolean().default(true),
    cursor: z.enum(["default", "magnetic", "trail"]).default("magnetic"),
  }),
  three: z.object({
    enabled: z.boolean().default(true),
    hero: z.enum(["particles", "model", "shader", "none"]).default("particles"),
    modelUrl: z.string().optional(),  // .glb
  }),
});
```

Editing the site = edit YAML → commit → Vercel rebuilds.

---

## 5. Sections & Animation Catalog

### 5.1 Home
- **Hero**: name with **text-scramble** entrance, animated gradient or 3D particle field behind, magnetic CTA button.
- **About me**: split-text reveal on scroll, photo with **tilt** + parallax.
- **Education**: vertical timeline, items fade + slide as ScrollTrigger pins.
- **Achievements**: animated counters, marquee of badges/logos.

### 5.2 Experience
- Pinned horizontal scroll timeline (GSAP ScrollTrigger).
- Each role: company logo morph, expandable details, tech chips with stagger.

### 5.3 Projects
- Masonry/grid with **shared-layout transitions** (Framer Motion `layoutId`) into detail page.
- Hover: cover image parallax, color bleed, title slide.
- Detail page: gallery with smooth carousel, markdown body, "Ask the bot about this project" CTA → opens chat pre-prompted.

### 5.4 Contact
- Form (Resend / Formspree) with success micro-animation.
- Animated socials, copy-to-clipboard email with confetti.

### Global
- Custom cursor (magnetic on interactive elements).
- Page transitions (curtain wipe or morph).
- Lenis smooth scroll.
- `prefers-reduced-motion` → all big animations swapped for simple fades.

---

## 6. The Chatbot (MSP) — RAG Architecture

### 6.1 Flow

```
User question
   │
   ▼
/api/chat (Edge runtime, streaming)
   │
   ├─► Rate limit (IP)         ─► reject if abused
   ├─► Moderation (optional)   ─► block toxic / off-topic
   ├─► Embed query             ─► text-embedding-3-small
   ├─► Vector search top-K=6   ─► Upstash Vector
   ├─► Build prompt:
   │     - System (persona + guardrails)
   │     - Retrieved chunks (with source metadata)
   │     - Chat history (last N)
   │     - User question
   ├─► LLM stream              ─► gpt-4o-mini
   └─► Stream tokens to UI + return citations
```

### 6.2 Runtime flow detail (Groq + Supabase pgvector)

**Schema** (run once via Supabase SQL editor):
```sql
create extension if not exists vector;

create table portfolio_chunks (
  id          bigserial primary key,
  content     text not null,
  metadata    jsonb not null,        -- { type, title, slug, url }
  embedding   vector(384)            -- bge-small-en-v1.5 = 384 dims
);

create index on portfolio_chunks using hnsw (embedding vector_cosine_ops);

create or replace function match_chunks (
  query_embedding vector(384),
  match_count int default 6
) returns table (id bigint, content text, metadata jsonb, similarity float)
language sql stable as $$
  select id, content, metadata,
         1 - (embedding <=> query_embedding) as similarity
  from portfolio_chunks
  order by embedding <=> query_embedding
  limit match_count;
$$;
```

**Chat route**:
```ts
// /api/chat  (Node runtime — needs transformers.js)
import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@xenova/transformers";

const groq     = createGroq({ apiKey: process.env.GROQ_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
const embedder = await pipeline("feature-extraction", "Xenova/bge-small-en-v1.5");

const out   = await embedder(userQuery, { pooling: "mean", normalize: true });
const { data: hits } = await supabase.rpc("match_chunks", {
  query_embedding: Array.from(out.data),
  match_count: 6,
});

const result = streamText({
  model: groq("llama-3.3-70b-versatile"),
  system: SYSTEM_PROMPT,
  messages: [...history, { role: "user", content: buildContext(hits, userQuery) }],
  maxTokens: 500,
});
return result.toDataStreamResponse();
```

> Embedder loads once per cold start (~30 MB). Keep route on **Node runtime**, not edge.

### 6.3 Knowledge sources (ingested at build time)
1. All `content/*.yaml` (projects, experience, education, achievements, profile bio).
2. All markdown in `content/rag/` (long-form per-project / per-job notes).
3. Optional: pinned README files from your GitHub repos (fetched in `rag:build`).

### 6.4 Ingestion script (`scripts/build-rag-index.ts`)
- Read sources → split into ~500-token chunks with overlap (use `langchain/text_splitter` or custom).
- Attach metadata: `{ type: "project" | "job" | "bio", title, slug, url }`.
- Embed → upsert to Upstash Vector (namespace `portfolio-v1`).
- Run on `postbuild` so deploys always have fresh index.

### 6.5 System prompt (guardrails)
```
You are "Ask <Name>" — a helpful assistant that answers questions about
<Name>'s projects, experience, education, and publicly shared background.

Rules:
- Use ONLY the provided context. If the answer isn't there, say:
  "I don't have that info — try asking <Name> directly via the contact page."
- Never reveal personal data not in the context (no address, phone, etc.).
- Refuse to roleplay as <Name> making commitments (no salary negotiations,
  no agreeing to work, no quoting prices).
- Keep answers concise (≤ 6 sentences) unless asked for detail.
- When citing a project, link to /projects/<slug>.
```

### 6.6 UI
- Floating launcher button (bottom-right), magnetic, pulses when idle.
- Slide-in panel (right side, ~420px) or full-screen on mobile.
- Streaming markdown rendering, suggested-question chips:
  - "What did you do at <Company>?"
  - "Tell me about <FeaturedProject>"
  - "What's your tech stack?"
- Citations rendered as small clickable pills under each answer.

### 6.7 Privacy & cost controls
- Personal info allow-list — only what's in `content/rag/`.
- IP rate limit: 20 messages / hour.
- Max tokens per response: 500.
- Conversation kept client-side only (no server logging of message bodies; log only counts/latency).

---

## 7. 3D — Minimal (locked in)

Scope: **Tier 1 only** — a single subtle 3D element in the hero, lazy-loaded, with a 2D fallback. No 3D on other pages.

Concrete plan:
- Hero background: an **animated GLSL shader gradient** (cheap, runs on any GPU, ~3 KB shader code) **or** a low-poly **particle field** (~1500 points, depth-sorted).
- Wrapped in `next/dynamic({ ssr: false })` so it never blocks initial paint.
- Disabled automatically when `prefers-reduced-motion: reduce` or on devices where `navigator.hardwareConcurrency < 4`.
- Toggle via `theme.yaml` → `three.enabled: true/false`.
- No GLB models, no scrollytelling — keeps build small and mobile fast.

### Tech notes
- Use `@react-three/fiber` + `@react-three/drei`.
- Wrap in `next/dynamic` with `ssr: false`.
- Provide a 2D fallback when `theme.three.enabled = false` or on `prefers-reduced-motion`.
- Compress GLBs with `gltf-transform` / Draco.
- Cap DPR: `<Canvas dpr={[1, 2]}>`.

---

## 8. Build & Deploy Pipeline

```
git push
   │
   ▼
Vercel build:
   1. pnpm install
   2. pnpm rag:build       ← embeds content, upserts to vector DB
   3. next build           ← validates Zod schemas (fail fast)
   4. deploy
```

Env vars (Vercel dashboard):
- `GROQ_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE` (server-only — never expose to client)

---

## 9. Implementation Roadmap  *(UI first — locked in)*

### Phase 1 — Foundation  ◀ start here
- Scaffold Next.js 15 + TS + Tailwind + shadcn.
- Zod schemas + content loader.
- Seed YAML content with placeholders.
- Layout shell, routing, theme provider, dark/light toggle.

### Phase 2 — Content sections (UI complete, static)
- Home (hero, about, education, achievements).
- Experience page.
- Projects list + detail pages.
- Contact page (`mailto:` + copy-to-clipboard).
- All driven by YAML, no animations yet beyond CSS hover.

### Phase 3 — Animation layer
- Framer Motion reveal/transition library.
- GSAP ScrollTrigger for experience timeline.
- Lenis smooth scroll.
- `prefers-reduced-motion` fallbacks.

### Phase 4 — 3D hero (minimal)
- Lazy-loaded shader/particle hero, 2D fallback.

### Phase 5 — Chatbot RAG  *(after UI is solid)*
- Supabase project + pgvector schema.
- `scripts/build-rag-index.ts` — chunk content, embed locally, upsert.
- `/api/chat` Node route with Groq streaming + retrieval.
- Chat launcher UI (floating button + slide-in panel).

### Phase 6 — Polish
- Lighthouse pass (LCP < 2s, CLS < 0.05).
- SEO: OpenGraph, sitemap, JSON-LD.
- Analytics (Vercel / Plausible).

---

## 10. Locked-in Decisions

| Choice | Decision |
|---|---|
| **LLM provider** | **Groq** (`llama-3.3-70b-versatile`) via Vercel AI SDK |
| **Embeddings** | Upstash Vector built-in `bge-small-en-v1.5` (server-side, no extra provider) |
| **Vector store** | Supabase Postgres + pgvector (free tier) |
| **Embeddings** | `@xenova/transformers` `bge-small-en-v1.5` (local, 384-dim) |
| **Hosting** | Vercel (free hobby tier) |
| **Contact form** | **Basic** — `mailto:` link with copy-to-clipboard fallback. No backend, no third-party service. |
| **3D ambition** | **Minimal** — Tier 1 hero shader/particles only, lazy-loaded, with fallback |
| **Design direction** | **Clean & approachable** — modern minimal (think Linear / Vercel docs), generous whitespace, one accent color, tasteful animations. Not flashy, not brutalist. |
| **Domain** | TBD — `.dev` or `.me` recommended; use the free `<name>.vercel.app` until purchased |

## 11. Design Direction — "Clean & Approachable"

- **Layout**: spacious, single-column hero, max content width ~1100px.
- **Typography**: one sans (e.g. **Inter** or **Geist**) for body, slightly heavier weight for headings. No display fonts.
- **Color**: neutral base (off-white / near-black) + **one accent** pulled from `theme.yaml`. Dark mode by default with light toggle.
- **Motion**: subtle — fade + small slide on reveal, smooth scroll, gentle hover lifts. Skip elaborate scroll-pinning except on the experience timeline.
- **Components**: rounded-xl cards, soft borders (1px / low-contrast), no heavy shadows, no glassmorphism.
- **Iconography**: `lucide-react`.

## 12. Next Step

Ready to scaffold Phase 1. I'll create:
1. Next.js 15 + TS + Tailwind + shadcn project.
2. Zod schemas + content loader.
3. Seed YAML files with placeholder content (you'll fill in real data).
4. Layout shell, dark/light toggle, routing for all four pages.

Say **"go"** and I'll start the scaffold.
