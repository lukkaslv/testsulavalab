import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { AppContextType } from '../types';

/**
 * Genesis OS Hook: useAppContext
 * Provides access to the global application state.
 * Must be used within an <AppProvider />.
 */
export const useAppContext = () => {
  // FIXED: Cast the context to AppContextType to resolve property access errors in App.tsx and components
  const context = useContext(AppContext) as AppContextType;
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider. Check index.tsx wrapping.');
  }
  return context;
};