import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { PLACES } from "../../data/places";
import "./Places.css";

const SLOTS = 5;

const metaLine = (place) => [place.country, place.year].filter(Boolean).join(" · ");
const describe = (place) => place.alt || `${place.location}, ${place.country}`;

function Postcard({ tint = ["#b9d3ea", "#efe6dc"] }) {
  return (
    <span className="postcard" style={{ "--c1": tint[0], "--c2": tint[1] }} aria-hidden="true">
      <span className="postcard-sun" />
      <span className="postcard-far" />
      <span className="postcard-near" />
    </span>
  );
}

function PlaceCard({ place, onOpen }) {
  const media = (
    <span className="place-media">
      {place.image ? (
        <img
          src={place.image}
          alt={describe(place)}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <Postcard tint={place.tint} />
      )}
    </span>
  );

  const caption = (
    <span className="place-caption">
      <span className="place-location">{place.location}</span>
      <span className="place-meta">{metaLine(place)}</span>
    </span>
  );

  const className = `place-card ${place.image ? "" : "is-placeholder"}`;

  if (!place.image) {
    return (
      <figure className={className}>
        {media}
        <figcaption>{caption}</figcaption>
      </figure>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onOpen}
      aria-label={`View photo: ${place.location}, ${metaLine(place)}`}
    >
      {media}
      {caption}
    </button>
  );
}

function PlaceViewer({ place, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    const opener = document.activeElement;
    if (dialog.showModal) dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("is-locked");
    return () => {
      document.body.classList.remove("is-locked");
      if (dialog.open && dialog.close) dialog.close();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="viewer"
      aria-label={`${place.location}, ${metaLine(place)}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <figure className="viewer-figure">
        <img src={place.image} alt={describe(place)} />
        <figcaption className="viewer-caption">
          <span className="viewer-location">{place.location}</span>
          <span className="viewer-meta">{metaLine(place)}</span>
        </figcaption>
      </figure>
      <button type="button" className="viewer-close glass" onClick={onClose} aria-label="Close photo">
        <X aria-hidden="true" strokeWidth={2.2} />
      </button>
    </dialog>
  );
}

function Places() {
  const [openIndex, setOpenIndex] = useState(null);
  const places = PLACES.slice(0, SLOTS);
  if (!places.length) return null;

  return (
    <section id="places" className="section home-places" data-nav-section="about">
      <div className="shell">
        <div className="places-grid" data-count={places.length}>
          <header className="places-head" data-reveal>
            <p className="eyebrow">Places</p>
            <h2 className="title-l">Photos from wherever I end up between projects.</h2>
          </header>

          {places.map((place, i) => (
            <div
              key={`${place.location}-${i}`}
              className="place-slot"
              data-slot={i + 1}
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 60}ms` }}
            >
              <PlaceCard place={place} onOpen={() => setOpenIndex(i)} />
            </div>
          ))}
        </div>
      </div>

      {openIndex !== null && places[openIndex]?.image && (
        <PlaceViewer place={places[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
}

export default Places;
