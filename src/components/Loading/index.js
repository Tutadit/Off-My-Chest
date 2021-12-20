import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import "./index.css";

const Loading = () => {
  return (
    <div className="loading">
      <Loader
        className="loader"
        type="MutatingDots"
        color="rgb(10, 129, 107)"
        secondaryColor="rgb(8, 12, 11)"
        height={100}
        width={100}
      />
    </div>
  );
};

export default Loading;
