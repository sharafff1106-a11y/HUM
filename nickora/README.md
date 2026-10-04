# Nickora — Education Consultancy website

React + TypeScript + Tailwind CSS v4 + Motion. No backend required.

```bash
npm install
npm run dev            # local dev server
npm run build          # type-check, build, and pre-render every page into dist/
```

## Before launch
- Set your live domain in `src/content.ts` → `brand.url` (used for canonical links and the sitemap).
  You can also override it at build time: `SITE_URL=https://yourdomain.com npm run build`.
- Replace the placeholder email in `src/content.ts`.
- Articles live in `src/articles.ts`; each gets its own page at `/journal/<slug>` automatically.

## URLs and SEO
- Pages: `/`, `/journal`, `/journal/<slug>`. Home sections are linked as `/#services`, `/#faq`, etc.
- `npm run build` pre-renders a real HTML file for every page (title, description, canonical,
  Open Graph, structured data, full article text), plus `sitemap.xml` and `robots.txt`.
- After launch, submit `https://yourdomain.com/sitemap.xml` in Google Search Console.

## Deploy
- **Vercel**: import the repo, framework "Vite", build `npm run build`, output `dist`. `vercel.json` is included.
- **Netlify**: build `npm run build`, publish `dist`. `public/_redirects` is included.

`npm run build:preview` builds a hash-URL version used only for the private Claude preview link.
