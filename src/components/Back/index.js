import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

import "./index.css";

const Back = ({ plain }) => {
  let navigate = useNavigate();
  return (
    <button
      className={" back-btn" + (plain ? " plain" : "")}
      onClick={() => navigate(-1)}
    >
      <BiArrowBack />
    </button>
  );
};

export default Back;
