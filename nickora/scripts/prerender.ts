// Runs after `vite build`. Writes a real HTML file for every page so search engines see
// each article's title, description, canonical URL, social tags, structured data and full text
// without running JavaScript. React replaces the static markup when the page loads.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { articles, type Article, type Block } from "../src/articles.ts";
import { brand } from "../src/content.ts";

const DIST = "dist";
const SITE = (process.env.SITE_URL || brand.url).replace(/\/$/, "");
const template = readFileSync(join(DIST, "index.html"), "utf8");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Page = { path: string; title: string; description: string; type: "website" | "article"; body: string; jsonld: object[]; keywords?: string[] };

function head(p: Page) {
  const url = SITE + p.path;
  return [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    p.keywords ? `<meta name="keywords" content="${esc(p.keywords.join(", "))}" />` : "",
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${p.type}" />`,
    `<meta property="og:site_name" content="${brand.name}" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(p.title)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
    ...p.jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`),
  ].filter(Boolean).join("\n    ");
}

function render(p: Page) {
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta name="description"[^>]*>/, "")
    .replace("</head>", `    ${head(p)}\n  </head>`)
    // Readable static markup until the app takes over.
    .replace('<div id="root"></div>', `<div id="root"><div style="max-width:720px;margin:0 auto;padding:120px 20px;font:17px/1.7 Georgia,serif;color:#111318">${p.body}</div></div>`);
  // "/journal/x" is written as both journal/x.html and journal/x/index.html, so any static host
  // (Vercel cleanUrls, Netlify pretty URLs, nginx try_files) serves it without a redirect.
  const files = p.path === "/" ? ["index.html"] : [`${p.path.slice(1)}.html`, join(p.path.slice(1), "index.html")];
  for (const f of files) { const file = join(DIST, f); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html); }
}

const block = (b: Block): string => {
  switch (b.t) {
    case "h": return `<h2>${esc(b.text)}</h2>`;
    case "p": return `<p>${esc(b.text)}</p>`;
    case "tip": return `<aside><strong>Nickora tip:</strong> ${esc(b.text)}</aside>`;
    case "list": return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    case "steps": return `<ol>${b.items.map((i) => `<li><strong>${esc(i.title)}.</strong> ${esc(i.text)}</li>`).join("")}</ol>`;
    case "checklist": return `<h3>${esc(b.title)}</h3><ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
    case "example": return `<figure><figcaption>${esc(b.label)}</figcaption><p><strong>Before:</strong> ${esc(b.bad)}</p><p><strong>Better:</strong> ${esc(b.good)}</p><p>${esc(b.why)}</p></figure>`;
    case "faq": return `<h2>Frequently asked questions</h2>${b.items.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}`;
  }
};

const org = { "@type": "Organization", name: brand.name, url: SITE };
const articlePage = (a: Article): Page => {
  const faqs = a.body.flatMap((b) => (b.t === "faq" ? b.items : []));
  return {
    path: `/journal/${a.slug}`,
    title: `${a.title} | ${brand.name} Journal`,
    description: a.metaDescription,
    keywords: a.keywords,
    type: "article",
    body: `<nav><a href="/">${brand.name}</a> › <a href="/journal">Journal</a></nav><article><p>${esc(a.category)}</p><h1>${esc(a.title)}</h1><p><em>${esc(a.excerpt)}</em></p>`
      + `<h2>Key takeaways</h2><ul>${a.takeaways.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`
      + a.body.map(block).join("")
      + `<h2>Sources and further reading</h2><ul>${a.sources.map((s) => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul></article>`,
    jsonld: [
      { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.metaDescription, keywords: a.keywords.join(", "), mainEntityOfPage: `${SITE}/journal/${a.slug}`, author: org, publisher: org },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE}/journal` },
        { "@type": "ListItem", position: 3, name: a.title, item: `${SITE}/journal/${a.slug}` },
      ] },
      ...(faqs.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }] : []),
    ],
  };
};

const pages: Page[] = [
  {
    path: "/",
    title: `${brand.name}: Education Consultancy, Admissions & Research Guidance`,
    description: "Nickora guides students and researchers from university admissions to PhD: mentoring, dissertation guidance, academic editing and referencing.",
    type: "website",
    body: `<h1>Turn the page on being stuck.</h1><p>Expert guidance from admission to PhD. Your work, made stronger.</p><h2>Services</h2><ul><li>Educational Consultancy</li><li>University &amp; Admissions Guidance</li><li>Academic Mentoring</li><li>Research &amp; Dissertation Guidance</li><li>Academic Proofreading &amp; Editing</li><li>Referencing &amp; Document Formatting</li></ul><p><a href="/journal">Read the Journal</a></p>`,
    jsonld: [{ "@context": "https://schema.org", "@type": "EducationalOrganization", name: brand.name, url: SITE, email: brand.email }],
  },
  {
    path: "/journal",
    title: `Journal: Guides for Students and Researchers | ${brand.name}`,
    description: "Free, practical guides on dissertations, literature reviews, statements of purpose, referencing and academic integrity.",
    type: "website",
    body: `<h1>Notes for the stuck.</h1><ul>${articles.map((a) => `<li><a href="/journal/${a.slug}">${esc(a.title)}</a>: ${esc(a.excerpt)}</li>`).join("")}</ul>`,
    jsonld: [{ "@context": "https://schema.org", "@type": "Blog", name: `${brand.name} Journal`, url: `${SITE}/journal`, blogPost: articles.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: `${SITE}/journal/${a.slug}` })) }],
  },
  ...articles.map(articlePage),
];

for (const p of pages) render(p);

writeFileSync(join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${SITE}${p.path === "/" ? "/" : p.path}</loc></url>`).join("\n")}\n</urlset>\n`);
writeFileSync(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Prerendered ${pages.length} pages for ${SITE}`);
