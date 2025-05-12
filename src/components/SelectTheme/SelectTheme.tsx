import { useEffect, useState } from "react";
import useStyleStore, { ThemeName } from "../../utils/useStyleStore";

interface SelectThemeProps {
  isPremium: boolean;
}

const SelectTheme = ({ isPremium }: SelectThemeProps) => {
  const { setTheme, theme } = useStyleStore();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>("dark");

  const themes: { value: ThemeName; label: string; premium: boolean }[] = [
    { value: "light", label: "Clair", premium: false },
    { value: "dark", label: "Sombre", premium: false },
    { value: "royal", label: "Royal", premium: false },
    { value: "forest", label: "Forêt", premium: true },
    { value: "vampire", label: "Vampirique", premium: true },
    { value: "steampunk", label: "Steampunk", premium: true },
    { value: "ironclad", label: "Blindé", premium: true },
    { value: "arcane", label: "Arcanique", premium: true },
    { value: "void", label: "Vide", premium: true },
    { value: "pastoral", label: "Pastoral", premium: true },
    { value: "sandsOfTime", label: "Sables du Temps", premium: true },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") as ThemeName | null;
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as ThemeName;
    const isPremiumTheme = themes.find((t) => t.value === newTheme)?.premium;

    if (isPremiumTheme && !isPremium) return; // Bloquer la sélection
    setSelectedTheme(newTheme);
    setTheme(newTheme);
    localStorage.setItem("selectedTheme", newTheme);
  };

  return (
    <div
      style={{
        padding: "10px",
        background: theme.backgroundColor,
        color: theme.fontColor,
      }}
    >
      <label htmlFor="theme-select" style={{ marginRight: "10px" }}>
        Choisir un thème :
      </label>
      <select id="theme-select" value={selectedTheme} onChange={handleChange}>
        {themes.map((themeOption) => (
          <option
            key={themeOption.value}
            value={themeOption.value}
            disabled={themeOption.premium && !isPremium}
          >
            {themeOption.premium && !isPremium ? " 🔒" : ""}
            {themeOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectTheme;
