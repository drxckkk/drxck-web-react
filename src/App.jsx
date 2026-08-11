import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Projects from "./components/Projects";
import About from "./components/About";
import Contact from "./components/Contact";
import DotField from "./components/DotField";
import Xcrim from "./pages/Xcrim";
import "./App.css";

function Portfolio() {
  return (
    <>
      <Header />
      <main className="site-main">
        <Home />
        <Projects />
        <About />
        <Contact />
      </main>
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <DotField />
      <Router basename="">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/xcrim" element={<Xcrim />} />
        </Routes>
      </Router>
    </div>
  );
}
