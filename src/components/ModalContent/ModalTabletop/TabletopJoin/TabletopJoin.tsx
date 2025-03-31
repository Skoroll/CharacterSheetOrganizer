import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../Context/UserContext";
import "./TabletopJoin.scss";
import { BeatLoader } from "react-spinners";
import defaultImg from "../../../../assets/person-placeholder-5.webp"
import { Character } from "../../../../types/Character";


interface TabletopJoinProps {
  tableId: string;
  onClose: () => void;
  onJoin?: () => void;
  gameMasterId: string;
  game: string;
}

const TabletopJoin = ({ tableId, onClose, gameMasterId, game }: TabletopJoinProps) => {
  const { user } = useUser();
  const { isAuthenticated, _id: userId, userPseudo: playerName, token } = user;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [hasEnteredPassword, setHasEnteredPassword] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // 🛠️ Récupération des personnages du joueur
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Erreur lors de la récupération des personnages");

        const fetchedCharacters = await response.json();
        setCharacters(
          fetchedCharacters.filter((character: Character) => character.game === game)
        );

        // Sélection automatique du premier personnage disponible
        if (fetchedCharacters.length > 0) {
          setSelectedCharacter(fetchedCharacters[0]);
        }
      } catch (err) {
        setError("Impossible de récupérer les personnages.");
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, [API_URL, isAuthenticated, token]);

  // 🔹 Gérer l'ajout du joueur à la table
  const handleJoinClick = async () => {

    if (!userId || !playerName) {
      setError("Données utilisateur manquantes !");
      return;
    }

    if (!token) {
      setError("Token manquant, utilisateur non authentifié !");
      return;
    }

    if (!selectedCharacter) {
      setError("Aucun personnage sélectionné !");
      return;
    }

    // Vérification du mot de passe (si nécessaire)
    if (gameMasterId !== userId && password.length > 0 && !hasEnteredPassword) {
      try {
        const response = await fetch(
          `${API_URL}/api/tabletop/verifyPassword/${tableId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          }
        );

        if (!response.ok) throw new Error("Erreur lors de la vérification du mot de passe");

        setHasEnteredPassword(true);
      } catch (err) {
        setError("Mot de passe incorrect.");
        return; // 🔹 Stoppe la suite si le mot de passe est faux
      }
    }

    // 🔹 Ajouter le joueur après vérification du mot de passe
    try {
      const response = await fetch(
        `${API_URL}/api/tabletop/addPlayer/${tableId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId, // ✅ Correction ici
            playerName,
            selectedCharacter: selectedCharacter._id, // ✅ On envoie seulement l'ID du personnage
            password,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        navigate(`/table/${tableId}`);
      } else {
        setError(responseData.message || "Erreur lors de l'ajout du joueur");
      }
    } catch (err) {
      setError("Erreur lors de l'envoi de la requête.");
    }
  };

  return (
    <div className="tabletop-join-modal">
      {characters.length === 0 && (
  <p>Aucun personnage disponible pour <strong>{game}</strong>.
    <br/>
    <button onClick={() => navigate("/creation-de-personnage")}>Créer un personnage</button> 
  </p>
)}
      {loading && <p><BeatLoader/></p>}
      {error && <p className="error">Erreur : {error}</p>}
      {!loading && !error && (
        <>
          <ul>
            {characters.map((character) => (
              <li key={character._id}>
                <input
                  type="radio"
                  id={`character-${character._id}`}
                  name="character"
                  value={character._id}
                  checked={selectedCharacter?._id === character._id}
                  onChange={() => setSelectedCharacter(character)}
                />
                <label htmlFor={`character-${character._id}`}>
                  {character.image ? (
                    <img 
                    src={
                      character?.image
                        ? typeof character.image === "string"
                          ? character.image // 🔥 URL Cloudinary déjà complète
                          : URL.createObjectURL(character.image)
                        : defaultImg
                    }
                     />
                  ) : (
                    <p>{character.name}</p>
                  )}
                </label>
              </li>
            ))}
          </ul>

          {gameMasterId !== userId && !hasEnteredPassword && (
            <label>
              Mot de passe :
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}

          <div className="button-container">
            <button onClick={handleJoinClick} disabled={!selectedCharacter}>
              Rejoindre la partie
            </button>
            <button onClick={onClose}>Annuler</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TabletopJoin;
