
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './contexts/AppContext';

console.log("🚀 Genesis OS: Core index initialized");

// Global Safety Net
window.addEventListener('unhandledrejection', (event) => {
  console.error('🔥 CRITICAL_ASYNC_ERROR:', event.reason);
  // Silent recovery - prevent app crash
  event.preventDefault();
});

// Ensure full viewport on Telegram
// FIX: Cast window to any for Telegram WebApp access
const tg = (window as any).Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  );
} else {
  console.error("Critical: Root element not found");
}