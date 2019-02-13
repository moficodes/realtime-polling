import React from "react";
import Loader from "react-loader-spinner";

const SpinLoader = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)"
      }}
    >
      <Loader type="Puff" color="#00BFFF" height="100" width="100" />
    </div>
  );
};

export { SpinLoader };
