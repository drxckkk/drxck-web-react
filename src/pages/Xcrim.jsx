import "./Xcrim.css";

import { Link } from "react-router-dom";
import xcrimImage from "../assets/xcrim.jpg";

function Xcrim() {
    return (
        <img src={xcrimImage} alt="Xcrim Project" className="project-detail-image" />
    );
}

export default Xcrim;
