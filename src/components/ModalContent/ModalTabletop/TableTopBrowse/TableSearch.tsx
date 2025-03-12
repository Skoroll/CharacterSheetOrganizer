import { useState } from "react";
import { useUser } from "../../../../Context/UserContext";

type TableSearchProps = {
  onSearch: (query: string) => void;
};

export default function TableSearch({ onSearch }: TableSearchProps) {
  const [searchInput, setSearchInput] = useState("");
  const { user } = useUser();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Empêche le rechargement de la page
    onSearch(searchInput); // Envoie la valeur seulement au submit
  };

  return (
    <div className="table-searchbar">
      {user?.isAuthenticated && (
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
      )}

      {!user?.isAuthenticated && (
        <div>
          <p className="no-auth">
            Créez un compte et connecter vous pour accéder à la recherche de parties.
          </p>
        </div>
      )}
    </div>
  );
}
