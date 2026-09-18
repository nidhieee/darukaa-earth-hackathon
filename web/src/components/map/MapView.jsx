import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useNavigate } from 'react-router-dom';

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapView({ sites, onSiteDrawn, disableInteractions = false }) {
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
      style: 'mapbox://styles/mapbox/satellite-v9',
      center,
      zoom: disableInteractions ? 14 : 12,
      interactive: !disableInteractions
    });

    if (!disableInteractions) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      if (onSiteDrawn) {
        draw.current = new MapboxDraw({
          displayControlsDefault: false,
          controls: {
            polygon: true,
            trash: true
          }
        });
        map.current.addControl(draw.current);

        map.current.on('draw.create', (e) => {
          const geojson = e.features[0].geometry;
          onSiteDrawn(geojson);
          draw.current.deleteAll();
        });
      }
    }

    map.current.on('load', () => {
      renderSites();
    });
    
  }, []);

  const renderSites = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    if (map.current.getSource('sites')) {
      map.current.removeLayer('sites-fill');
      map.current.removeLayer('sites-outline');
      map.current.removeSource('sites');
    }

    if (!sites || sites.length === 0) return;

    const features = sites.map(site => {
      let color = '#facc15'; 
      if (site.health_score === 'green') color = '#22c55e';
      if (site.health_score === 'red') color = '#ef4444';

      return {
        type: 'Feature',
        properties: { id: site.id, name: site.name, color },
        geometry: site.geom
      };
    }).filter(f => f.geometry);

    map.current.addSource('sites', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features
      }
    });

    map.current.addLayer({
      id: 'sites-fill',
      type: 'fill',
      source: 'sites',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': 0.6
      }
    });

    map.current.addLayer({
      id: 'sites-outline',
      type: 'line',
      source: 'sites',
      paint: {
        'line-color': '#ffffff',
        'line-width': 2
      }
    });

    if (!disableInteractions) {
      map.current.on('click', 'sites-fill', (e) => {
        const props = e.features[0].properties;
        navigate(`/sites/${props.id}`);
      });

      map.current.on('mouseenter', 'sites-fill', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'sites-fill', () => {
        map.current.getCanvas().style.cursor = '';
      });
    }

    // Auto fit bounds
    if (features.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      features.forEach(f => {
        if (f.geometry.type === 'Polygon') {
          f.geometry.coordinates[0].forEach(coord => {
            bounds.extend(coord);
          });
        }
      });
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  };

  useEffect(() => {
    renderSites();
  }, [sites]);

  return <div ref={mapContainer} className="map-container" />;
}
