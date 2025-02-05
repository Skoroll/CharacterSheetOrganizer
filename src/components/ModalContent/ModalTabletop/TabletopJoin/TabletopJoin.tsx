import { useState, useEffect } from "react";
import "./TabletopJoin.scss";

interface Character {
  _id: string; // ⚠️ Vérifie si ton API utilise `_id` et non `id`
  name: string;
}

interface TabletopJoinProps {
  tableId: string;
  onClose: () => void;
  onJoin: (characterId: string, tableId: string) => void;
}

const TabletopJoin = ({ tableId, onClose, onJoin }: TabletopJoinProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchCharacters() {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/characters/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des personnages");
        }

        const data = await response.json();
        console.log("Données reçues :", data); // Debug

        setCharacters(data);
      } catch (err: unknown) {
        console.error("Erreur lors de la récupération des personnages", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur inconnue est survenue.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, [API_URL]);

  useEffect(() => {
    console.log("selectedCharacter mis à jour :", selectedCharacter);
  }, [selectedCharacter]);

  const handleJoinClick = () => {
    if (selectedCharacter) {
      onJoin(selectedCharacter, tableId);
    }
  };

  return (
    <div className="tabletop-join-modal">
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur : {error}</p>}

      {!loading && !error && (
        <>
          <ul>
            {characters.map((character) => {
              console.log("Personnage trouvé :", character); // Debug API
              return (
                <li key={character._id}>
                  <label>
                    <input
                      type="radio"
                      name="character"
                      value={character._id}
                      checked={selectedCharacter === character._id}
                      onChange={() => {
                        console.log("Personnage sélectionné :", character._id); // Debug état
                        setSelectedCharacter(character._id);
                      }}
                    />
                    {character.name}
                  </label>
                </li>
              );
            })}
          </ul>
          <button onClick={handleJoinClick} disabled={!selectedCharacter}>
            Rejoindre la partie
          </button>
          <button onClick={onClose}>Annuler</button>
        </>
      )}
    </div>
  );
};

export default TabletopJoin;
