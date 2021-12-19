import './index.css';

import { Routes, Route } from "react-router-dom";
import Home from "../Home"
import Audio from "../Audio"

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="audio_detail/:audioID" element={<Audio />} />
        <Route path="/:category/*" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
