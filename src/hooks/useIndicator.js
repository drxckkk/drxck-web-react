import { useLayoutEffect } from "react";

export default function useIndicator(trackRef, indicatorRef, activeId) {
  useLayoutEffect(() => {
    const track = trackRef.current;
    const indicator = indicatorRef.current;
    if (!track || !indicator) return undefined;

    const place = () => {
      const item = activeId != null && track.querySelector(`[data-id="${activeId}"]`);
      if (!item) {
        indicator.style.opacity = "0";
        return;
      }
      indicator.style.opacity = "1";
      indicator.style.width = `${item.offsetWidth}px`;
      indicator.style.height = `${item.offsetHeight}px`;
      indicator.style.transform = `translate3d(${item.offsetLeft}px, ${item.offsetTop}px, 0)`;
    };

    place();
    const frame = requestAnimationFrame(() => track.classList.add("is-ready"));

    if (typeof ResizeObserver === "undefined") return () => cancelAnimationFrame(frame);
    const observer = new ResizeObserver(place);
    observer.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [trackRef, indicatorRef, activeId]);
}
