# Weather App

A weather forecast app built with Vue, TypeScript, and Vite. It uses the OpenWeatherMap API to show current weather and a 5-day forecast.

---

## What it does

- Detects your location on load and shows the current weather for where you are
- Lets you search for any city using the search page, which shows live suggestions as you type
- Tapping a suggestion takes you to a detail page with hourly and weekly forecasts
- You can save cities to a list on the home screen and remove them any time — the list persists across page refreshes
- Profile page with an edit form that validates your name, email, and phone number

---

## Tech stack

- Vue 3 with Composition API and `<script setup>`
- TypeScript with strict mode
- Vite for bundling and dev server
- Vue Router 4 for navigation (Detail and Search pages are lazy-loaded)
- Plain CSS with BEM naming and CSS custom properties
- OpenWeatherMap REST API (current weather, forecast, geocoding)
- Browser Geolocation API for auto-detecting the user's location
- localStorage API for persisting saved cities across sessions
- FontAwesome for icons

---

## Project structure

This project follows the Atomic Design methodology.

```
src/
  components/
    atoms/          Small, single-purpose components (BaseInput, BaseButton, SearchBar, AvatarImage)
    molecules/      Groups of atoms that work together (WeatherCard, HourlyCard, DailyForecastRow, SearchSuggestionItem)
    organisms/      Complex sections made of molecules (WeatherList, HourlyForecast, WeeklyForecast, ProfileForm)
    templates/      Page layout shell (MainLayout — provides max-width centering for all pages)
  pages/            Full pages wired to routes (HomePage, SearchPage, DetailPage, ProfilePage)
  composables/      Reusable logic (useWeather, useGeolocation)
  services/         API calls (weather.api.ts)
  store/            Global reactive state (weatherState.ts)
  types/            TypeScript interfaces and types (weather.types.ts)
  router/           Vue Router config (index.ts)
  style.css         Global CSS reset and design tokens
```

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/DHV28/weather-app
cd weather-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

Copy the example env file and add your OpenWeatherMap key:

```bash
cp .env.example .env
```

Then open `.env` and replace `your_api_key_here` with your actual key.
You can get a free key at https://openweathermap.org/api — the free tier is enough for this app.

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Other commands

```bash
npm run build      # Type-check and build for production
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint across all .ts and .vue files
npm run test       # Run all tests once
npm run test:watch # Run tests in watch mode (re-runs on file save)
```

---

## Tests

Tests are written with Vitest and Vue Test Utils. They cover:

- Form validation logic (required fields, email format, character limits, phone rules)
- `BaseInput` component (label rendering, value binding, error messages, emit behaviour)
- `WeatherCard` component (city name, temperature, My Location label, click events)
- `useGeolocation` composable (success path, unsupported browser, permission denied, error states)
- `weatherState` store (addCityCard, removeCityCard, setMyLocationCard, loading/error state, localStorage writes)
- `useWeather` composable (searchCity, fetchDetail, fetchDetailByCoords, addCurrentToList — API mocked)

To run them:

```bash
npm run test
```

---

## Architectural decisions

- **No Pinia** — state is managed with Vue's built-in `reactive()` in a singleton module (`store/weatherState.ts`). For an app this size it keeps things simple without the boilerplate of an external store library.
- **Geocoding before navigation** — the Search page uses OpenWeatherMap's Geocoding API to resolve city names to coordinates before navigating. This prevents the wrong city from loading when names are ambiguous (e.g. "Milan, IL" vs "Milan, Italy").
- **Composables for side effects** — geolocation and weather fetching live in `useGeolocation.ts` and `useWeather.ts` so pages stay thin and logic is reusable.
- **Lazy-loaded routes** — Detail, Search, and Profile pages are lazy-loaded so the initial bundle only includes the Home page.
- **BEM naming** — all CSS classes follow BEM (Block__Element--Modifier) so styles are scoped by component and easy to trace.

---

## Credits

- Weather background images from [Unsplash](https://unsplash.com)
- Profile avatar illustration from [Flaticon](https://www.flaticon.com)
- Weather icons from the OpenWeatherMap icon CDN
- UI icons from [FontAwesome](https://fontawesome.com)

---

## Notes

- The app is designed for a mobile screen width (430px). On desktop it stays centred and phone-sized, which matches the Figma designs.
- Weather icons come from OpenWeatherMap's icon CDN (`img/wn/{icon}@4x.png`).
- City search uses OpenWeatherMap's Geocoding API (`/geo/1.0/direct`) so users get a list of matching cities before navigating to the detail page. This avoids loading the wrong city when names are ambiguous (e.g. Milan, Italy vs Milan, IL).
- The `.env` file is in `.gitignore` so the API key is never committed.
- On load, the app requests the browser's Geolocation API to show a "My Location" card automatically. If location access is denied, the app falls back gracefully and lets the user search manually instead. On Mac, location relies on WiFi positioning — if it fails, allow location access in System Settings → Privacy & Security → Location Services for your browser, then refresh.
