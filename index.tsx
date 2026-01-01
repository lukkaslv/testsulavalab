import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './contexts/AppContext';

console.log("🚀 СИСТЕМА ГЕНЕЗИС: Ядро индекса инициализировано");

// Глобальная сеть безопасности
window.addEventListener('unhandledrejection', (event) => {
  console.error('🔥 КРИТИЧЕСКАЯ_ОШИБКА_ЯДРА:', event.reason);
  event.preventDefault();
});

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
  console.error("Критическая ошибка: Корневой элемент не найден");
}