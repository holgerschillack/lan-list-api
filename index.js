const find = require("local-devices");
const express = require("express");
const app = express();
const cors = require("cors");
const CronJob = require("cron").CronJob;

// Settings
const PORT = 4100;
const REFRESH_INTERVAL = "00 */5 * * * *";

global.devices = [];

function refreshDevices() {
  console.log("Refreshing device list...");
  return new Promise((resolve, reject) => {
    find()
      .then((devList) => {
        devices = parseDevices(devList);
        console.log(new Date(), "Done.");
        resolve(true);
      })
      .catch((err) => reject(err));
  });
}

function parseDevices(list) {
  const parsedDevices = [];
  list.forEach((dev) => {
    console.log(dev);
    parsedDevices.push({
      ip: dev.ip,
      mac: dev.mac,
      name:
        dev.name === "?"
          ? "Unbekannt / Apple-Gerät / Sonstiges"
          : toTitleCase(dev.name.replace(".fritz.box", "")),
      link: dev.name,
    });
  });
  return parsedDevices;
}

app.use(cors());

app.get("/", (req, res) => {
  res.send("Lan-List API, request /api/devices for device list.");
});

app.get("/api/devices", (req, res) => {
  res.json(devices);
});

app.get("/api/refresh", (req, res) => {
  refreshDevices()
    .then(() => {
      res.json(devices);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Lan List API started on port ${PORT}`);
});

const job = new CronJob(REFRESH_INTERVAL, function () {
  refreshDevices();
});

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s|\/|\-)\w/g, function (match) {
    return match.toUpperCase();
  });
}

refreshDevices();
job.start();
