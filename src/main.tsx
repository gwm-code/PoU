import React from 'react';
import { createRoot } from 'react-dom/client';
import MistheartSpire from './mistheart-modularV84';
import './styles.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <MistheartSpire />
    </React.StrictMode>
  );
} else {
  console.error('Root element #root not found');
}
