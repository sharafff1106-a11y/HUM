import { useEffect, useState } from "react";
import type Lenis from "lenis";

// Hash routes: "#journal" lists articles, "#j-<slug>" opens one; any other hash is a home-page section.
export type Route = { page: "home"; anchor: string } | { page: "journal" } | { page: "article"; slug: string };

export const parse = (h = location.hash.slice(1)): Route =>
  h === "journal" ? { page: "journal" } : h.startsWith("j-") ? { page: "article", slug: h.slice(2) } : { page: "home", anchor: h };

let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenis = l; };

export function scrollToAnchor(anchor: string, immediate = false) {
  const el = anchor && anchor !== "top" ? document.getElementById(anchor) : null;
  if (lenis) { lenis.resize(); lenis.scrollTo(el ?? 0, { offset: el ? -78 : 0, immediate, force: true }); }
  else el ? el.scrollIntoView() : scrollTo(0, 0);
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse());

  useEffect(() => {
    const go = (h: string, push: boolean) => {
      const next = parse(h);
      if (push) { try { history.pushState(null, "", "#" + h); } catch { /* sandboxed frames may refuse */ } }
      setRoute((prev) => {
        const samePage = prev.page === "home" && next.page === "home";
        // Wait for the new page to render before scrolling.
        requestAnimationFrame(() => requestAnimationFrame(() =>
          next.page === "home" ? scrollToAnchor(next.anchor, !samePage) : scrollToAnchor("", true)));
        return next;
      });
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href");
      if (!href?.startsWith("#") || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      go(href.slice(1), true);
    };
    const onPop = () => go(location.hash.slice(1), false);
    document.addEventListener("click", onClick);
    addEventListener("popstate", onPop);
    return () => { document.removeEventListener("click", onClick); removeEventListener("popstate", onPop); };
  }, []);

  return route;
}
