import React from "react";
import "./Home.css";
import Projects from "./Projects";
import Contact from "./Contact";

function Home() {
  return (
    <div className="Home">
      <section id="home" className="section">
        <div className="home-container">
          <div className="content">
            <h2>About Me</h2>
            <p>
              As an experienced programmer mainly for Roblox, with over 6 years of experience, I specialize in creating complex performance-friendly systems and more. My goal is to always deliver the best quality work for my clients.
            </p>
          </div>
        </div>
      </section>
      <Projects />
      <Contact />
    </div>
  );
}

export default Home;
