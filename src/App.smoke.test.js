import fs from "fs";
import path from "path";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Shell } from "./App";
import { FEATURED, FILTERS, PROJECTS, searchProjects } from "./data/projects";
import { CONTACT, CURRENTLY } from "./data/profile";
import { PLACES } from "./data/places";
import { HARDWARE, SOFTWARE, STACK } from "./data/uses";
import { ICONS } from "./components/icons";

const PUBLIC = path.join(__dirname, "..", "public");

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  global.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  HTMLCanvasElement.prototype.getContext = () => null;
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
  ["load", "pause"].forEach((method) =>
    Object.defineProperty(window.HTMLMediaElement.prototype, method, {
      configurable: true,
      value: () => {},
    })
  );
  Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: () => Promise.resolve(),
  });
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

const renderAt = (url) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Shell />
    </MemoryRouter>
  );

test("the homepage leads with the name, then work, about, places, uses and contact", () => {
  renderAt("/");

  expect(screen.getByRole("heading", { level: 1, name: "Drxck" })).toBeInTheDocument();
  ["work", "about", "places", "uses", "contact"].forEach((id) => {
    expect(document.getElementById(id)).toBeInTheDocument();
  });
});

test("/work is the full archive and lists every project", async () => {
  renderAt("/work");
  expect(await screen.findByRole("heading", { level: 1, name: "Work" })).toBeInTheDocument();
  expect(document.querySelectorAll(".project-card")).toHaveLength(PROJECTS.length);
});

test("every project has its own page", async () => {
  for (const project of PROJECTS) {
    const { unmount } = renderAt(`/work/${project.id}`);
    expect(
      await screen.findByRole("heading", { level: 1, name: project.title })
    ).toBeInTheDocument();
    unmount();
  }
});

test("older URLs still land somewhere useful", async () => {
  let view = renderAt("/catchaluckyblock");
  expect(
    await screen.findByRole("heading", { level: 1, name: "Catch a Lucky Block" })
  ).toBeInTheDocument();
  view.unmount();

  view = renderAt("/games");
  expect(await screen.findByRole("button", { name: /^Games/ })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  view.unmount();

  renderAt("/about");
  expect(screen.getByRole("heading", { level: 1, name: "Drxck" })).toBeInTheDocument();
  expect(document.getElementById("about")).toBeInTheDocument();
});

test("unknown routes and unknown projects render a 404, not a blank page", async () => {
  let view = renderAt("/definitely-not-a-page");
  expect(document.querySelector(".not-found")).toBeInTheDocument();
  view.unmount();

  view = renderAt("/work/not-a-project");
  expect(await screen.findByText(/isn't in the folder/i)).toBeInTheDocument();
});

test("the pre-existing /xcrim route still renders, without site chrome", async () => {
  renderAt("/xcrim");
  expect(await screen.findByAltText(/xcrim/i)).toBeInTheDocument();
  expect(screen.queryByRole("navigation", { name: /primary/i })).not.toBeInTheDocument();
});

test("one primary nav with Home, Work, About and Contact", () => {
  renderAt("/");
  const nav = screen.getByRole("navigation", { name: /primary/i });
  const links = within(nav).getAllByRole("link");

  expect(links.map((a) => a.textContent)).toEqual(["Home", "Work", "About", "Contact"]);
  expect(links.map((a) => a.getAttribute("href"))).toEqual([
    "/",
    "/#work",
    "/#about",
    "/#contact",
  ]);
});

test("away from the homepage, Work opens the archive and is marked current", async () => {
  renderAt("/work");
  await screen.findByRole("heading", { level: 1, name: "Work" });
  const nav = screen.getByRole("navigation", { name: /primary/i });
  const work = within(nav).getByRole("link", { name: "Work" });

  expect(work).toHaveAttribute("href", "/work");
  expect(work).toHaveAttribute("aria-current", "page");
});

test("the theme toggle flips the appearance and remembers the choice", () => {
  renderAt("/");
  fireEvent.click(screen.getByRole("button", { name: /switch to dark appearance/i }));

  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem("theme")).toBe("dark");
  expect(screen.getByRole("button", { name: /switch to light appearance/i })).toBeInTheDocument();
});

test("the folder is a real link to /work, and each file inside opens its project", () => {
  renderAt("/");

  const front = screen.getByRole("link", { name: /work, open the archive/i });
  expect(front).toHaveAttribute("href", "/work");

  const files = within(screen.getByRole("list", { name: /featured projects/i })).getAllByRole(
    "link"
  );
  expect(files).toHaveLength(Math.min(4, FEATURED.length));
  files.forEach((file, i) => {
    expect(file).toHaveAttribute("href", `/work/${FEATURED[i].id}`);
    expect(file).toHaveTextContent(FEATURED[i].title);
  });
});

test("the folder's back panel is a pointer-only duplicate, hidden from assistive tech", () => {
  renderAt("/");
  const back = document.querySelector(".folder-back");
  expect(back).toHaveAttribute("aria-hidden", "true");
  expect(back).toHaveAttribute("tabindex", "-1");
});

test("filters narrow the archive", async () => {
  renderAt("/work");
  await screen.findByRole("heading", { level: 1, name: "Work" });

  const systems = screen.getByRole("button", { name: /^Systems/ });
  fireEvent.click(systems);

  expect(systems).toHaveAttribute("aria-pressed", "true");
  const expected = PROJECTS.filter((p) => p.filters.includes("systems")).length;
  await waitFor(() => expect(document.querySelectorAll(".project-card")).toHaveLength(expected));
});

test("search narrows the archive and offers a way back when nothing matches", async () => {
  renderAt("/work");
  const input = await screen.findByRole("searchbox", { name: /search projects/i });

  fireEvent.change(input, { target: { value: "luau physics" } });
  expect(document.querySelectorAll(".project-card")).toHaveLength(
    searchProjects("luau physics").length
  );

  fireEvent.change(input, { target: { value: "zzzz" } });
  expect(screen.getByText(/nothing matches/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /show everything/i }));
  expect(document.querySelectorAll(".project-card")).toHaveLength(PROJECTS.length);
});

test("the archive has a list view as well as a grid", async () => {
  renderAt("/work");
  fireEvent.click(await screen.findByRole("button", { name: /list view/i }));
  expect(document.querySelector(".work-collection.is-list")).toBeInTheDocument();
});

test("tuning the radio to 1440 MHz reveals the project it's named after", () => {
  renderAt("/");
  const dial = screen.getByLabelText(/radio frequency/i);

  expect(screen.queryByRole("link", { name: /signal found/i })).not.toBeInTheDocument();
  fireEvent.change(dial, { target: { value: "1440" } });
  expect(screen.getByRole("link", { name: /signal found/i })).toHaveAttribute(
    "href",
    `/work/${CURRENTLY.building}`
  );
});

test("a revealed card stays visible when its own classes change", () => {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target) {
      this.callback([{ isIntersecting: true, target }]);
    }
    unobserve() {}
    disconnect() {}
  };

  renderAt("/");
  const dial = screen.getByLabelText(/radio frequency/i);
  const card = dial.closest("[data-reveal]");

  expect(card).toHaveAttribute("data-revealed");
  fireEvent.change(dial, { target: { value: "1440" } });
  expect(card).toHaveClass("is-locked");
  expect(card).toHaveAttribute("data-revealed");
});

test("contact uses the real channels", () => {
  renderAt("/");
  const contact = document.getElementById("contact");

  expect(within(contact).getByText(CONTACT.email)).toBeInTheDocument();
  expect(within(contact).getByRole("button", { name: /copy email/i })).toBeInTheDocument();
  expect(within(contact).getByRole("button", { name: /copy discord/i })).toBeInTheDocument();
});

test("places without a photo are not pretending to be clickable", () => {
  renderAt("/");
  const places = document.getElementById("places");
  const withPhoto = PLACES.slice(0, 5).filter((p) => p.image).length;
  expect(within(places).queryAllByRole("button")).toHaveLength(withPhoto);
});

test("project ids are unique and every filter a project uses exists", () => {
  const ids = PROJECTS.map((p) => p.id);
  expect(new Set(ids).size).toBe(ids.length);

  const filters = new Set(FILTERS.map((f) => f.id));
  PROJECTS.forEach((p) => p.filters.forEach((f) => expect(filters.has(f)).toBe(true)));
});

test("every project still image exists on disk, at both sizes", () => {
  PROJECTS.forEach((p) => {
    [640, 1280].forEach((size) => {
      const file = path.join(PUBLIC, "images", "projects", `${p.id}-${size}.webp`);
      expect(fs.existsSync(file)).toBe(true);
    });
  });
});

test("every place photo that's set exists on disk", () => {
  PLACES.filter((p) => p.image).forEach((p) => {
    expect(fs.existsSync(path.join(PUBLIC, p.image))).toBe(true);
  });
});

test("the currently-building card points at a real project", () => {
  expect(PROJECTS.some((p) => p.id === CURRENTLY.building)).toBe(true);
});

test("every uses entry has a known icon and every stack entry a symbol", () => {
  [...HARDWARE, ...SOFTWARE].forEach((item) => expect(ICONS[item.icon]).toBeDefined());
  STACK.forEach((item) => expect(item.symbol).toBeTruthy());
});
