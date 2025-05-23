import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../Context/UserContext";
import "./TabletopCreation.scss";

interface TabletopCreationProps {
  onCreated: () => void;
}

export default function TabletopCreation({ onCreated }: TabletopCreationProps) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [game, setGame] = useState("Aria");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
      alert("Vous devez être connecté pour créer une table.");
      return;
    }

    if (!game) {
      alert("Veuillez sélectionner un jeu.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/tabletop/tableCreate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          password,
          gameMaster: user.id, // ID du créateur
          gameMasterName: user.name, // NOM du créateur
          players: [], // Liste des joueurs vide au départ
          game,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onCreated();
        navigate(`/table/${data.table.id}`);
      } else {
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="tabletop-creation">
      {user?.isAuthenticated && (
        <form onSubmit={handleSubmit}>
          <label>
            Nom de la table
            <input
              type="text"
              name="table-name"
              placeholder="Nom de la table"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="off"
              onFocus={(e) => e.target.setAttribute("autocomplete", "new-name")}
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              name="table-password"
              placeholder="Mot de passe de la table"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readOnly")}
            />
          </label>
          <label className="select-game">
            Jeu
            <select
              name="game"
              value={game}
              onChange={(e) => setGame(e.target.value)}
            >
              <option value="Aria">Aria</option>
              {/*<option value="VTM">Vampire: The Masquerade</option>*/}
            </select>
          </label>
          <button type="submit">Créer la table</button>
        </form>
      )}

      {!user?.isAuthenticated && (
        <div>
          <p className="no-auth">
            Créez un compte et connecter vous pour créer une nouvelle partie.
          </p>
        </div>
      )}
    </div>
  );
}
