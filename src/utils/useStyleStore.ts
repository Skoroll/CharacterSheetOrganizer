import { create } from 'zustand';

interface Theme {
  primaryColor: string;
  backgroundColor: string;
  fontColor: string;
  fontSize: string;
  textMuted: string;
  backgroundLight: string;
  backgroundDark: string;
  fontFamily: string;
  buttonBg: string;
  backgroundSecondaryColor: string;
}

interface StyleStore {
  theme: Theme;
  setTheme: (themeName: 'light' | 'dark' | 'medieval') => void;
}

// Déclaration des thèmes
const lightTheme: Theme = {
  primaryColor: '#3498db',
  buttonBg: '#3498db',
  backgroundColor: '#ffffff',
  fontColor: '#000000',
  fontSize: '16px',
  textMuted: 'rgba(0, 0, 0, 0.6)',
  backgroundLight: '#f5f5f5',
  backgroundDark: '#e0e0e0',
  fontFamily: '"Arial", sans-serif',
  backgroundSecondaryColor: '#eaeaea',
};

const darkTheme: Theme = {
  primaryColor: '#ffffff',
  buttonBg: "#333333",
  backgroundColor: '#121212',
  fontColor: '#ffffff',
  fontSize: '16px',
  textMuted: 'rgba(240, 240, 240, 0.7)',
  backgroundLight: '#1a1a1a',
  backgroundDark: '#0a0a0a',
  fontFamily: '"Arial", sans-serif',
  backgroundSecondaryColor: '#1e1e1e',
};

const medievalTheme: Theme = {
  primaryColor: '#8b4513',
  buttonBg: '#8b4513',
  backgroundColor: '#3e2a47',
  fontColor: '#e5c07b',
  fontSize: '16px',
  textMuted: 'rgba(229, 192, 123, 0.6)',
  backgroundLight: '#5c3a60',
  backgroundDark: '#2d1b33',
  fontFamily: '"IM Fell English", serif',
  backgroundSecondaryColor: '#604754',
};

// Fonction utilitaire
const getThemeByName = (name: 'light' | 'dark' | 'medieval'): Theme => {
  switch (name) {
    case 'light': return lightTheme;
    case 'medieval': return medievalTheme;
    case 'dark':
    default: return darkTheme;
  }
};

// Lecture depuis le localStorage au chargement
const initialThemeName =
  (localStorage.getItem("selectedTheme") as 'light' | 'dark' | 'medieval') || 'dark';

const useStyleStore = create<StyleStore>((set) => ({
  theme: getThemeByName(initialThemeName),
  setTheme: (themeName) => {
    localStorage.setItem("selectedTheme", themeName);
    set({ theme: getThemeByName(themeName) });
  },
}));

export default useStyleStore;
