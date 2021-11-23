const find = require("local-devices");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 4100;
const SimpleNodeLogger = require("simple-node-logger"),
  opts = {
    timestampFormat: "YYYY-MM-DD HH:mm:ss",
  },
  log = SimpleNodeLogger.createSimpleLogger(opts);
const CronJob = require("cron").CronJob;

global.devices = [];

function refreshDevices() {
  log.info("Refreshing device list...");
  return new Promise((resolve, reject) => {
    find()
      .then((devList) => {
        devices = parseDevices(devList);
        resolve(true);
      })
      .catch((err) => reject(err));
  });
}

function parseDevices(list) {
  const parsedDevices = [];
  list.forEach((dev) => {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const job = new CronJob("00 */5 * * * *", function () {
  refreshDevices();
});

function toTitleCase(str) {
  return str.toLowerCase().replace(/(?:^|\s|\/|\-)\w/g, function (match) {
    return match.toUpperCase();
  });
}

refreshDevices();
job.start();
