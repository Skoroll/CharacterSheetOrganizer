import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TabletopCreation.scss";

export default function TabletopCreation() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/tabletop/tableCreate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Table créée avec succès !");
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
      <form onSubmit={handleSubmit}>
        <label>
          Nom de la table
          <input
            type="text"
            placeholder="Nom de la table"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            placeholder="Mot de passe de la table"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">
          Créer la table
        </button>
      </form>
    </div>
  );
}
