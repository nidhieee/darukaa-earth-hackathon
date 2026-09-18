import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useNavigate } from "react-router-dom";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView({
  sites,
  onSiteDrawn,
  disableInteractions = false,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = TOKEN;

    let center = [78.9629, 20.5937]; // India default
    if (sites && sites.length > 0 && sites[0].geom) {
      const coords = sites[0].geom.coordinates[0][0];
      if (coords && coords.length === 2) {
        center = coords;
      }
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center,
      zoom: 12,
      interactive: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    if (onSiteDrawn) {
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      });
      map.current.addControl(draw.current);

      map.current.on("draw.create", (e) => {
        const geojson = e.features[0].geometry;
        onSiteDrawn(geojson);
        draw.current.deleteAll();
      });
    }

    map.current.on("load", () => {
      // Map is loaded, we can now safely render
      setMapLoaded(true);
    });
  }, []);

  const [mapLoaded, setMapLoaded] = useState(false);
  const activeSources = useRef([]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear previously added sources/layers
    activeSources.current.forEach((sourceId) => {
      if (map.current.getLayer(`${sourceId}-fill`)) {
        map.current.removeLayer(`${sourceId}-fill`);
      }
      if (map.current.getLayer(`${sourceId}-outline`)) {
        map.current.removeLayer(`${sourceId}-outline`);
      }
      if (map.current.getSource(sourceId)) {
        map.current.removeSource(sourceId);
      }
    });
    activeSources.current = [];

    if (!sites || sites.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let hasBounds = false;

    sites.forEach((site) => {
      if (!site.geom) return;

      let color = "#facc15";
      if (site.health_score === "green") color = "#22c55e";
      if (site.health_score === "red") color = "#ef4444";

      const sourceId = `site-${site.id}-source`;
      const fillLayerId = `site-${site.id}-fill`;
      const outlineLayerId = `site-${site.id}-outline`;

      map.current.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { id: site.id, name: site.name, color },
          geometry: site.geom,
        },
      });

      activeSources.current.push(sourceId);

      map.current.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": color,
          "fill-opacity": 0.6,
        },
      });

      map.current.addLayer({
        id: outlineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
        },
      });

      map.current.on("click", fillLayerId, (e) => {
        const props = e.features[0].properties;
        navigate(`/sites/${props.id}`);
      });

      map.current.on("mouseenter", fillLayerId, () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", fillLayerId, () => {
        map.current.getCanvas().style.cursor = "";
      });

      if (site.geom.type === "Polygon") {
        site.geom.coordinates[0].forEach((coord) => {
          bounds.extend(coord);
          hasBounds = true;
        });
      }
    });

    if (hasBounds) {
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [sites, mapLoaded]);

  return <div ref={mapContainer} className="map-container" />;
}
