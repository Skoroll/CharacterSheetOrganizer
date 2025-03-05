import { useState } from "react";

type TableSearchProps = {
  onSearch: (query: string) => void;
};

export default function TableSearch({ onSearch }: TableSearchProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement de la page
    onSearch(searchInput); // Envoie la valeur seulement au submit
  };

  return (
    <div className="table-searchbar">
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={searchInput}
            onChange={handleChange}
            placeholder="Rechercher une table..."
          />
          <button type="submit">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </label>
      </form>
    </div>
  );
}
