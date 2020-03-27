import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import PngMqttCar from "../img/mqtt-car.png";

export default {
  title: "LandingPage",
  component: LandingPage
};

export function LandingPage() {
  const [currentReading, setCurrentReading] = useState("80.78");
  const [deviceList, updateDeviceList] = useImmer([]);
  const [actionLog, updateActionLog] = useImmer([]);

  function logDisconnectEvent(device, distance) {
    updateActionLog(draft => {
      draft.unshift({
        timestamp: new Date().toLocaleString(),
        message: `move ${device} forward ${distance} cm`
      });
    });
  }

  useEffect(() => {}, []);

  return (
    <div className="grid grid-cols-10">
      <div className="flex flex-col col-start-2 col-end-10">
        <div className="mt-4">
          <h2 className="text-2xl">Devices</h2>
          <div className="flex flex-col p-4 mt-2 border rounded-sm">
            <div className="grid grid-cols-4">
              <div className="font-bold">Device</div>
              <div className="font-bold">Client Username</div>
              <div className="font-bold">Client ID</div>
              <div className="font-bold">Connected since</div>
            </div>
            <div style={{ height: "350px" }}>
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
                    {DeviceRow}
                  </List>
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl">Client Disconnect Event Log</h2>
          <div className="w-full p-4 mt-2 border rounded-sm">
            <div className="grid grid-cols-4">
              <div className="font-bold">Time</div>
              <div className="font-bold">Client Username</div>
              <div className="font-bold">Client ID</div>
              <div className="font-bold"></div>
            </div>
            <div style={{ height: "350px" }}>
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
                    {EventLogRow}
                  </List>
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeviceRow({ index, data, style }) {
  let item = data[index];
  return (
    <div className="grid items-center grid-cols-4 mt-2">
      <img src={PngMqttCar} width={"100px"} />
      <div className="text-xl text-gray-800">solly-mobile</div>
      <div className="text-gray-800 text-md">#MQTT/solly-mobile/1231283</div>
      <div className="flex justify-center"></div>
    </div>
  );
}

function EventLogRow({ index, data, style }) {
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
