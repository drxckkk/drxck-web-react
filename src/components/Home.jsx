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
            <h2 class="title">I am Drxck,</h2>
            <p>
              with over 6 years of experience as a dedicated programmer, I'm confident in making performance-friendly, complex systems and attractive player experiences. 
              My passion lies in bringing your projects into elegant, efficient code, always looking forward to delivering quality for my clients.
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
