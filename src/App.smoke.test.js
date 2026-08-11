import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// NOTE: App.jsx is deliberately not imported here — react-router-dom v7 ships an
// "exports" map that CRA 5's Jest resolver can't follow. Components are mounted
// directly instead, which is also why renderPortfolio mirrors App's tree.
import DotField from "./components/DotField";
import Header from "./components/Header";
import Home from "./components/Home";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import { PLATFORMS, PROJECTS } from "./data/projects";

beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
    configurable: true,
    writable: true,
    value: () => Promise.resolve(),
  });
  Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
    configurable: true,
    writable: true,
    value: () => {},
  });
  window.scrollTo = jest.fn();

  window.scrollTo = jest.fn();
});

// DotField and Cursor both branch on pointer type / reduced motion.
// CRA's jest config sets resetMocks:true, so this must be a plain function
// re-installed per test rather than a jest.fn() defined once in beforeAll.
beforeEach(() => {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
});

const renderPortfolio = () =>
  render(
    <>
      <Header />
      <main>
        <Home />
        <Projects />
        <About />
        <Contact />
      </main>
    </>
  );

test("renders the portfolio without crashing", () => {
  renderPortfolio();

  expect(document.querySelector(".project-grid")).toBeInTheDocument();
  expect(
    screen.getByText("Kart System", { selector: ".project-title" })
  ).toBeInTheDocument();
  // stack pills come from PROJECTS[].tags — the field whose absence blanked the page
  expect(document.querySelectorAll(".project-stack li").length).toBeGreaterThan(0);
});

test("the dot field mounts and survives a canvas-less environment", () => {
  const { unmount } = render(<DotField />);
  expect(document.querySelector(".dot-field")).toBeInTheDocument();
  unmount();
});

test("word reveals split copy into individually animated words", () => {
  renderPortfolio();

  const heading = document.querySelector(".contact-heading");
  expect(heading.querySelectorAll(".wr-word").length).toBeGreaterThan(3);
  // the *real* marker renders as an accented word, not literal asterisks
  expect(heading.textContent).not.toMatch(/\*/);
  expect(heading.querySelector(".wr-accent")).toHaveTextContent("real");
});

test("the hero carousel stacks three recent projects and can be advanced", () => {
  renderPortfolio();

  expect(document.querySelectorAll(".carousel-card").length).toBe(3);
  expect(document.querySelectorAll(".carousel-card.is-active").length).toBe(1);
  // each background card carries a pixel canvas twin
  expect(document.querySelectorAll(".carousel-card-pixels").length).toBe(3);

  const bars = document.querySelectorAll(".carousel-bar");
  fireEvent.click(bars[1]);
  expect(bars[1]).toHaveClass("is-active");
  expect(bars[0]).not.toHaveClass("is-active");
});

test("every project points at a platform that exists", () => {
  const ids = new Set(PLATFORMS.map((p) => p.id));
  PROJECTS.forEach((project) => {
    expect(ids.has(project.platform)).toBe(true);
  });
});

test("filtering by platform narrows the grid, and empty platforms are disabled", async () => {
  renderPortfolio();

  expect(document.querySelectorAll(".project-card").length).toBe(PROJECTS.length);

  // Unity has no projects yet, so its chip is present but not selectable
  expect(screen.getByRole("tab", { name: /Unity/i })).toBeDisabled();

  const roblox = screen.getByRole("tab", { name: /Roblox/i });
  fireEvent.click(roblox);

  expect(roblox).toHaveAttribute("aria-selected", "true");
  // cards leave via an exit animation, so settle before counting
  await waitFor(() =>
    expect(document.querySelectorAll(".project-card").length).toBe(
      PROJECTS.filter((p) => p.platform === "roblox").length
    )
  );
});
