import React, { useState } from "react";

import { useParams, useLocation, Routes, Route } from "react-router-dom";

import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";

import Bubble from "../Bubble";
import Loading from "../Loading";
import Back from "../Back";
import { useBubbles } from "../../database";

import "./index.css";

const category_options = {
  size: 180,
  minSize: 20,
  gutter: 8,
  provideProps: true,
  numCols: 5,
  fringeWidth: 160,
  yRadius: 130,
  xRadius: 220,
  cornerRadius: 50,
  showGuides: false,
  compact: true,
  gravitation: 5
};

const audios_options = {
  size: 180,
  minSize: 20,
  gutter: 8,
  provideProps: true,
  numCols: 5,
  fringeWidth: 160,
  yRadius: 130,
  xRadius: 220,
  cornerRadius: 50,
  showGuides: false,
  compact: true,
  gravitation: 5
};

const Bubbles = ({ children, prefix, options, stop, setStop }) => {
  const bubbles = children.map((bubble, i) => (
    <Bubble
      key={bubble.pid}
      stop={stop}
      setStop={setStop}
      data={bubble}
      prefix={prefix}
    />
  ));

  return (
    <BubbleUI options={options} className="bubbles">
      {bubbles}
    </BubbleUI>
  );
};

const HomePage = () => {
  const [stop, setStop] = useState(false);

  let { pathname } = useLocation();
  const [showAllCategories, setShowAllCategories] = useState(false);

  let back = pathname.split("/").slice(0, -1).join("/");
  if (back === "") back = "/";

  let path = pathname === "/" ? "" : pathname.substring(1);
  let { category } = useParams();
  const { categories, audios, loading } = useBubbles(
    decodeURI(path),
    showAllCategories
  );

  return (
    <>
      <button
        className="switch"
        onClick={() => setShowAllCategories((prev) => !prev)}
      >
        {showAllCategories
          ? "Show categories with audios"
          : "Show all categories"}
      </button>
      <div className="header">
        {!category ? (
          <h1>Off My Chest</h1>
        ) : (
          <>
            <Back />
            <h1>{category}</h1>
          </>
        )}
      </div>
      <div className="content">
        {loading ? (
          <Loading />
        ) : (
          <>
            {categories.length > 0 && (
              <div class="bubbles-wrapper">
                <h1>Categories</h1>
                <div className="categories">
                  <Bubbles
                    children={categories}
                    prefix={path}
                    options={category_options}
                    stop={stop}
                    setStop={setStop}
                  />
                </div>
              </div>
            )}
            {audios.length > 0 && (
              <div class="bubbles-wrapper">
                <h1>Posts</h1>
                <div className="audios">
                  <Bubbles
                    children={audios}
                    prefix={path}
                    options={audios_options}
                    stop={stop}
                    setStop={setStop}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const Home = () => {
  return (
    <div className="home">
      <Routes>
        <Route path={`/*`} element={<HomePage />} />
        <Route path={`:category/*`} element={<Home />} />
      </Routes>
    </div>
  );
};

export default Home;
