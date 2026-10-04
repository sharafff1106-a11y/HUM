# Nickora — Education Consultancy website

React + TypeScript + Tailwind CSS v4 + Motion (Framer Motion). No backend required.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build -> dist/
```

- Edit copy, services, FAQ, email and WhatsApp in `src/content.ts` (replace the placeholder email first).
- Deploy `dist/` to Vercel, Netlify or Cloudflare Pages (all free; connect the repo, root directory `nickora`, build `npm run build`, output `dist`).
- The contact form opens the visitor's email app. For in-page submissions, swap `submit()` in `src/components/Contact.tsx` for Formspree or Web3Forms.
