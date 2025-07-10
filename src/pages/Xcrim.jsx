import "./Xcrim.css";

import { Link } from "react-router-dom";
import xcrimImage from "../assets/xcrim.jpg";

function Xcrim() {
    return (
        <section className="xcrim-container">
            <div className="project-detail-content">
                <h2>Xcrim - Roblox Game Development</h2>
                <img src={xcrimImage} alt="Xcrim Project" className="project-detail-image" />
                <p>
                    Xcrim is a comprehensive Roblox game development project where I focused on creating a robust and engaging experience for players. This involved designing intricate game mechanics, optimizing performance for a smooth user experience, and implementing a scalable architecture to support future updates.
                </p>
                <p>
                    Key features include:
                </p>
                <ul>
                    <li>Advanced character control systems</li>
                    <li>Dynamic environment interactions</li>
                    <li>Server-side logic for secure gameplay</li>
                    <li>Custom UI/UX design</li>
                </ul>
                <p className="tech-stack"><strong>Tech Stack:</strong> Lua, Roblox Studio, Git</p>
                <a href="https://github.com/yourusername/xcrim-game" target="_blank" rel="noopener noreferrer" className="project-detail-link">View on GitHub</a>
                <Link to="/projects" className="back-to-projects">Back to Projects</Link>
            </div>
        </section>
    );
}

export default Xcrim;
