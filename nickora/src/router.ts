import { useEffect, useState } from "react";
import type Lenis from "lenis";

// Two routing modes:
//  - "path" (default, for the real website): /, /#services, /journal, /journal/<slug>
//  - "hash" (for the sandboxed preview, which can't change its URL path): #services, #journal, #j-<slug>
// Build the preview with VITE_ROUTER=hash.
export const HASH_MODE = import.meta.env.VITE_ROUTER === "hash";

export type Route = { page: "home"; anchor: string } | { page: "journal" } | { page: "article"; slug: string };

/* ---------- links ---------- */
export const sec = (id: string) => (HASH_MODE ? `#${id}` : id === "top" ? "/" : `/#${id}`);
export const JOURNAL = HASH_MODE ? "#journal" : "/journal";
export const article = (slug: string) => (HASH_MODE ? `#j-${slug}` : `/journal/${slug}`);

/* ---------- parsing ---------- */
const fromHash = (h: string): Route =>
  h === "journal" ? { page: "journal" } : h.startsWith("j-") ? { page: "article", slug: h.slice(2) } : { page: "home", anchor: h };

const fromPath = (path: string, hash: string): Route => {
  const parts = path.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts[0] === "journal") return parts[1] ? { page: "article", slug: decodeURIComponent(parts[1]) } : { page: "journal" };
  return { page: "home", anchor: hash };
};

const current = (): Route => (HASH_MODE ? fromHash(location.hash.slice(1)) : fromPath(location.pathname, location.hash.slice(1)));

/* ---------- scrolling ---------- */
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenis = l; };

export function scrollToAnchor(anchor: string, immediate = false) {
  const el = anchor && anchor !== "top" ? document.getElementById(anchor) : null;
  if (lenis) { lenis.resize(); lenis.scrollTo(el ?? 0, { offset: el ? -78 : 0, immediate, force: true }); }
  else el ? el.scrollIntoView() : scrollTo(0, 0);
}

/* ---------- hook ---------- */
export function useRoute() {
  const [route, setRoute] = useState<Route>(current);

  useEffect(() => {
    const show = (next: Route) => {
      setRoute((prev) => {
        const samePage = prev.page === "home" && next.page === "home";
        // Wait for the new page to render before scrolling.
        requestAnimationFrame(() => requestAnimationFrame(() =>
          next.page === "home" ? scrollToAnchor(next.anchor, !samePage) : scrollToAnchor("", true)));
        return next;
      });
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href");
      if (!a || !href || a.target === "_blank" || a.hasAttribute("download")) return;
      let next: Route, url: string;
      if (HASH_MODE) {
        if (!href.startsWith("#")) return;
        next = fromHash(href.slice(1)); url = href;
      } else {
        const u = new URL(href, location.href);
        if (u.origin !== location.origin) return;
        next = fromPath(u.pathname, u.hash.slice(1));
        // Keep home section links clean: scroll without leaving "#section" in the address bar.
        url = next.page === "home" ? "/" : u.pathname;
      }
      e.preventDefault();
      try { if (url !== location.pathname + location.hash || next.page !== "home") history.pushState(null, "", url); } catch { /* sandboxed frames may refuse */ }
      show(next);
    };
    const onPop = () => show(current());
    document.addEventListener("click", onClick);
    addEventListener("popstate", onPop);
    // Arriving on /#section from another page.
    const first = current();
    if (first.page === "home" && first.anchor) requestAnimationFrame(() => requestAnimationFrame(() => scrollToAnchor(first.anchor, true)));
    return () => { document.removeEventListener("click", onClick); removeEventListener("popstate", onPop); };
  }, []);

  return route;
}
