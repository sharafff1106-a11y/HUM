import { useEffect } from "react";
import { brand } from "./content";
import { HASH_MODE, JOURNAL, type Route } from "./router";

// Page-level title, description and canonical link for the home page and the Journal list.
// Article pages set their own (see ArticlePage).
const META = {
  home: { title: `${brand.name}: Education Consultancy, Admissions & Research Guidance`, description: "Nickora guides students and researchers from university admissions to PhD: mentoring, dissertation guidance, academic editing and referencing.", path: "/" },
  journal: { title: `Journal: Guides for Students and Researchers | ${brand.name}`, description: "Free, practical guides on dissertations, literature reviews, statements of purpose, referencing and academic integrity.", path: JOURNAL },
};

export function setHead(title: string, description: string, path: string) {
  document.title = title;
  let d = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!d) { d = document.createElement("meta"); d.name = "description"; document.head.appendChild(d); }
  d.content = description;
  if (HASH_MODE) return;
  let c = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!c) { c = document.createElement("link"); c.rel = "canonical"; document.head.appendChild(c); }
  c.href = brand.url + path;
}

export function usePageHead(route: Route) {
  useEffect(() => {
    if (route.page === "article") return;
    const m = META[route.page];
    setHead(m.title, m.description, m.path);
  }, [route.page]);
}
