import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { Character } from "../../types/Character";
import defaultImg from "../../assets/person-placeholder-5.webp";
import "../../components/ModalContent/Character/CharacterList.scss";
import "./Menu.scss";
import { frameOptions } from "../../components/Premium/ChooseBannerFrame/ChooseBannerFrame";

export default function Menu() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentTheme = localStorage.getItem("selectedTheme");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

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

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Utilisateur non authentifié");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/characters/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du personnage");
      }

      setCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character._id !== id)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du personnage", error);
      setError("Impossible de supprimer ce personnage.");
    }
  };

  if (loading) return <BeatLoader />;
  if (error)
    return (
      <div>
        <p>Erreur : Le serveur semble inatteignable</p>
        <p>Réessayez plus tard</p>
      </div>
    );

  return (
    <div className="menu">
      <div className="character-list">
        <ul>
          <li
            className="character-list__create-new"
            onClick={() => navigate("/creation-de-personnage")}
          >
            <i className="fa-solid fa-plus"></i>
            <p
              className={
                ["ironclad", "steampunk", "sandsOfTime"].includes(
                  currentTheme || ""
                )
                  ? "small-text"
                  : ""
              }
            >
              Créer un personnage
            </p>
          </li>
          {characters.map((character) => (
            <li key={character._id}>
              <div
                className="character"
                onClick={() => navigate(`/personnage/${character._id}`)}
                style={{ cursor: "pointer" }}
              >
                <i
                  className="fa-solid fa-trash"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(character._id);
                  }}
                  style={{ display: "none" }}
                />

                <div className="character__inside">
                  <div className="character__inside--stats"></div>
                  <div className="character__inside--image">
                  {character.selectedFrame && frameOptions[character.selectedFrame] && (
  <img 
    src={frameOptions[character.selectedFrame]} 
    alt={`Cadre ${character.selectedFrame}`} 
    className="frame-overlay frame-overlay--small"
  />
)}


                    <img
                      className="character-portrait"
                      src={
                        character?.image
                          ? typeof character.image === "string"
                            ? character.image
                            : URL.createObjectURL(character.image)
                          : defaultImg
                      }
                      alt={character.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultImg;
                      }}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
