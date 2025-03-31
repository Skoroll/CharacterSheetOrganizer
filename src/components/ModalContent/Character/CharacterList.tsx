import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import defaultImg from "../../../assets/person-placeholder-5.webp";
import AriaLogo from "../../../assets/Aria_logo.png";
import defaultLogo from "../../../assets/dice-solid.svg";
import "./CharacterList.scss";
import "../../../types/Character";

interface Character {
  _id: string;
  name: string;
  className: string;
  age: number;
  image: string;
  game: string;
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const gameLogos: Record<string, string> = {
    Aria: AriaLogo,
    //Futurs jeux à ajouter ici pour avoir les logos correspondants
  };

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

  if (loading) return <BeatLoader />;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="character-list">
      <ul>
        {characters.map((character) => (
          <li key={character._id}>
            <div
              className="character"
              onClick={() => navigate(`/personnage/${character._id}`)}
            >
              <img
                src={gameLogos[character.game || ""] || defaultLogo}
                alt={`${character.game || "Jeu inconnu"} logo`}
                className="game-logo"
              />
              <div className="character--stats">
                <h3>{character.name}</h3>
              </div>
              <img
                className="character--img"
                src={
                  character?.image
                    ? typeof character.image === "string"
                      ? character.image // 🔥 URL Cloudinary déjà complète
                      : URL.createObjectURL(character.image)
                    : defaultImg
                }
                alt={character.name}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
