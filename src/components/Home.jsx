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
            <h2>Hey, I'm Drxck!</h2>
            <p>
              With over 6 years of experience as a dedicated programmer, I specialize in making performance-friendly, complex systems and engaging user experiences. My passion lies in bringing complex ideas into elegant, efficient code, always looking forward to delivering quality for my clients.
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
