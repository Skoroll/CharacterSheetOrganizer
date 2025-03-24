import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import defaultImg from "../../assets/person-placeholder-5.webp";
import { BeatLoader } from "react-spinners";
import "./SelectNextCharacter.scss";

interface Character {
  _id: string;
  name: string;
  image?: string;
}

interface Props {
  tableId: string;
  gameMasterId: string;
  onClose: () => void;
}

export default function SelectNextCharacter({ tableId, onClose }: Props) {
  const { user } = useUser();
  const navigate = useNavigate();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const res = await fetch(`${API_URL}/api/characters/user`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setCharacters(data);
        setSelectedCharacter(data[0] || null);
      } catch {
        setError("Impossible de récupérer les personnages.");
      } finally {
        setLoading(false);
      }
    }

    fetchCharacters();
  }, [API_URL, user.token]);

  const handleJoin = async () => {
    if (!selectedCharacter) return;

    try {
      const res = await fetch(`${API_URL}/api/tabletop/addPlayer/${tableId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          playerName: user.userPseudo,
          selectedCharacter: selectedCharacter._id,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout à la table");
      navigate(`/table/${tableId}`);
    } catch (err) {
      setError("Une erreur est survenue.");
    }
  };

  return (
    <div className="select-character-modal">
      {loading && <BeatLoader />}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <>
          <h3>Choisissez un personnage pour cette table</h3>
          <ul>
            {characters.map((char) => (
              <li key={char._id}>
                <input
                  type="radio"
                  id={char._id}
                  name="character"
                  checked={selectedCharacter?._id === char._id}
                  onChange={() => setSelectedCharacter(char)}
                />
                <label htmlFor={char._id}>
                  <img
                    src={
                      char.image?.startsWith("http")
                        ? char.image
                        : defaultImg
                    }
                    alt={char.name}
                  />
                  <span>{char.name}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="button-group">
            <button onClick={handleJoin} disabled={!selectedCharacter}>
              Rejoindre la table
            </button>
            <button onClick={onClose}>Annuler</button>
          </div>
        </>
      )}
    </div>
  );
}
