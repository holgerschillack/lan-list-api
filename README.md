# lan-list-api

## Installation

- Use Node 14, e.g. 14.18.1 (check via `node -v`)
- run `npm install`
- run `npm start`

## Description

- is a Node JS Express based API
- works with `https` or `http`
- it refreshed the local network device list every 5 min via a cron job
- has two API-Routes:
  - GET `api/devices` to pull current in memory network device list (~10ms)
  - GET `api/refresh` to refresh list and afterwards get current in network device list (~1-5s)
- is used as backend for the `lan-list-client`

## Configuration

- port can be configured: `PORT`
- internal refresh Interval for devices can be configured as cron time: `REFRESH_INTERVAL`
- if you use `https` you have to add a your certificate/key in `/src/cert`
