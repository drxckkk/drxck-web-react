import { useEffect } from "react";

export default function useReveal(rootRef, key) {
  useEffect(() => {
    const root = rootRef?.current;
    if (!root) return undefined;

    const items = Array.from(root.querySelectorAll("[data-reveal]:not([data-revealed])"));
    if (!items.length) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.setAttribute("data-revealed", ""));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px" }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef, key]);
}
