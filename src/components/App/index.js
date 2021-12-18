import './index.css';

import { Routes, Route } from "react-router-dom";
import Home from "../Home"
import Audio from "../Audio"

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="audio/:audioID" element={<Audio />} />
      </Routes>
    </div>
  );
}

export default App;
