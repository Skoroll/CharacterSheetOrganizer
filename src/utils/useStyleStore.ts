import { create } from "zustand";

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

export type ThemeName =
  | "light"
  | "dark"
  | "royal"
  | "forest"
  | "vampire"
  | "steampunk"
  | "ironclad"
  | "arcane"
  | "void"
  | "pastoral"
  | "sandsOfTime";

interface StyleStore {
  theme: Theme;
  setTheme: (themeName: ThemeName) => void;
}

// Déclaration des thèmes
const lightTheme: Theme = {
  primaryColor: "#3498db",
  buttonBg: "#3498db",
  backgroundColor: "#ffffff",
  fontColor: "#000000",
  fontSize: "16px",
  textMuted: "rgba(0, 0, 0, 0.6)",
  backgroundLight: "#f5f5f5",
  backgroundDark: "#e0e0e0",
  fontFamily: '"Arial", sans-serif',
  backgroundSecondaryColor: "#eaeaea",
};

const darkTheme: Theme = {
  primaryColor: "#ffffff",
  buttonBg: "#333333",
  backgroundColor: "#121212",
  fontColor: "#ffffff",
  fontSize: "16px",
  textMuted: "rgba(240, 240, 240, 0.7)",
  backgroundLight: "#1a1a1a",
  backgroundDark: "#0a0a0a",
  fontFamily: '"Arial", sans-serif',
  backgroundSecondaryColor: "#1e1e1e",
};

const royalTheme: Theme = {
  primaryColor: "#8b4513",
  buttonBg: "#8b4513",
  backgroundColor: "#3e2a47",
  fontColor: "#e5c07b",
  fontSize: "16px",
  textMuted: "rgba(229, 192, 123, 0.6)",
  backgroundLight: "#5c3a60",
  backgroundDark: "#2d1b33",
  fontFamily: '"IM Fell English", serif',
  backgroundSecondaryColor: "#604754",
};

const forestTheme: Theme = {
  primaryColor: "#4caf50",
  buttonBg: "#2e7d32",
  backgroundColor: "#1b2f2a",
  fontColor: "#e0f2f1",
  fontSize: "16px",
  textMuted: "#a8bba1",
  backgroundLight: "#345e4e",
  backgroundDark: "#0d1f1a",
  fontFamily: '"MedievalSharp", cursive',
  backgroundSecondaryColor: "#264d3b",
};

const vampireTheme: Theme = {
  primaryColor: "#b30000",
  buttonBg: "#660000",
  backgroundColor: "#1c0b0b",
  fontColor: "#f8e1e1",
  fontSize: "16px",
  textMuted: "#a78d8d",
  backgroundLight: "#2a1212",
  backgroundDark: "#0a0000",
  fontFamily: '"Pirata One", cursive',
  backgroundSecondaryColor: "#3a1a1a",
};

const steampunkTheme: Theme = {
  primaryColor: "#b17f4a",
  buttonBg: "#8c6239",
  backgroundColor: "#3b2f2f",
  fontColor: "#fceabb",
  fontSize: "16px",
  textMuted: "#a38b6f",
  backgroundLight: "#594a4a",
  backgroundDark: "#2c1f1f",
  fontFamily: '"Cinzel Decorative", cursive',
  backgroundSecondaryColor: "#45322e",
};

const ironcladTheme: Theme = {
  primaryColor: "#b0bec5",
  buttonBg: "#607d8b",
  backgroundColor: "#263238",
  fontColor: "#eceff1",
  fontSize: "16px",
  textMuted: "#90a4ae",
  backgroundLight: "#37474f",
  backgroundDark: "#1c262b",
  fontFamily: '"Cinzel Decorative", cursive',
  backgroundSecondaryColor: "#455a64",
};

const arcaneTheme: Theme = {
  primaryColor: "#7e57c2",
  buttonBg: "#512da8",
  backgroundColor: "#1a103d",
  fontColor: "#e0d7ff",
  fontSize: "16px",
  textMuted: "#a293c4",
  backgroundLight: "#2e1a5b",
  backgroundDark: "#140b2e",
  fontFamily: '"Almendra SC", serif',
  backgroundSecondaryColor: "#322157",
};

const voidTheme: Theme = {
  primaryColor: "#00bcd4",
  buttonBg: "#006064",
  backgroundColor: "#000014",
  fontColor: "#e0f7fa",
  fontSize: "16px",
  textMuted: "#80deea",
  backgroundLight: "#1a2a3a",
  backgroundDark: "#00000f",
  fontFamily: '"MedievalSharp", cursive',
  backgroundSecondaryColor: "#112233",
};

const pastoralTheme: Theme = {
  primaryColor: "#a1c349",
  buttonBg: "#7fb800",
  backgroundColor: "#fefae0",
  fontColor: "#4d4d00",
  fontSize: "16px",
  textMuted: "#a5a58d",
  backgroundLight: "#f0ead2",
  backgroundDark: "#d4d4aa",
  fontFamily: '"IM Fell English", serif',
  backgroundSecondaryColor: "#e9edc9",
};

const sandsOfTimeTheme: Theme = {
  primaryColor: "#c2b280",
  buttonBg: "#a1866f",
  backgroundColor: "#f5f0e1",
  fontColor: "#4d392d",
  fontSize: "16px",
  textMuted: "#a68a6d",
  backgroundLight: "#ede0c8",
  backgroundDark: "#cdb79e",
  fontFamily: '"Uncial Antiqua", cursive',
  backgroundSecondaryColor: "#e3d9c1",
};

// Fonction utilitaire
const getThemeByName = (name: ThemeName): Theme => {
  switch (name) {
    case "light":
      return lightTheme;
    case "ironclad":
      return ironcladTheme;
    case "arcane":
      return arcaneTheme;
    case "void":
      return voidTheme;
    case "pastoral":
      return pastoralTheme;
    case "sandsOfTime":
      return sandsOfTimeTheme;
    case "dark":
      return darkTheme;
    case "royal":
      return royalTheme;
    case "forest":
      return forestTheme;
    case "vampire":
      return vampireTheme;
    case "steampunk":
      return steampunkTheme;
    default:
      return darkTheme;
  }
};

// Lecture depuis le localStorage au chargement
const initialThemeName =
  (localStorage.getItem("selectedTheme") as ThemeName) || "dark";

const useStyleStore = create<StyleStore>((set) => ({
  theme: getThemeByName(initialThemeName),
  setTheme: (themeName) => {
    localStorage.setItem("selectedTheme", themeName);
    set({ theme: getThemeByName(themeName) });
  },
}));

export default useStyleStore;
