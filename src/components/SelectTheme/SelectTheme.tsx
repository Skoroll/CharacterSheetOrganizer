import { useEffect, useState } from "react";
import useStyleStore from "../../utils/useStyleStore";

const SelectTheme = () => {
  const { setTheme, theme } = useStyleStore();
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "medieval">("dark");

  // Appliquer le thème depuis localStorage au premier rendu
  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") as "light" | "dark" | "medieval" | null;
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as "light" | "dark" | "medieval";
    setSelectedTheme(newTheme);
    setTheme(newTheme);
    localStorage.setItem("selectedTheme", newTheme); // ⬅️ Enregistrement
  };

  return (
    <div style={{ padding: "10px", background: theme.backgroundColor, color: theme.fontColor }}>
      <label htmlFor="theme-select" style={{ marginRight: "10px" }}>Choisir un thème :</label>
      <select id="theme-select" value={selectedTheme} onChange={handleChange} style={{ padding: "5px" }}>
        <option value="light">Clair</option>
        <option value="dark">Sombre</option>
        <option value="medieval">Médiéval</option>
      </select>
    </div>
  );
};

export default SelectTheme;
