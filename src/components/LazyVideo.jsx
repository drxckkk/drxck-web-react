import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./LazyVideo.css";

/* Video that keeps its weight off the first paint.

   Nothing is fetched until the element is near the viewport, and the full
   download only starts once the video is actually wanted (`play`). A spinner
   sits over the frame from the moment bytes are requested until there is
   something to show, and comes back if the buffer runs dry mid-loop. */

const NEAR_VIEWPORT = "300px";

const LazyVideo = forwardRef(function LazyVideo(
  {
    src,
    play = false,
    /* pull metadata + first frame as soon as it is on screen, without
       waiting for `play` */
    warm = false,
    resetOnPause = false,
    /* off for purely decorative media, where a spinner is only noise */
    showSpinner = true,
    className = "",
    spinnerClassName = "",
    label,
    ...rest
  },
  ref
) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(false);
  /* latches: once a video has been asked to play we keep the buffered data
     around rather than throwing it away when the pointer leaves */
  const [wanted, setWanted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useImperativeHandle(ref, () => videoRef.current, []);

  /* only care about the viewport once — after that the source stays attached
     so scrolling back and forth never re-downloads anything */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || visible) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: NEAR_VIEWPORT }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (play) setWanted(true);
  }, [play]);

  const shouldLoad = visible && (warm || wanted);

  /* React keeps a src attribute around for the life of the element, so the
     source is attached imperatively the first time loading is allowed */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad) return;

    /* a warm video only pulls metadata; wanting it upgrades to a full download */
    el.preload = wanted ? "auto" : "metadata";

    if (el.getAttribute("src") === src) return;
    el.setAttribute("src", src);
    setLoading(true);
    setFailed(false);
    el.load();
  }, [shouldLoad, wanted, src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad) return;

    if (play) {
      /* a warmed video holds metadata but rarely enough frames to run — say so
         straight away rather than waiting for the browser's stall event */
      if (el.readyState < 3) setLoading(true);

      /* playback can still be refused (low power mode, user settings) — the
         spinner must not hang around in that case */
      const started = el.play();
      if (started?.catch) started.catch(() => setLoading(false));
    } else {
      el.pause();
      if (resetOnPause) el.currentTime = 0;
    }
  }, [play, shouldLoad, resetOnPause]);

  const stopLoading = () => setLoading(false);

  return (
    <>
      <video
        ref={videoRef}
        className={className}
        loop
        muted
        playsInline
        preload="none"
        onLoadedData={stopLoading}
        onCanPlay={stopLoading}
        onPlaying={stopLoading}
        /* a metadata-only warm-up may never reach loadeddata — that is as
           ready as it is going to get, so drop the spinner there too */
        onLoadedMetadata={() => !wanted && stopLoading()}
        onWaiting={() => setLoading(true)}
        onStalled={() => setLoading(true)}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
        {...rest}
      />

      {showSpinner && loading && !failed && (
        <span
          className={`media-spinner ${spinnerClassName}`}
          role="status"
          aria-label={label ? `Loading ${label} video` : "Loading video"}
        >
          <span className="media-spinner-ring" aria-hidden="true" />
        </span>
      )}
    </>
  );
});

export default LazyVideo;
