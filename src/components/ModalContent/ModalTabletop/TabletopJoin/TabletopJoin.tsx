import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useUser } from "../../../../Context/UserContext";
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

const TabletopJoin = ({ tableId, onClose, gameMasterId }: TabletopJoinProps) => {
  const { user } = useUser();
  const {  isAuthenticated, _id: userId, token } = user;
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [hasEnteredPassword, setHasEnteredPassword] = useState<boolean>(false);
  const API_URL = import.meta.env.VITE_API_URL;
  
  // Utilisation du hook useNavigate
  const navigate = useNavigate();  

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
    const userData = localStorage.getItem("user");
    if (!userData) {
      console.error("Aucune donnée utilisateur trouvée dans localStorage.");
      return;
    }
    const parsedUserData = JSON.parse(userData);
    const playerId = parsedUserData?.id;
    const playerName = parsedUserData?.name;

    if (!playerId || !playerName) {
      console.error("Données utilisateur manquantes !");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token manquant, utilisateur non authentifié !");
      return;
    }

    console.log("Données utilisateur récupérées : ", parsedUserData);
    
    const response = await fetch(`${API_URL}/api/tabletop/addPlayer/${tableId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ playerId, playerName, password }),
    });

    const responseData = await response.json();
    console.log("Réponse serveur :", responseData);

    if (response.ok) {
      alert(responseData.message || "Vous avez rejoint la table !");
      
      // Redirection vers la table après ajout du joueur
      navigate(`/table/${tableId}`);  // Rediriger vers la page de la table
    } else {
      alert(responseData.message || "Erreur lors de l'ajout du joueur");
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
