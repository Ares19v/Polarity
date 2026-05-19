import React, { createContext, useState, useContext } from 'react';

// The two master themes
export const THEMES = {
  minimalist: {
    mode: 'minimalist',
    background: '#09090A', // Pure Matte Black
    surface: '#121214', // Matte Slate Card
    surfaceSecondary: '#19191C', // Darker contrast block
    border: '#202024', // Ultra-thin slate line
    textPrimary: '#FFFFFF', // Pure crisp white
    textSecondary: '#8E8E93', // Muted concrete gray
    accent: '#58D5BA', // Sophisticated Mint/Teal
    accentSecondary: '#D1D1D6', // Brushed Steel White
    danger: '#E06B70', // Muted Coral Red
    glow: 'transparent', // Zero glows
  },
  cyberpunk: {
    mode: 'cyberpunk',
    background: '#07050B', // Vibrant Purple-Obsidian
    surface: 'rgba(30, 20, 48, 0.45)', // Translucent Glass
    surfaceSecondary: 'rgba(15, 10, 25, 0.6)', // Deep void block
    border: 'rgba(255, 46, 147, 0.2)', // Glowing pink boundary
    textPrimary: '#FFF5FA', // Warm silver-white
    textSecondary: 'rgba(255, 200, 230, 0.5)', // Soft lavender gray
    accent: '#FF2E93', // Neon Hot-Pink
    accentSecondary: '#00F5FF', // Electric Cyan
    danger: '#FF3B30', // Laser Crimson
    glow: '#FF2E9340', // Diffuse ambient neon shadows
  }
};

const ThemeContext = createContext({
  theme: THEMES.minimalist,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('minimalist');

  const toggleTheme = () => {
    setThemeName((prev) => (prev === 'minimalist' ? 'cyberpunk' : 'minimalist'));
  };

  return (
    <ThemeContext.Provider value={{ theme: THEMES[themeName], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
