import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Work from "./pages/Work";
import Games from "./pages/Games";
import AboutPage from "./pages/AboutPage";
import GamePage from "./pages/GamePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DotField from "./components/DotField";
import Xcrim from "./pages/Xcrim";
import Faby from "./pages/Faby";
import "./App.css";

const SELF_THEMED = ["/faby"];

function useRouteChrome() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/+$/, "").toLowerCase() || "/";

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [path]);

  return path;
}

function NotFound() {
  return (
    <>
      <Header />
      <main className="site-main page not-found">
        <div className="shell">
          <span className="label">404</span>
          <h1 className="display display-l">This page doesn't exist.</h1>
          <Link className="text-link" to="/">
            back home
            <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* exported so tests can mount the real route table inside a MemoryRouter */
export function Shell() {
  const path = useRouteChrome();
  const selfThemed = SELF_THEMED.includes(path);

  return (
    <>
      {/* the grain is part of the site's paper; /faby brings its own */}
      {!selfThemed && <div className="grain" aria-hidden="true" />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/work" element={<Work />} />
        <Route path="/games" element={<Games />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/catchaluckyblock"
          element={<GamePage gameId="luckyblock" />}
        />
        <Route
          path="/xcrim"
          element={
            <>
              <DotField />
              <Xcrim />
            </>
          }
        />
        <Route path="/faby" element={<Faby />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <Router basename="">
        <Shell />
      </Router>
    </div>
  );
}
