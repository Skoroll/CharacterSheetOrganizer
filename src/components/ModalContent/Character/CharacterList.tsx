import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import defaultImg from "../../../assets/default-people.webp";
import "./CharacterList.scss";
// Définir un type pour les données du personnage (facultatif, mais recommandé)
interface Character {
  id: string;
  name: string;
  className: string;
  age: number;
  strength: number; // Ajoute cette ligne
  dexterity: number; // Ajoute cette ligne
  endurance: number; // Ajoute cette ligne
  intelligence: number; // Ajoute cette ligne
  charisma: number; // Ajoute cette ligne
  image: string;
}


export default function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const response = await fetch("http://localhost:8080/api/characters");
  
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des personnages");
        }
  
        const data = await response.json();
        console.log(data); // Vérifie les données récupérées
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
  

  // Fonction pour supprimer un personnage
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/characters/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du personnage");
      }

      // Mise à jour de l'état après suppression
      setCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character.id !== id)
      );
    } catch (error) {
      console.error("Erreur :", error);
      setError("Impossible de supprimer ce personnage.");
    }
  };

  if (loading) return <div><BeatLoader /></div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="character-list">
      <ul>
      {characters.map((character) => (
  <li key={character.id}>
    <div className="character">
      <i
        className="fa-solid fa-trash"
        onClick={() => handleDelete(character.id)}
      />
      <h2>{character.name}</h2>
      <div className="character__inside">
        <div className="character__inside--stats">
          <p>Classe: <span>{character.className}</span></p>
          <p>Âge: <span>{character.age}</span></p>
          <p>Charisme: <span>{character.charisma ?? "N/A"}</span></p>
          <p>Intelligence: <span>{character.intelligence ?? "N/A"}</span></p>
          <p>Force: <span>{character.strength ?? "N/A"}</span></p>
        </div>
        <div className="character__inside--image">
          {!character.image ? (
            <img src={defaultImg} alt="Image par défaut" />
          ) : (
            <img src={character.image} alt={character.name} />
          )}
        </div>
      </div>
    </div>
  </li>
))}

      </ul>
    </div>
  );
}

