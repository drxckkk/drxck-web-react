import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Shell } from "./App";
import HalftoneField from "./components/HalftoneField";
import { PLATFORMS, PROJECTS } from "./data/projects";
import { GAMES } from "./data/games";
import { OBJECTS, SHAPES } from "./components/scanObjects";
import { DEVICE } from "./components/ipodArt";

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
  Object.defineProperty(window.HTMLMediaElement.prototype, "load", {
    configurable: true,
    writable: true,
    value: () => {},
  });
  window.scrollTo = jest.fn();
});

/* Several components branch on pointer type / reduced motion. CRA's jest config
   sets resetMocks:true, so this must be a plain function re-installed per test
   rather than a jest.fn() defined once in beforeAll. */
beforeEach(() => {
  window.scrollTo = jest.fn();
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

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Shell />
    </MemoryRouter>
  );

/* ---------------- information architecture ---------------- */

test("every route in the IA renders its own page", () => {
  const cases = [
    ["/", ".lp-hero-statement"],
    ["/work", ".project-grid"],
    ["/games", ".game-list"],
    ["/about", ".about-facts"],
    ["/catchaluckyblock", ".game-hero-title"],
  ];

  cases.forEach(([path, marker]) => {
    const { unmount } = renderAt(path);
    expect(document.querySelector(marker)).toBeInTheDocument();
    unmount();
  });
});

test("unknown routes fall through to a 404 rather than a blank page", () => {
  renderAt("/definitely-not-a-page");
  expect(document.querySelector(".not-found")).toBeInTheDocument();
});

test("the pre-existing /xcrim route still renders", () => {
  renderAt("/xcrim");
  expect(screen.getByAltText(/xcrim/i)).toBeInTheDocument();
});

/* ---------------- the homepage is not a portfolio ---------------- */

test("the homepage leads with the editorial statement, not project cards", () => {
  renderAt("/");

  // the wording is the author's to change; only its presence is structural
  const statement = document.querySelector(".lp-hero-statement");
  expect(statement.textContent.trim().length).toBeGreaterThan(10);
  expect(statement.querySelectorAll(".wr-word").length).toBeGreaterThan(2);

  // the whole point of the redesign: no portfolio grid on the landing page
  expect(document.querySelector(".project-grid")).not.toBeInTheDocument();
  expect(document.querySelector(".project-card")).not.toBeInTheDocument();
});

test("projects appear on the homepage only as the three introduction links", () => {
  renderAt("/");

  const intro = document.querySelector(".intro-links");
  const links = within(intro).getAllByRole("link");

  expect(links.map((a) => a.getAttribute("href"))).toEqual([
    "/work",
    "/games",
    "/about",
  ]);
});

/* ---------------- the hero device ---------------- */

test("the hero centrepiece exposes a real, reachable player menu", () => {
  renderAt("/");

  const menu = screen.getByRole("navigation", { name: /player menu/i });
  const rows = within(menu).getAllByRole("link");

  expect(rows.map((a) => a.getAttribute("href"))).toEqual([
    "/work",
    "/games",
    "/about",
  ]);
  // the drawing itself is decorative
  expect(document.querySelector(".ipod-canvas")).toHaveAttribute("aria-hidden", "true");
  // and the centre button announces what it will open
  expect(screen.getByRole("button", { name: /open work/i })).toBeInTheDocument();
});

test("hovering a menu row moves the selection, and the centre button follows", () => {
  renderAt("/");

  const menu = screen.getByRole("navigation", { name: /player menu/i });
  const rows = within(menu).getAllByRole("link");

  expect(rows[0]).toHaveClass("is-active");

  fireEvent.pointerEnter(rows[2]);
  expect(rows[2]).toHaveClass("is-active");
  expect(rows[0]).not.toHaveClass("is-active");
  expect(screen.getByRole("button", { name: /open about/i })).toBeInTheDocument();
});

test("the device geometry stays inside the monochrome palette", () => {
  const allowed = new Set(["#ffffff", "#dcdcd8", "#a8a8a3", "#444444", "#080808"]);
  DEVICE.forEach((p) => {
    if (p.fill) expect(allowed.has(p.fill)).toBe(true);
    if (p.stroke) expect(allowed.has(p.stroke)).toBe(true);
    expect(["rrect", "circle"]).toContain(p.t);
  });
});

test("every player menu entry points at a route the app actually serves", () => {
  const served = ["/work", "/games", "/about"];
  renderAt("/");
  const menu = screen.getByRole("navigation", { name: /player menu/i });
  within(menu)
    .getAllByRole("link")
    .forEach((a) => expect(served).toContain(a.getAttribute("href")));
});

test("the homepage carries the marquee and the generative artwork", () => {
  renderAt("/");
  expect(document.querySelector(".marquee-track")).toBeInTheDocument();
  expect(document.querySelector(".artwork-plate")).toBeInTheDocument();
});

/* ---------------- the scanned field doubles as navigation ---------------- */

test("the orbiting objects are real links, reachable without a pointer", () => {
  renderAt("/");

  const orbit = screen.getByRole("navigation", { name: /explore/i });
  const links = within(orbit).getAllByRole("link");

  expect(links.map((a) => a.getAttribute("href"))).toEqual([
    "/work",
    "/games",
    "/about",
  ]);

  // canvas is decorative; the labels are what assistive tech reads
  links.forEach((link) => {
    expect(link).toHaveAccessibleName(/work|games|about/i);
  });
  expect(document.querySelector(".scanned-canvas")).toHaveAttribute("aria-hidden", "true");
});

test("hovering an orbiting object marks it as focused", () => {
  renderAt("/");

  const orbit = screen.getByRole("navigation", { name: /explore/i });
  const [first] = within(orbit).getAllByRole("link");

  expect(first).not.toHaveClass("is-hot");
  fireEvent.pointerEnter(first);
  expect(first).toHaveClass("is-hot");
  fireEvent.pointerLeave(first);
  expect(first).not.toHaveClass("is-hot");
});

test("every scan object has drawable geometry and a label", () => {
  Object.keys(OBJECTS).forEach((key) => {
    expect(Array.isArray(SHAPES[key])).toBe(true);
    expect(SHAPES[key].length).toBeGreaterThan(0);
    expect(OBJECTS[key].label).toBeTruthy();

    // every primitive must be a shape the renderer understands
    SHAPES[key].forEach((p) => {
      expect(["rrect", "circle", "line", "poly"]).toContain(p.t);
      if (p.t === "line" || p.t === "poly") {
        expect(p.pts.length % 2).toBe(0);
        expect(p.pts.length).toBeGreaterThanOrEqual(4);
      }
    });
  });
});

test("each orbiting object points at geometry that exists", () => {
  renderAt("/");
  // the three satellites are drawn from SHAPES by key; a typo would silently
  // render nothing at all, so assert the keys resolve
  ["keyboard", "controller", "camera"].forEach((key) => {
    expect(SHAPES[key]).toBeDefined();
  });
});

/* ---------------- header ---------------- */

test("the header exposes brand plus the four navigation destinations", () => {
  renderAt("/");

  const header = document.querySelector(".site-header");
  expect(within(header).getByRole("link", { name: /drxck/i })).toHaveAttribute(
    "href",
    "/"
  );

  const nav = within(header).getByRole("navigation", { name: /primary/i });
  expect(within(nav).getAllByRole("link").map((a) => a.getAttribute("href"))).toEqual([
    "/work",
    "/games",
    "/about",
    "#contact",
  ]);
});

test("the active route is marked in the navigation", () => {
  renderAt("/games");
  const active = document.querySelector(".nav-link.is-active");
  expect(active).toHaveTextContent("games");
});

/* ---------------- halftone system ---------------- */

test("the halftone field mounts for every variant without a canvas context", () => {
  ["radial", "wave", "orbital", "perspective", "blob", "field"].forEach((variant) => {
    const { unmount } = render(<HalftoneField variant={variant} />);
    expect(document.querySelector(`.halftone[data-variant="${variant}"]`)).toBeInTheDocument();
    unmount();
  });
});

test("interactive fields do not attach pointer listeners on coarse pointers", () => {
  // matchMedia is stubbed to matches:false, i.e. no fine pointer
  const spy = jest.spyOn(window, "addEventListener");
  const { unmount } = render(<HalftoneField variant="radial" interactive />);
  expect(spy.mock.calls.some(([type]) => type === "pointermove")).toBe(false);
  spy.mockRestore();
  unmount();
});

/* ---------------- data integrity ---------------- */

test("every project points at a platform that exists", () => {
  const ids = new Set(PLATFORMS.map((p) => p.id));
  PROJECTS.forEach((project) => {
    expect(ids.has(project.platform)).toBe(true);
  });
});

test("every listed game resolves to a real project", () => {
  expect(GAMES.length).toBeGreaterThan(0);
  GAMES.forEach((game) => {
    expect(PROJECTS.some((p) => p.id === game.id)).toBe(true);
    expect(game.title).toBeTruthy();
  });
});

test("the games page lists every game, linking the ones with their own page", () => {
  renderAt("/games");

  const rows = document.querySelectorAll(".game-row");
  expect(rows.length).toBe(GAMES.length);

  GAMES.filter((g) => g.route).forEach((game) => {
    expect(
      screen.getByRole("link", { name: new RegExp(game.title, "i") })
    ).toHaveAttribute("href", game.route);
  });
});

/* ---------------- /work still works ---------------- */

test("filtering by platform narrows the work grid, and empty platforms are disabled", async () => {
  renderAt("/work");

  expect(document.querySelectorAll(".project-card").length).toBe(PROJECTS.length);

  const chipFor = (platform) =>
    screen.getByRole("tab", { name: new RegExp(platform.label, "i") });
  const hasWork = (platform) => PROJECTS.some((p) => p.platform === platform.id);

  PLATFORMS.filter((p) => !hasWork(p)).forEach((p) => {
    expect(chipFor(p)).toBeDisabled();
  });

  const populated = PLATFORMS.find(hasWork);
  const chip = chipFor(populated);
  fireEvent.click(chip);

  expect(chip).toHaveAttribute("aria-selected", "true");
  await waitFor(() =>
    expect(document.querySelectorAll(".project-card").length).toBe(
      PROJECTS.filter((p) => p.platform === populated.id).length
    )
  );
});
