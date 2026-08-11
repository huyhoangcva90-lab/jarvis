import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Crosshair, Globe } from 'lucide-react';
import { useTracker } from '../../context/TrackerContext';
import { theme } from '../../config/theme';

export const MapControls: React.FC = () => {
  const { mapRef, dispatch } = useTracker();

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleCenter = () => {
    dispatch({ type: 'SET_MAP_VIEW', center: [0, 20], zoom: 2 });
  };

  const handleGlobal = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [0, 0], zoom: 1 });
    }
  };

  const buttonStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    backgroundColor: theme.glass,
    border: `1px solid ${theme.border}`,
    color: theme.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    outline: 'none',
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '16px',
        bottom: '100px',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: theme.glass,
        padding: '4px',
        borderRadius: '4px',
        border: `1px solid ${theme.border}`,
      }}
    >
      <motion.button
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        whileTap={{ scale: 0.95 }}
        style={buttonStyle}
        onClick={handleZoomIn}
        title="Zoom In"
      >
        <Plus size={18} />
      </motion.button>
      <motion.button
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        whileTap={{ scale: 0.95 }}
        style={buttonStyle}
        onClick={handleZoomOut}
        title="Zoom Out"
      >
        <Minus size={18} />
      </motion.button>
      <motion.button
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        whileTap={{ scale: 0.95 }}
        style={buttonStyle}
        onClick={handleCenter}
        title="Center View"
      >
        <Crosshair size={18} />
      </motion.button>
      <motion.button
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        whileTap={{ scale: 0.95 }}
        style={buttonStyle}
        onClick={handleGlobal}
        title="Global View"
      >
        <Globe size={18} />
      </motion.button>
    </div>
  );
};
