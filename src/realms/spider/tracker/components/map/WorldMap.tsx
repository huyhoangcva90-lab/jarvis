import React, { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTracker } from '../../context/TrackerContext';
import { sightings } from '../../data/sightings';
import { events } from '../../data/events';
import { theme } from '../../config/theme';

export const WorldMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { state, dispatch, mapRef } = useTracker();
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});
  const filtersRef = useRef(state.filters);
  filtersRef.current = state.filters;

  useEffect(() => {
    const styleId = 'nexus-map-marker-styles';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        @keyframes marker-pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
        .nexus-marker {
          position: relative;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .nexus-marker:hover {
          transform: scale(1.3);
          z-index: 10 !important;
        }
        .marker-ping {
          position: absolute;
          top: 50%; left: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: marker-pulse 2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        .marker-dot {
          position: absolute;
          top: 50%; left: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        }
        .nexus-marker--confirmed .marker-dot {
          width: 12px; height: 12px;
          background-color: ${theme.accent};
          border: 2px solid white;
          box-shadow: 0 0 8px ${theme.accent};
        }
        .nexus-marker--confirmed .marker-ping {
          width: 12px; height: 12px;
          background-color: ${theme.accent};
        }
        .nexus-marker--rumored .marker-dot {
          width: 10px; height: 10px;
          background-color: ${theme.rumored};
          border: 1.5px solid rgba(243, 182, 76, 0.6);
          opacity: 0.85;
        }
        .nexus-marker--rumored .marker-ping {
          width: 10px; height: 10px;
          background-color: ${theme.rumored};
          animation-duration: 3s;
          opacity: 0.5;
        }
        .nexus-marker--event .marker-dot {
          width: 16px; height: 16px;
          background-color: ${theme.event};
          border: 2px solid white;
          box-shadow: 0 0 12px ${theme.event};
        }
        .nexus-marker--event .marker-ping {
          width: 16px; height: 16px;
          background-color: ${theme.event};
          animation-duration: 1.5s;
        }
        .nexus-marker-tooltip {
          position: absolute;
          bottom: 100%; left: 50%;
          transform: translate(-50%, -8px);
          background: rgba(7, 9, 13, 0.92);
          border: 1px solid ${theme.border};
          color: ${theme.primary};
          padding: 4px 10px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          font-family: 'Space Grotesk', sans-serif;
          backdrop-filter: blur(8px);
        }
        .nexus-marker:hover .nexus-marker-tooltip {
          opacity: 1;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    const filters = filtersRef.current;

    const createMarker = (id: string, coordinates: [number, number], status: string, title: string) => {
      const el = document.createElement('div');
      el.className = 'nexus-marker nexus-marker--' + status;
      el.style.width = '20px';
      el.style.height = '20px';

      const ping = document.createElement('div');
      ping.className = 'marker-ping';
      el.appendChild(ping);

      const dot = document.createElement('div');
      dot.className = 'marker-dot';
      el.appendChild(dot);

      const tooltip = document.createElement('div');
      tooltip.className = 'nexus-marker-tooltip';
      tooltip.textContent = title;
      el.appendChild(tooltip);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        dispatch({ type: 'SELECT_MARKER', id });
        map.flyTo({ center: coordinates, zoom: 6, speed: 1.2 });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(coordinates)
        .addTo(map);

      markersRef.current[id] = marker;
    };

    // Add sighting markers
    sightings.forEach(s => {
      if (s.status === 'confirmed' && filters.confirmed) {
        createMarker(s.id, s.coordinates, s.status, s.title);
      } else if (s.status === 'rumored' && filters.rumored) {
        createMarker(s.id, s.coordinates, s.status, s.title);
      } else if (s.status === 'event' && filters.events) {
        createMarker(s.id, s.coordinates, s.status, s.title);
      }
    });

    // Add event markers
    if (filters.events) {
      events.forEach(e => {
        createMarker(e.id, e.coordinates, 'event', e.title);
      });
    }
  }, [dispatch, mapRef]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: state.mapCenter,
      zoom: state.mapZoom,
      attributionControl: false,
      maxZoom: 18,
      minZoom: 1.5,
    });

    map.on('load', () => {
      mapRef.current = map;
      renderMarkers();
    });

    // Handle tile load errors gracefully
    map.on('error', (e) => {
      console.warn('Map error:', e);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Re-render markers when filters change
  useEffect(() => {
    if (mapRef.current) {
      renderMarkers();
    }
  }, [state.filters, renderMarkers]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        backgroundColor: '#07090D',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    >
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
