import "./Kixz.css";

import { Link } from "react-router-dom";
import kixzImage from "../assets/kixz.png";

function Kixz() {
    return (
        <section className="kixz-container">
            <div className="project-detail-content">
                <h2>Kixz - Roblox Game Development</h2>
                <img src={kixzImage} alt="Kixz Project" className="project-detail-image" />
                <p>
                    Kixz was a challenging and rewarding Roblox game development project focused on creating a unique and engaging experience. I was responsible for developing core gameplay mechanics, optimizing performance, and ensuring a smooth and enjoyable user experience.
                </p>
                <p>
                    Key features include:
                </p>
                <ul>
                    <li>Innovative game loop design</li>
                    <li>Efficient data handling and storage</li>
                    <li>Interactive world elements</li>
                    <li>Responsive UI for various devices</li>
                </ul>
                <p className="tech-stack"><strong>Tech Stack:</strong> Lua, Roblox Studio, Git</p>
                <a href="https://github.com/yourusername/kixz-game" target="_blank" rel="noopener noreferrer" className="project-detail-link">View on GitHub</a>
                <Link to="/projects" className="back-to-projects">Back to Projects</Link>
            </div>
        </section>
    );
}

export default Kixz;
