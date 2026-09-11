import DotField from "../components/DotField";
import xcrimImage from "../assets/xcrim.jpg";
import "./Xcrim.css";

function Xcrim() {
  return (
    <>
      <DotField />
      <img src={xcrimImage} alt="Xcrim Project" className="project-detail-image" />
    </>
  );
}

export default Xcrim;
