import React from "react";
import SvgSolaceLogoGreen from "../img/SvgSolaceLogoGreen";

export default {
  title: "HeaderLogos",
  component: HeaderLogos
};

export const HeaderLogos = () => (
  <div className="flex">
    {/* component start  */}
    <div className="flex flex-col items-center w-auto">
      <SvgSolaceLogoGreen width="100px" />
    </div>
  </div>
);
