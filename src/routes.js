export const loadWork = () => import("./pages/Work");
export const loadProject = () => import("./pages/ProjectPage");

let warmed = false;

export function prefetchWork() {
  if (warmed) return;
  warmed = true;
  loadWork().catch(() => {
    warmed = false;
  });
  loadProject().catch(() => {});
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
