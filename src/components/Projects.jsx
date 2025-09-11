import React from "react";
import "./Projects.css";
import video1Src from "../assets/project1.mp4";
import video2Src from "../assets/project2.mp4";
import video3Src from "../assets/project3.mp4";
function Projects() {
    const handleMouseEnter = (event) => {
        const video = event.currentTarget.querySelector("video");
        if (video) {
            video.play();
        }
    };

    const handleMouseLeave = (event) => {
        const video = event.currentTarget.querySelector("video");
        if (video) {
            video.pause();
        }
    };

    return (
        <section id="projects" class="projects-container">
            <h2 class="title">Recent Projects</h2>
            <p class="project-description"> Showcase of some my recent projects.</p>
            <div class="project-container">
                <div className="project" id="project1"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <div className="project-content">
                        <p className="project-title">Vehicle System</p>
                        <p className="project-description">A simple car system that utilizes Raycast and BodyForces for a smooth driving experience.</p>
                        <p className="project-detail"><i>Lines of Code: 1,500</i></p>
                        <p className="project-detail"><i>Price: $100</i></p>
                        <p className="project-detail"><i>Time to Complete: 5 Days</i></p>
                    </div>
                    <video loop muted className="fade-in" width="100%">
                        <source src={video1Src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="project" id="project2"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <div className="project-content">
                        <p className="project-title">Orb System</p>
                        <p className="project-description">A heavily optimized orb system with custom physics and object pooling.</p>
                        <p className="project-detail"><i>Lines of Code: 600</i></p>
                        <p className="project-detail"><i>Price: $30</i></p>
                        <p className="project-detail"><i>Time to Complete: 48 Hours</i></p>
                    </div>
                    <video loop muted className="fade-in" width="100%">
                        <source src={video2Src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="project" id="project3"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <div className="project-content">
                        <p className="project-title">Jump For UGC Game</p>
                        <p className="project-description">A short showcase of a commissioned game.</p>
                        <p className="project-detail"><i>Lines of Code: 1,000</i></p>
                        <p className="project-detail"><i>Price: $300</i></p>
                        <p className="project-detail"><i>Time to Complete: 5 Days</i></p>
                    </div>
                    <video loop muted className="fade-in" width="100%">
                        <source src={video3Src} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </section>
    );
}

export default Projects;
