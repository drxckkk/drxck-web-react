import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "./LazyVideo.css";

const NEAR_VIEWPORT = "300px";

const LazyVideo = forwardRef(function LazyVideo(
  {
    src,
    play = false,
    warm = false,
    resetOnPause = false,
    showSpinner = true,
    onAspect,
    className = "",
    spinnerClassName = "",
    label,
    ...rest
  },
  ref
) {
  const videoRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [wanted, setWanted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useImperativeHandle(ref, () => videoRef.current, []);

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

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad) return;

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
      if (el.readyState < 3) setLoading(true);

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
        onLoadedMetadata={(e) => {
          const { videoWidth, videoHeight } = e.currentTarget;
          if (videoWidth && videoHeight) onAspect?.(videoWidth / videoHeight);
          if (!wanted) stopLoading();
        }}
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
