import { useEffect, useState } from "react";
import useStyleStore, { ThemeName } from "../../utils/useStyleStore";

const SelectTheme = () => {
  const { setTheme, theme } = useStyleStore();
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>("dark");

  // Appliquer le thème depuis localStorage au premier rendu
  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") as
      | "light"
      | "dark"
      | "royal"
      | null;
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as "light" | "dark" | "royal";
    setSelectedTheme(newTheme);
    setTheme(newTheme);
    localStorage.setItem("selectedTheme", newTheme); // ⬅️ Enregistrement
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
        <option value="light">Clair</option>
        <option value="dark">Sombre</option>
        <option value="royal">Royal</option>
        <option value="forest">Forêt</option>
        <option value="vampire">Vampirique</option>
        <option value="steampunk">Steampunk</option>
        <option value="ironclad">Blindé</option>
        <option value="arcane">Arcanique</option>
        <option value="void">Vide</option>
        <option value="pastoral">Pastoral</option>
        <option value="sandsOfTime">Sables du Temps</option>
      </select>
    </div>
  );
};

export default SelectTheme;
