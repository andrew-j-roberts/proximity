import React from "react";
import SvgSolaceLogoGreen from "../img/SvgSolaceLogoGreen";

export default {
  title: "Layout",
  component: Layout
};

export const Layout = () => (
  <div className="grid w-screen h-screen grid-cols-10">
    <div className="col-span-2">
      <div className="flex flex-col items-center p-4">
        <SvgSolaceLogoGreen width="100px" />
      </div>
    </div>
    <div className="flex flex-col col-span-8">
      <div className="flex items-center h-16 px-4 text-xl border-b-2">
        page title
      </div>
      <div className="flex flex-col px-4 overflow-scroll">content</div>
    </div>
  </div>
);
