import React from "react";

const CircularLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-white-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default CircularLoader;
