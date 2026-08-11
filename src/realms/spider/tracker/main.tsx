import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tracker.css';

const container = document.getElementById('tracker-root');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
