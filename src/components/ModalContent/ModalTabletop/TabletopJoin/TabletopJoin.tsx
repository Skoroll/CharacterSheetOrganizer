import { useState, useEffect, useContext } from "react";
import { useUser } from "../../../../Context/UserContext"; // Import du contexte utilisateur
import "./TabletopJoin.scss";

interface Character {
  _id: string;
  name: string;
}

interface TabletopJoinProps {
  tableId: string;
  onClose: () => void;
  onJoin: (characterId: string, tableId: string, password?: string) => void;
  gameMasterId: string;
}

const TabletopJoin = ({ tableId, onClose, onJoin, gameMasterId }: TabletopJoinProps) => {
  const { user } = useUser();
  const { userPseudo, isAuthenticated, _id: userId, token } = user;
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [hasEnteredPassword, setHasEnteredPassword] = useState<boolean>(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchCharacters() {
      if (!isAuthenticated || !token) {
        setError("Utilisateur non authentifié");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/characters/user`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération des personnages");
        setCharacters(await response.json());
      } catch (err) {
        setError("Impossible de récupérer les personnages.");
      } finally {
        setLoading(false);
      }
    }
    fetchCharacters();
  }, [API_URL, isAuthenticated, token]);

  useEffect(() => {
    async function checkPasswordStatus() {
      if (!isAuthenticated || !password) return;
      try {
        const response = await fetch(`${API_URL}/api/tabletop/verifyPassword/${tableId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password })
        });
        if (!response.ok) throw new Error("Erreur lors de la vérification du mot de passe");
        setHasEnteredPassword((await response.json()).hasEnteredPassword);
      } catch (err) {
        console.error("Erreur vérification mot de passe", err);
      }
    }
    checkPasswordStatus();
  }, [isAuthenticated, tableId, password]);

  const handleJoinClick = async () => {
    console.log("Tentative de rejoindre la table", tableId, "avec le personnage", selectedCharacter);
    if (!selectedCharacter || !userPseudo) {
      setError("Veuillez sélectionner un personnage.");
      return;
    }
    if (!token) {
      setError("Utilisateur non authentifié.");
      return;
    }
    try {
      const requestBody: Record<string, unknown> = {
        playerPseudo: userPseudo,
        characterId: selectedCharacter,
        playerId: userId,
      };
      console.log("Requête envoyée à :", `${API_URL}/api/tabletop/addPlayer/${tableId}`);

      if (!hasEnteredPassword && password) {
        requestBody.password = password;
      }
      const response = await fetch(`${API_URL}/api/tabletop/addPlayer/${tableId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(requestBody),
        
      });
      console.log("Requête envoyée à :", `${API_URL}/api/tabletop/addPlayer/${tableId}`);

      const data = await response.json();
      console.log("Réponse serveur :", data);

      if (!response.ok) {
        setError(data.message || "Erreur lors de la connexion à la table.");
        console.log("Redirection après connexion réussie :", selectedCharacter, tableId);

      } else {
        console.log("Redirection après connexion réussie :", selectedCharacter, tableId);

        onJoin(selectedCharacter, tableId, password || undefined);
      }
    } catch (err) {
      setError("Une erreur inconnue est survenue.");
    }
  };

  return (
    <div className="tabletop-join-modal">
      {loading && <p>Chargement...</p>}
      {error && <p className="error">Erreur : {error}</p>}
      {!loading && !error && (
        <>
          <ul>
            {characters.map((character) => (
              <li key={character._id}>
                <label>
                  <input
                    type="radio"
                    name="character"
                    value={character._id}
                    checked={selectedCharacter === character._id}
                    onChange={() => setSelectedCharacter(character._id)}
                  />
                  {character.name}
                </label>
              </li>
            ))}
          </ul>
          {gameMasterId !== userId && !hasEnteredPassword && (
            <div>
              <label>
                Mot de passe :
                <input
                  type="password"
                  value={password || ""}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
          )}
          <button onClick={handleJoinClick} disabled={!selectedCharacter}>Rejoindre la partie</button>
          <button onClick={onClose}>Annuler</button>
        </>
      )}
    </div>
  );
};

export default TabletopJoin;
