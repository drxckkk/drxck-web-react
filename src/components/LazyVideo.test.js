import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import LazyVideo from "./LazyVideo";

/* jsdom has no IntersectionObserver, and LazyVideo leans on it to decide when
   a video is allowed to touch the network — so drive it by hand */
let observed = [];

beforeEach(() => {
  observed = [];
  global.IntersectionObserver = class {
    constructor(cb) {
      this.cb = cb;
      observed.push(this);
    }
    observe(el) {
      this.el = el;
    }
    disconnect() {}
  };
});

afterEach(() => {
  delete global.IntersectionObserver;
});

const scrollIntoView = () => {
  act(() => {
    observed.forEach((io) => io.cb([{ isIntersecting: true, target: io.el }]));
  });
};

const videoEl = () => document.querySelector("video");
const spinner = () => screen.queryByRole("status");

test("nothing is fetched until the video is on screen", () => {
  render(<LazyVideo src="/clip.mp4" warm />);

  expect(videoEl().getAttribute("src")).toBeNull();
  expect(spinner()).not.toBeInTheDocument();

  scrollIntoView();

  expect(videoEl().getAttribute("src")).toBe("/clip.mp4");
  expect(videoEl().preload).toBe("metadata");
});

test("an on-screen video that is not wanted stays unloaded", () => {
  const { rerender } = render(<LazyVideo src="/clip.mp4" />);
  scrollIntoView();

  expect(videoEl().getAttribute("src")).toBeNull();

  /* hovering the card asks for playback, which is what pulls the full file */
  rerender(<LazyVideo src="/clip.mp4" play />);

  expect(videoEl().getAttribute("src")).toBe("/clip.mp4");
  expect(videoEl().preload).toBe("auto");
});

test("the spinner marks loading media and clears once there are frames", () => {
  render(<LazyVideo src="/clip.mp4" label="Kart" play />);
  scrollIntoView();

  expect(spinner()).toBeInTheDocument();
  expect(spinner()).toHaveAccessibleName("Loading Kart video");

  fireEvent.loadedData(videoEl());
  expect(spinner()).not.toBeInTheDocument();

  /* and comes back when the buffer runs dry mid-loop */
  fireEvent.waiting(videoEl());
  expect(spinner()).toBeInTheDocument();

  fireEvent.playing(videoEl());
  expect(spinner()).not.toBeInTheDocument();
});

test("a broken source drops the spinner instead of spinning forever", () => {
  render(<LazyVideo src="/missing.mp4" play />);
  scrollIntoView();

  expect(spinner()).toBeInTheDocument();

  fireEvent.error(videoEl());
  expect(spinner()).not.toBeInTheDocument();
});

test("decorative media can opt out of the spinner", () => {
  render(<LazyVideo src="/clip.mp4" play showSpinner={false} />);
  scrollIntoView();

  expect(videoEl().getAttribute("src")).toBe("/clip.mp4");
  expect(spinner()).not.toBeInTheDocument();
});
