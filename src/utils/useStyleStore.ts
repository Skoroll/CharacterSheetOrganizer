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
}


interface StyleStore {
  theme: Theme;
  setTheme: (themeName: 'light' | 'dark' | 'medieval') => void;
}

const lightTheme: Theme = {
  primaryColor: '#3498db',
  backgroundColor: '#ffffff',
  fontColor: '#000000',
  fontSize: '16px',
  textMuted: 'rgba(0, 0, 0, 0.6)',
  backgroundLight: '#f5f5f5',
  backgroundDark: '#e0e0e0',
  fontFamily: '"Arial", sans-serif',
};

const darkTheme: Theme = {
  primaryColor: '#ffffff',
  backgroundColor: '#121212',
  fontColor: '#ffffff',
  fontSize: '16px',
  textMuted: 'rgba(240, 240, 240, 0.7)',
  backgroundLight: '#1a1a1a',
  backgroundDark: '#0a0a0a',
  fontFamily: '"Arial", sans-serif',
};

const medievalTheme: Theme = {
  primaryColor: '#8b4513',
  backgroundColor: '#3e2a47',
  fontColor: '#e5c07b',
  fontSize: '16px',
  textMuted: 'rgba(229, 192, 123, 0.6)',
  backgroundLight: '#5c3a60',
  backgroundDark: '#2d1b33',
  fontFamily: '"IM Fell English", serif',
};


const useStyleStore = create<StyleStore>((set) => ({
  theme: darkTheme, // ou lightTheme ou medievalTheme
  setTheme: (themeName) => {
    let newTheme;
    switch (themeName) {
      case 'dark':
        newTheme = darkTheme;
        break;
      case 'medieval':
        newTheme = medievalTheme;
        break;
      default:
        newTheme = lightTheme;
    }
    set({ theme: newTheme });
  },
}));


export default useStyleStore;
