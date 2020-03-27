import React, { useState, useEffect } from "react";
import { env } from "../clients/clients.config";
import { useImmer } from "use-immer";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { MdArrowBack } from "react-icons/md";
import PngMqttCar from "../../img/mqtt-car.png";
import PngProximitySensor from "../../img/proximity-sensor.png";

function DeviceDetailPage({ device, mqttClient, updateState }) {
  if (device.type == "solly-mobile") {
    return <SollyMobileDetailPage device={device} updateState={updateState} />;
  }
  if (device.type == "proximity-sensor") {
    return (
      <ProximitySensorDetailPage
        device={device}
        mqttClient={mqttClient}
        updateState={updateState}
      />
    );
  }

  if (device.type == "mgmt-dashboard") {
    return <SollyMobileDetailPage device={device} updateState={updateState} />;
  }

  return <div>Unknown device — reload page</div>;
}

function SollyMobileDetailPage({ device, updateState }) {
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
    <React.Fragment>
      <div className="flex items-center h-16 px-4 text-xl border-b-2">
        <button
          className="mr-2"
          onClick={() =>
            updateState(draft => {
              draft.currentDevice = null;
            })
          }
        >
          <MdArrowBack size="2rem" />
        </button>
        <div className="mr-2">Device > {device.type}</div>
        <img
          src={device.type == "solly-mobile" ? PngMqttCar : PngProximitySensor}
          width="50px"
          className="mr-2"
        />
        <div> id: {device.device["clientId"]}</div>
      </div>
      <div className="Flex">not implemented yet</div>
    </React.Fragment>
  );
}

function ProximitySensorDetailPage({ device, mqttClient, updateState }) {
  const [currentReading, setCurrentReading] = useState(null);
  const [actionLog, updateActionLog] = useImmer([]);

  /**
   * configure MQTT client to respond to sensor readings
   */
  useEffect(() => {
    async function setupSubscription() {
      // add event handlers to the mqtt client
      try {
        await mqttClient.addEventHandler(
          // https://docs.solace.com/System-and-Software-Maintenance/Subscribing-to-MBus-Events.htm#subscribing_to_message_bus_events_1651767527_308172
          // SYS/LOG/INFO/CLIENT/<router-name>/<eventName>/<vpnName>/<clientName>
          "SOLACE/DISTANCE/MEASUREMENT",
          // define callback that is triggered when messages are received on specified topic
          function updateDistance({ topic, message }) {
            let payload = JSON.parse(message.toString());
            setCurrentReading(parseFloat(payload.cm));
          },
          1 // qos
        );
      } catch (err) {
        console.error(err);
      }
    }

    setupSubscription();
  }, []);

  async function sendCommand(device, distance) {
    // send command
    await mqttClient.send(
      `car/drive/${env.ARDUINO_CHIP_ID}`,
      {
        l: 100,
        r: 100,
        d: Math.floor(currentReading * 10)
      },
      1 // qos
    );
    // log action
    updateActionLog(draft => {
      draft.unshift({
        timestamp: new Date().toLocaleString(),
        message: `move ${device} forward ${distance} cm`
      });
    });
  }

  return (
    <React.Fragment>
      <div className="flex items-center h-16 px-4 text-xl border-b-2">
        <button
          className="mr-2"
          onClick={() =>
            updateState(draft => {
              draft.currentDevice = null;
            })
          }
        >
          <MdArrowBack size="2rem" />
        </button>
        <div className="mr-2">Device > {device.type}</div>
        <img
          src={device.type == "solly-mobile" ? PngMqttCar : PngProximitySensor}
          width="50px"
          className="mr-2"
        />
        <div> id: {device.device["clientId"]}</div>
      </div>
      <div className="grid grid-cols-10">
        <div className="flex flex-col col-start-2 col-end-10">
          <div>
            <h2 className="text-2xl">Current reading</h2>
            <div
              className={
                "flex w-full h-full justify-center font-mono text-black text-6xl border-black border-4 p-4 rounded-lg mt-2"
              }
            >
              {currentReading ? (
                <React.Fragment>
                  <div className="mr-2 ">{currentReading}</div>
                  <div className="mr-2 font-bold">cm</div>
                </React.Fragment>
              ) : (
                <div>N/A</div>
              )}
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
                    className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
                    onClick={() => sendCommand("solly-mobile", currentReading)}
                  >
                    ISSUE COMMAND
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl">Action log</h2>
            <div className="w-full h-64 p-4 mt-2 border rounded-sm">
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
                    {ActionLogRow}
                  </List>
                )}
              </AutoSizer>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

function ActionLogRow({ index, data, style }) {
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

export default DeviceDetailPage;
