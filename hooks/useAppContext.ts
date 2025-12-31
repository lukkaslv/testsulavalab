
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { AppContextType } from '../types';

/**
 * Хук Genesis OS: useAppContext
 * Соответствие: Ст. 4.1 (Целостность Организма)
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('КРИТИЧЕСКАЯ ОШИБКА: useAppContext должен использоваться внутри AppProvider. Нарушение Ст. 4.1.');
  }
  return context;
};
