import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'nilgiris-emerald' | 'heritage-ivory' | 'royal-navy' | 'obsidian-amber';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  surfaceColor: string;
  isDark: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'nilgiris-emerald',
    name: 'Nilgiris Emerald & Gold',
    tagline: 'Signature Coonoor tea estate forest green with champagne gold',
    primaryColor: '#0a2e22',
    accentColor: '#d4af37',
    surfaceColor: '#0c2019',
    isDark: true,
  },
  {
    id: 'heritage-ivory',
    name: 'Heritage Ivory & Bronze',
    tagline: 'Refined British colonial manor alabaster with antique bronze',
    primaryColor: '#1b5e40',
    accentColor: '#b47822',
    surfaceColor: '#ffffff',
    isDark: false,
  },
  {
    id: 'royal-navy',
    name: 'Royal Navy & Platinum',
    tagline: 'Deep midnight sapphire with celestial platinum sky accents',
    primaryColor: '#1e3a66',
    accentColor: '#38bdf8',
    surfaceColor: '#0d172a',
    isDark: true,
  },
  {
    id: 'obsidian-amber',
    name: 'Obsidian & Honey Amber',
    tagline: 'Volcanic stone black with rich warm honeycomb glow',
    primaryColor: '#292524',
    accentColor: '#f59e0b',
    surfaceColor: '#1c1917',
    isDark: true,
  },
];

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themeMeta: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('nilgiris-emerald');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('viwin_color_theme') as ThemeId;
      if (saved && THEME_OPTIONS.some(t => t.id === saved)) {
        setCurrentTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
      } else {
        document.documentElement.setAttribute('data-theme', 'nilgiris-emerald');
      }
    } catch {
      document.documentElement.setAttribute('data-theme', 'nilgiris-emerald');
    }
  }, []);

  const handleSetTheme = (theme: ThemeId) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('viwin_color_theme', theme);
    } catch (e) {
      console.warn('Could not save theme to localStorage:', e);
    }
  };

  const themeMeta = THEME_OPTIONS.find(t => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: handleSetTheme, themeMeta }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
