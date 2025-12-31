
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppProvider } from './contexts/AppContext';

console.log("🚀 Genesis OS: Ядро индекса инициализировано");

// Глобальная сеть безопасности (Global Safety Net)
window.addEventListener('unhandledrejection', (event) => {
  console.error('🔥 КРИТИЧЕСКАЯ_АСИНХ_ОШИБКА:', event.reason);
  // Тихий режим восстановления - предотвращение падения приложения
  event.preventDefault();
});

// Обеспечение полного экрана в Telegram
// ИСПРАВЛЕНИЕ: Приведение window к any для доступа к Telegram WebApp
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
