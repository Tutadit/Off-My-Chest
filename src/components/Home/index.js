import React from "react";

import { useParams, useLocation, Routes, Route } from "react-router-dom";

import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";

import Bubble from "../Bubble";

import { getBubbles } from "../../database";

import "./index.css";

const options = {
  size: 180,
  minSize: 20,
  gutter: 8,
  provideProps: true,
  numCols: 6,
  fringeWidth: 160,
  yRadius: 190,
  xRadius: 300,
  cornerRadius: 100,
  showGuides: false,
  compact: true,
  gravitation: 3,
};

const Home = () => {
  let { category } = useParams();
  let { pathname } = useLocation();      

  

  let path = pathname === "/" ? "" : pathname.substring(1)
  const bubbles = getBubbles(path).map((bubble, i) => (
    <Bubble key={i} data={bubble} prefix={category} />
  ));

  return (
    <div className="home">
      <Routes>
        <Route
          path={`/`}
          element={
            <BubbleUI options={options} className="bubbles">
              {bubbles}
            </BubbleUI>
          }
        />
        <Route path={`:category/*`} element={<Home />} />
      </Routes>
    </div>
  );
};

export default Home;
