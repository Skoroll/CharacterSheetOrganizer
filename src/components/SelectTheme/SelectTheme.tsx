import { useState } from "react";
import useStyleStore from "../../utils/useStyleStore";

const SelectTheme = () => {
  const { setTheme, theme } = useStyleStore();
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | "medieval">("dark");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as "light" | "dark" | "medieval";
    setSelectedTheme(newTheme);
    setTheme(newTheme);
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
