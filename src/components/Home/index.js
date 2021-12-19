import React, { useState } from "react";

import { useParams, useLocation, Routes, Route, Link } from "react-router-dom";

import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";

import { BiArrowBack } from "react-icons/bi";

import Bubble from "../Bubble";

import { getBubbles } from "../../database";

import "./index.css";

const options = {
  size: 180,
  minSize: 20,
  gutter: 18,
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
  const [stop, setStop] = useState(false);

  let { category } = useParams();
  let { pathname } = useLocation();

  let back = pathname.split("/").slice(0, -1).join("/");
  if (back === "") back = "/";

  let path = pathname === "/" ? "" : pathname.substring(1);

  const bubbles = getBubbles(path).map((bubble, i) => (
    <Bubble
      key={i}
      stop={stop}
      setStop={setStop}
      data={bubble}
      prefix={category}
    />
  ));

  return (
    <div className="home">
      <Routes>
        <Route
          path={`/`}
          element={
            <>
              <div className="header">
                {!category ? (
                  <h1>Off My Chest</h1>
                ) : (
                  <>
                    <Link to={back}>
                      <BiArrowBack />
                    </Link>
                    <h1>{category.replaceAll("_", " ")}</h1>
                  </>
                )}
              </div>
              <BubbleUI options={options} className="bubbles">
                {bubbles}
              </BubbleUI>
            </>
          }
        />
        <Route path={`:category/*`} element={<Home />} />
      </Routes>
    </div>
  );
};

export default Home;
