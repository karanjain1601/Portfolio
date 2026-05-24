This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Create a local environment file:

```bash
cp .env.example .env.local
```

Optional (for future chatbot backend): set `NEXT_PUBLIC_CHAT_API_URL` in `.env.local`.

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

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

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
- The project builds with `output: "export"`, so it is served as a static site from the `out/` directory.
- If you later host a Python chatbot backend, set `NEXT_PUBLIC_CHAT_API_URL` in the workflow/repository environment so the static frontend can call it.

### Troubleshooting

- If you get a 404, confirm Pages source is set to **GitHub Actions** and the latest deploy job succeeded.
- If assets fail to load, verify the site URL includes `/Portfolio/`.
