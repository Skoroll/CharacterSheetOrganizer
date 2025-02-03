import { create } from 'zustand';

interface Theme {
  primaryColor: string;
  backgroundColor: string;
  fontColor: string;
  fontSize: string;
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
};

const darkTheme: Theme = {
  primaryColor: '#ffffff',
  backgroundColor: '#121212',
  fontColor: '#ffffff',
  fontSize: '16px',
};

const medievalTheme: Theme = {
  primaryColor: '#8b4513',
  backgroundColor: '#3e2a47',
  fontColor: '#e5c07b',
  fontSize: '16px',
};

const useStyleStore = create<StyleStore>((set) => ({
  theme: darkTheme, // Default theme
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
