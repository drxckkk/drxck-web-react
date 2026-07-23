import Header from "./components/Header";
import Home from "./components/Home";
import Projects from "./components/Projects";
import About from "./components/About";
import Skills from "./components/Skills";
import Focus from "./components/Focus";
import Contact from "./components/Contact";
import Xcrim from "./pages/Xcrim";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

function Portfolio() {
  return (
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
}

export default function App() {
  return (
    <div className="App">
      <Router basename="">
        <Routes>
          <Route path="/" element={<Portfolio />} />
        </Routes>
      </Router>
    </div>
  );
}
