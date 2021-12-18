import React from "react";

import BubbleUI from "react-bubble-ui";
import "react-bubble-ui/dist/index.css";

import Bubble from "../Bubble";

import { getBubbles } from "../../database"

import "./index.css";

const options = {
  size: 180,
  minSize: 20,
  gutter: 8,
  provideProps: true,
  numCols: 10,
  fringeWidth: 160,
  yRadius: 190,
  xRadius: 300,
  cornerRadius: 100,
  showGuides: false,
  compact: true,
  gravitation: 3,
};

const Home = () => {

  const bubbles = getBubbles().map((bubble, i) => (
    <Bubble key={i} data={bubble} />
  ));

  return (
    <div className="home">
      <BubbleUI options={options} className="bubbles">
        {bubbles}
      </BubbleUI>
    </div>
  );
};

export default Home;
