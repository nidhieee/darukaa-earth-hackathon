# Frontend Web

- Code lives in `web/`.
- Framework: React (built with Vite)
- Libraries: Mapbox GL JS, mapbox-gl-draw, Chart.js, react-router-dom, axios

## Structure Actually Built
- `src/main.jsx`, `src/App.jsx`, `src/index.css`: Entry point, routing, and global styles
- `src/api/`: API wrapper (`client.js`, `auth.js`, `projects.js`, `sites.js`)
- `src/context/AuthContext.jsx`: Global authentication state manager
- `src/components/auth/ProtectedRoute.jsx`: Route guard
- `src/components/map/MapView.jsx`: Mapbox GL JS map with drawing controls
- `src/components/dashboard/SiteChart.jsx`: Chart.js line chart for site analytics
- `src/components/shared/HealthBadge.jsx`: Status indicator pill
- `src/pages/`:
  - `Login.jsx` & `Register.jsx`: Auth forms
  - `Dashboard.jsx`: Project listing and creation
  - `ProjectMap.jsx`: Map view for a specific project
  - `SiteDetail.jsx`: Site analytics and details

## Running Locally
To run locally, run `npm run dev` from the `web/` directory.
