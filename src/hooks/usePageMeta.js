import { useEffect } from "react";

const SITE = "https://drxck.cyou";
const DEFAULT_TITLE = "Drxck";
const DEFAULT_DESCRIPTION =
  "Software engineer & Game Developer building software, games and interactive experiments.";

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export default function usePageMeta({ title, description, path = "/" } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} - Drxck` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESCRIPTION;
    const url = SITE + path;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", url);
  }, [title, description, path]);
}
