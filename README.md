# TripShare

Explore. Plan. Experience.

TripShare is a travel discovery and planning application. It helps travelers browse destinations, review weather and currency information, save places, and assemble trip itineraries.

## Features

- Destination search and region filters from a public countries catalog (CORS-enabled)
- Country details with maps, languages, currencies, and coordinates
- Current weather and a seven-day forecast from Open-Meteo
- Currency conversion with the Frankfurter exchange rate API
- Travel budget calculator with cost breakdowns
- Trip planner with day-by-day itineraries stored on the device
- Wishlist persistence in local storage
- Light and dark themes

## Requirements

- Node.js 22.12 or later
- npm 10 or later

## Setup

```bash
npm install
```

## Development server

```bash
npm start
```

Open `http://localhost:4200/`.

## Production build

```bash
npm run build
```

Build output is written to `dist/`.

## Tests

```bash
npm test
```

## Architecture

The application uses standalone Angular components, lazy-loaded feature routes, Signals for UI and client state, and RxJS for HTTP and search streams. Public APIs are accessed through dedicated services; trip and wishlist data are stored through a local storage abstraction.
