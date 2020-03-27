import React from "react";

export default {
  title: "Button",
  component: Button
};

export const Button = () => (
  <div className="flex items-center justify-center p-64">
    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
      ISSUE COMMAND
    </button>
  </div>
);
