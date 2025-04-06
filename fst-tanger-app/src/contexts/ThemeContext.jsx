import React, { createContext, useState, useContext, useEffect } from 'react';

/**
 * Theme context for managing light/dark mode
 */
const ThemeContext = createContext();

/**
 * Theme provider component that manages theme state
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or use light as default
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Apply theme when it changes
  useEffect(() => {
    // Update data-theme attribute on document element
    document.documentElement.setAttribute('data-theme', theme);
    // Save to localStorage for persistence
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Provide theme state and setTheme function to children
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
