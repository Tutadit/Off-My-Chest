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
  size: 130,
  minSize: 44,
  gutter: 18,
  provideProps: true,
  numCols: 3,
  fringeWidth: 100,
  yRadius: 190,
  xRadius: 100,
  cornerRadius: 100,
  showGuides: false,
  compact: true,
  gravitation: 3,
};

const audios_options = {
  size: 130,
  minSize: 44,
  gutter: 18,
  provideProps: true,
  numCols: 3,
  fringeWidth: 100,
  yRadius: 190,
  xRadius: 100,
  cornerRadius: 100,
  showGuides: false,
  compact: true,
  gravitation: 3,
};

const Bubbles = ({ children, prefix, options }) => {
  const [stop, setStop] = useState(false);

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
  let { pathname } = useLocation();

  let back = pathname.split("/").slice(0, -1).join("/");
  if (back === "") back = "/";

  let path = pathname === "/" ? "" : pathname.substring(1);
  let { category } = useParams();

  const { categories, audios, loading } = useBubbles(decodeURI(path));

  if (loading) return <Loading />;

  return (
    <>
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
        {categories.length > 0 && (
          <div className="categories">
            <Bubbles
              children={categories}
              prefix={path}
              options={category_options}
            />
          </div>
        )}
        {audios.length > 0 && (
          <div className="audios">
            <Bubbles children={audios} prefix={path} options={audios_options} />
          </div>
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
