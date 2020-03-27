import React, { useState } from "react";
import { useImmer } from "use-immer";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import PngMqttCar from "../img/mqtt-car.png";

export default {
  title: "SensorDetailPage",
  component: SensorDetailPage
};

export function SensorDetailPage() {
  const [currentReading, setCurrentReading] = useState("80.78");

  const [actionLog, updateActionLog] = useImmer([]);

  function logAction(device, distance) {
    updateActionLog(draft => {
      draft.unshift({
        timestamp: new Date().toLocaleString(),
        message: `move ${device} forward ${distance} cm`
      });
    });
  }

  return (
    <div className="grid grid-cols-10">
      <div className="flex flex-col col-start-2 col-end-10">
        <div>
          <h2 className="text-2xl">Current reading</h2>
          <div
            className={
              "flex w-full h-full justify-center font-mono text-black text-6xl border-black border-4 p-4 rounded-lg mt-2"
            }
          >
            <div className="mr-2 ">{currentReading}</div>
            <div className="mr-2 font-bold">cm</div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl">Available actions</h2>
          <div className="flex flex-col p-4 mt-2 border rounded-sm">
            <div className="grid grid-cols-4">
              <div className="font-bold">Device</div>
              <div className="font-bold">Client Username</div>
              <div className="font-bold">Action</div>
            </div>
            <div className="grid items-center grid-cols-4 mt-2">
              <img src={PngMqttCar} width={"100px"} />
              <div className="text-xl text-gray-800">solly-mobile</div>
              <div className="text-gray-800 text-md">
                move car forward by the current reading's distance
              </div>
              <div className="flex justify-center">
                <button
                  class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => logAction("solly-mobile", currentReading)}
                >
                  ISSUE COMMAND
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl">Action log</h2>
          <div className="w-full h-64 mt-2">
            <div className="grid grid-cols-4">
              <div className="font-bold">Time</div>
              <div className="col-span-3 font-bold">Action</div>
            </div>
            <AutoSizer>
              {({ height, width }) => (
                <List
                  className="List"
                  height={height}
                  itemCount={actionLog.length}
                  itemData={actionLog}
                  itemSize={35}
                  width={width}
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ index, data, style }) {
  let item = data[index];
  return (
    <div
      className={`grid grid-cols-4 items-center px-2 ${
        index % 2 ? "bg-gray-200" : "bg-transparent"
      } `}
      style={style}
    >
      <div>{item.timestamp}</div>
      <div className="col-span-3">{item.message}</div>
    </div>
  );
}
