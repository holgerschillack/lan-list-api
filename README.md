# lan-list-api

## Installation

- Use Node 14, e.g. 14.18.1 (check via `node -v`)
- run `npm install`
- run `npm start` or start as forever-service with e.g. `pm2`

## Description

- it's a Node JS Express based API
- it refreshes the local network device list every 5 min via a cron job
- has two API-Routes:
  - GET `api/devices` to pull current in memory network device list (~10ms)
  - GET `api/refresh` to refresh list and afterwards get current in network device list (~1-5s)
- is used as backend for the `lan-list-client` [link]
- could easily be used with SSL, but intended use case is local network

## Configuration

- port can be configured: `PORT`
- internal refresh Interval for devices can be configured as cron time: `REFRESH_INTERVAL`

### [Corresponding Client Link](https://github.com/holgerschillack/lan-list-client)