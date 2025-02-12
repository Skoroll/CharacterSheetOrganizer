import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import defaultImg from "../../../assets/default-people.webp";
import "./CharacterList.scss";
import "../../../types/Character"

interface Character {
  _id: string;
  name: string;
  className: string;
  age: number;
  image: string;
}

export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const response = await fetch(`${API_URL}/api/characters/user`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des personnages");
        }

        const data = await response.json();
        setCharacters(data);
      } catch (err: unknown) {
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
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/characters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du personnage");
      }

      setCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character._id !== id)
      );
    } catch (error) {
      console.error("Erreur :", error);
      setError("Impossible de supprimer ce personnage.");
    }
  };

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
              style={{ cursor: "pointer" }}
            >
              <h2>{character.name}</h2>
              <div className="character__inside">
                <div className="character__inside--stats">
                  <i
                    className="fa-solid fa-trash"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(character._id);
                    }}
                  />
                  <p>Âge: <span>{character.age}</span></p>
                  <p>Classe: <span>{character.className}</span></p>
                </div>
                <div className="character__inside--image">
                  <img
                    src={character.image ? `${API_URL}/${character.image.replace("\\", "/")}` : defaultImg}
                    alt={character.name}
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
