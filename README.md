This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Create a local environment file:

```bash
cp .env.example .env.local
```

Optional (for future chatbot backend): set `NEXT_PUBLIC_CHAT_API_URL` in `.env.local`.

## OpenRouter + Qdrant RAG Backend

This project now includes a built-in Next.js backend for retrieval-augmented chat.

### 1) Configure environment variables

Update `.env.local` with:

- `OPENROUTER_API_KEY`
- `OPENROUTER_CHAT_MODEL` (default: `openai/gpt-4o-mini`)
- `OPENROUTER_EMBED_MODEL` (default: `openai/text-embedding-3-small`)
- `QDRANT_URL` (your Qdrant Cloud cluster URL)
- `QDRANT_API_KEY`
- Optional: `QDRANT_COLLECTION`, `RAG_TOP_K`, `RAG_ADMIN_TOKEN`

If you need API routes, make sure `STATIC_EXPORT=false`.

### 2) Index portfolio content into Qdrant

Run this after configuring env vars:

```bash
curl -X POST http://localhost:3000/api/rag/index \
	-H "x-rag-admin-token: <RAG_ADMIN_TOKEN>"
```

If `RAG_ADMIN_TOKEN` is unset, the header is not required.

### 3) Chat with RAG

```bash
curl -X POST http://localhost:3000/api/chat \
	-H "Content-Type: application/json" \
	-d '{
		"message": "What projects use React?",
		"history": []
	}'
```

Response includes:

- `answer`: model output from OpenRouter
- `citations`: matching chunks from Qdrant with source metadata

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This repository includes a GitHub Actions workflow for Vercel deployment:

- Workflow file: `.github/workflows/deploy-vercel.yml`
- Production deploy: push to `main`
- Preview deploy: pull requests to `main` (non-fork PRs)

### One-time setup (GitHub + Vercel)

1. Create a Vercel project connected to this repository.
2. In your repository, open **Settings → Secrets and variables → Actions**.
3. Add the following required secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `OPENROUTER_API_KEY`
- `QDRANT_URL`
- `QDRANT_API_KEY`

4. Add optional secrets if you use them:

- `NEXT_PUBLIC_CHAT_API_URL`
- `OPENROUTER_CHAT_MODEL`
- `OPENROUTER_EMBED_MODEL`
- `OPENROUTER_BASE_URL`
- `OPENROUTER_REFERER`
- `OPENROUTER_APP_NAME`
- `QDRANT_COLLECTION`
- `RAG_TOP_K`
- `RAG_ADMIN_TOKEN`

The workflow injects values from GitHub Secrets into Vercel deploys and enforces `STATIC_EXPORT=false` for server/API deployment.

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow for static deployment to GitHub Pages:

- Workflow file: `.github/workflows/deploy-pages.yml`
- Next.js static export config: `next.config.ts`

### One-time setup

1. Open your GitHub repository settings.
2. Go to **Pages**.
3. Set **Source** to **GitHub Actions**.

### Deploy

1. Push to the `main` branch.
2. GitHub Actions runs the deploy workflow automatically.
3. Your site is published at:

```text
https://karanjain1601.github.io/Portfolio/
```

### Notes

- The workflow sets `PAGES_BASE_PATH` automatically using `actions/configure-pages`.
- The project can build as static export when `STATIC_EXPORT=true`, served from `out/`.
- If you later host a Python chatbot backend, set `NEXT_PUBLIC_CHAT_API_URL` in the workflow/repository environment so the static frontend can call it.

### Troubleshooting

- If you get a 404, confirm Pages source is set to **GitHub Actions** and the latest deploy job succeeded.
- If assets fail to load, verify the site URL includes `/Portfolio/`.
