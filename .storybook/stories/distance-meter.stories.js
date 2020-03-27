import React from "react";

export default {
  title: "DistanceMeter",
  component: DistanceMeter
};

export const DistanceMeter = () => (
  <div className="flex items-center justify-center">
    <div
      className={
        "flex font-mono text-black text-6xl border-black border-4 p-4 rounded-lg"
      }
    >
      <div className="mr-2 ">80</div>
      <div className="mr-2 font-bold">cm</div>
    </div>
  </div>
);
