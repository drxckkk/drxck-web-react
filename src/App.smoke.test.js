import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "./components/Header";
import Home from "./components/Home";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";

beforeAll(() => {
  global.IntersectionObserver = class {
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
});

test("renders the portfolio without crashing", () => {
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

  expect(screen.getByText(/Featured projects/i)).toBeInTheDocument();
  expect(
    screen.getByText("Kart System", { selector: ".project-title" })
  ).toBeInTheDocument();
  // stack pills come from PROJECTS[].stack — the field whose absence blanked the page
  expect(document.querySelectorAll(".project-stack li").length).toBeGreaterThan(0);
});
