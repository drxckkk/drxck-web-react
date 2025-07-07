import Header from "./components/Header";
import Home from "./components/Home";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Xcrim from "./pages/Xcrim";
import Kixz from "./pages/Kixz";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";

function App() {


  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (header) {
        header.classList.toggle("scrolled", window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const sendVisitorInfo = async () => {
      try {
        const ipRes = await fetch('https://ipinfo.io/json?token=1b4df53e065721');
        const ipData = await ipRes.json();

        const browserData = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenSize: `${window.screen.width}x${window.screen.height}`,
        };

        const message = `
**New Visitor**
IP: ${ipData.ip}
City: ${ipData.city}
Region: ${ipData.region}
Country: ${ipData.country}
ISP: ${ipData.org}
Location (lat,long): ${ipData.loc}

User Agent: ${browserData.userAgent}
Language: ${browserData.language}
Screen: ${browserData.screenSize}
        `;

        await fetch('https://discord-share.drxckpro123-346.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });

      } catch (err) {
        console.error('Visitor info logging failed:', err);
      }
    };

    sendVisitorInfo();
  }, [])
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/xcrim" element={<Xcrim />} />
          <Route path="/kixz" element={<Kixz />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
