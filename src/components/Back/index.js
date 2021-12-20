import { useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

import './index.css'

const Back = () => {
    let navigate = useNavigate();
    return (
        <button className="back-btn" onClick={() => navigate(-1)}>
            <BiArrowBack />
        </button>
    )
}

export default Back