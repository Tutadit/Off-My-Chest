import "./index.css";

import { AiFillPlusCircle } from "react-icons/ai";

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "../Home";
import Audio from "../Audio";
import NewPost from "../NewPost";

const App = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  return (
    <div className="App">
      <Routes>        
        <Route path="audio_detail/:audioID" element={<Audio />} />
        <Route path="submit" element={<NewPost />} />
        <Route path="/*" element={<Home />} />
        <Route path="/:category/*" element={<Home />} />
      </Routes>
        <button
          onClick={() => navigate(pathname === "/submit" ? -1 : '/submit')}
          className="btn-new"
          style={{
            transform: pathname === "/submit" ? "rotate(45deg)" : "rotate(0)",
          }}
        >
          <AiFillPlusCircle />
        </button>
    </div>
  );
};

export default App;
