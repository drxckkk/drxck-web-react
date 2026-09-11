import { useCallback, useEffect, useState } from "react";

const KEY = "theme";
const COLORS = { light: "#f5f5f7", dark: "#111113" };

const darkQuery = () =>
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

function stored() {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", COLORS[theme]));
  try {
    localStorage.setItem(KEY, theme);
  } catch {
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState(
    () => stored() || (darkQuery()?.matches ? "dark" : "light")
  );

  useEffect(() => {
    const query = darkQuery();
    if (!query || stored()) return undefined;
    const onChange = (e) => {
      if (!stored()) setTheme(e.matches ? "dark" : "light");
    };
    query.addEventListener?.("change", onChange);
    return () => query.removeEventListener?.("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (document.startViewTransition && !calm) {
      document.startViewTransition(() => apply(next));
    } else {
      apply(next);
    }
    setTheme(next);
  }, [theme]);

  return [theme, toggle];
}
