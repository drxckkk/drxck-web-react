import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import usePageMeta from "./hooks/usePageMeta";
import { loadProject, loadWork } from "./routes";

const Work = lazy(loadWork);
const ProjectPage = lazy(loadProject);
const Xcrim = lazy(() => import("./pages/Xcrim"));
const Faby = lazy(() => import("./pages/Faby"));

const BARE = ["/faby", "/xcrim"];

function useRoutePath() {
  const { pathname, hash } = useLocation();
  const path = pathname.replace(/\/+$/, "").toLowerCase() || "/";

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [path, hash]);

  return path;
}

function NotFound() {
  usePageMeta({ title: "Not found", path: "/404" });

  return (
    <main id="main" className="site-main page not-found">
      <div className="shell not-found-inner">
        <span className="not-found-code">404</span>
        <h1 className="title-l">This page doesn't exist.</h1>
        <p className="body-l">It might have moved into the Work folder.</p>
        <Link className="btn btn-primary" to="/">
          Back home
        </Link>
      </div>
    </main>
  );
}

export function Shell() {
  const path = useRoutePath();
  const bare = BARE.includes(path);

  return (
    <>
      {!bare && (
        <a className="skip-link" href="#main">
          Skip to content
        </a>
      )}
      {!bare && <Nav />}

      <Suspense fallback={<div className="route-fallback" />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:id" element={<ProjectPage />} />

          <Route path="/about" element={<Navigate to="/#about" replace />} />
          <Route path="/games" element={<Navigate to="/work?filter=games" replace />} />
          <Route path="/catchaluckyblock" element={<Navigate to="/work/luckyblock" replace />} />

          <Route path="/xcrim" element={<Xcrim />} />
          <Route path="/faby" element={<Faby />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!bare && <Footer />}
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <Router>
        <Shell />
      </Router>
    </div>
  );
}
