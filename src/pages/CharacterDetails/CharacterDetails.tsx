import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import defaultImg from "../../assets/default-people.webp";
import "./CharacterDetails.scss";

interface Character {
  _id: string;
  name: string;
  className: string;
  age: number;
  stats: string;
  strength: number;
  dexterity: number;
  endurance: number;
  intelligence: number;
  charisma: number;
  image: string;
  pointsOfLife: number;
  protection: number;
  injuries: number;
  skills: { specialSkill: string; link1: string; link2: string }[];
  background: string;
  inventory: { item: string; quantity: number }[];
  weapons: { name: string; damage: string }[];
  gold: number;
  origin: string;
}

interface Skill {
  specialSkill: string;
  name: string;
  link1: string;
  link2: string;
}

export default function CharacterDetails() {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [characters, setCharacters] = useState<Character[]>([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const response = await fetch(`${API_URL}/api/characters/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du personnage");
        }
        const data = await response.json();
        setCharacter(data);
        setSkills(data.skills || []); // On récupère les compétences spéciales depuis la DB
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

    fetchCharacter();
  }, [id]);

  function toggleSkills() {
    setIsInventoryOpen(false);
    setIsStoryOpen(false);
    setIsSkillOpen((prev) => !prev);
  }

  function toggleInventory() {
    setIsSkillOpen(false);
    setIsStoryOpen(false);
    setIsInventoryOpen((prev) => !prev);
  }

  function toggleStory() {
    setIsInventoryOpen(false);
    setIsSkillOpen(false);
    setIsStoryOpen((prev) => !prev);
  }

  if (loading)
    return (
      <div className="loader-container">
        <BeatLoader color="#36d7b7" />
      </div>
    );
  if (error) return <div>Erreur : {error}</div>;

  if (!character) return <div>Aucun personnage trouvé.</div>;

  // Fonction pour calculer le score basé sur les statistiques
  const calculateScore = (link1: string, link2: string): number => {
    const stat1 = character[link1 as keyof typeof character];
    const stat2 = character[link2 as keyof typeof character];

    if (typeof stat1 === "number" && typeof stat2 === "number") {
      const average = (stat1 + stat2) / 2;
      const percentage = Math.floor(average / 5) * 5; // Arrondi vers le bas au multiple de 5
      return Math.min(100, Math.max(0, percentage)); // Limite entre 0 et 100
    }
    return 0;
  };

  // Fonction pour convertir les noms de statistiques en abréviations
  const getStatAbbreviation = (stat: string): string => {
    switch (stat) {
      case "strength":
        return "FOR";
      case "dexterity":
        return "DEX";
      case "intelligence":
        return "INT";
      case "charisma":
        return "CHA";
      case "endurance":
        return "END";
      default:
        return stat;
    }
  };

  const baseSkills = [
    { name: "Artisanat", link1: "dexterity", link2: "intelligence" },
    { name: "Combat rapproché", link1: "strength", link2: "dexterity" },
    { name: "Combat à distance", link1: "dexterity", link2: "intelligence" },
    {
      name: "Connaissance de la nature",
      link1: "dexterity",
      link2: "intelligence",
    },
    {
      name: "Connaissance des secrets",
      link1: "intelligence",
      link2: "charisma",
    },
    { name: "Courir/Sauter", link1: "dexterity", link2: "endurance" },
    { name: "Discrétion", link1: "dexterity", link2: "charisma" },
    { name: "Réflexe", link1: "dexterity", link2: "intelligence" },
    { name: "Intimider", link1: "strength", link2: "charisma" },
    { name: "Lire/Ecrire", link1: "intelligence", link2: "charisma" },
    { name: "Mentir/Convaincre", link1: "intelligence", link2: "charisma" },
    { name: "Perception", link1: "intelligence", link2: "charisma" },
    { name: "Serrures et pièges", link1: "dexterity", link2: "endurance" },
    { name: "Soigner", link1: "intelligence", link2: "charisma" },
    { name: "Survie", link1: "endurance", link2: "intelligence" },
    { name: "Voler", link1: "intelligence", link2: "charisma" },
  ];
  console.log("🔹 Image reçue pour", character.name, ":", character.image);


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


  return (
    <div className="character-details">
      <div className="character-details__content">
        <div className="character-details__identity">
        <i
                    className="fa-solid fa-trash"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(character._id);
                    }}
                  />
          <img
            src={
              character.image
                ? `${API_URL}/${character.image.replace(/\\/g, "/")}`
                : defaultImg
            }
            alt={character.name}
            onError={(e) => {
              e.currentTarget.src = defaultImg;
            }}
          />

          <div className="character-details__identity--text">
            <h2>{character.name}</h2>
            <div className="text-container">
              <p className="character--class">
                Classe : <span>{character.className}</span>
              </p>
              <p>
                Âge : <span>{character.age}</span>
              </p>
              <p>Origine : <span>{character.origin}</span></p>
            </div>
          </div>
        </div>
        <div className="character-mobile">
          <div className="character-details__content--stats">
            <p>
              Force <span>{character.strength}</span>
            </p>
            <p>
              Dextérité <span>{character.dexterity}</span>
            </p>
            <p>
              Endurance <span>{character.endurance}</span>
            </p>
            <p>
              Intelligence <span>{character.intelligence}</span>
            </p>
            <p>
              Charisme <span>{character.charisma}</span>
            </p>
          </div>

          <div className="character-details__content--health">
            <p>
              <i className="fa-solid fa-heart" />{" "}
              <span>{character.pointsOfLife}</span>
            </p>
            <p>
              <i className="fa-solid fa-heart-crack" />{" "}
              <span>{character.injuries}</span>
            </p>
            <p>
              <i className="fa-solid fa-shield" />{" "}
              <span>{character.protection}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="character-details--button-list">
        <button onClick={toggleSkills}>
          <i className="fa-solid fa-bolt-lightning" />
        </button>
        <button onClick={toggleInventory}>
          <i className="fa-solid fa-briefcase" />
        </button>
        <button onClick={toggleStory}>
          <i className="fa-solid fa-feather" />
        </button>
      </div>
      {/* Compétences du personnage */}
      {isSkillOpen && (
        <div className="character-details__skills">
          <div className="character-details__skills--regular">
            <table>
              <caption>Compétences basiques</caption>
              <thead>
                <tr>
                  <th>Compétence</th>
                  <th>Lien</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {baseSkills.map(({ name, link1, link2 }, index) => {
                  const score = calculateScore(link1, link2); // Calcul du score pour chaque compétence
                  return (
                    <tr key={index}>
                      <td className="table-left">{name}</td>
                      <td className="table-center">{`${getStatAbbreviation(
                        link1
                      )} / ${getStatAbbreviation(link2)}`}</td>
                      <td className="table-center">{score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="character-details__skills--special">
            <h3>Compétences spéciales</h3>
            <table>
              <thead>
                <tr>
                  <th>Compétence</th>
                  <th>Lien</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {skills.map(({ specialSkill, link1, link2 }, index) => {
                  const score = calculateScore(link1, link2); // Calcul du score pour chaque compétence spéciale
                  return (
                    <tr key={index}>
                      <td className="table-left">{specialSkill}</td>
                      <td className="table-center">{`${getStatAbbreviation(
                        link1
                      )} / ${getStatAbbreviation(link2)}`}</td>
                      <td className="table-center">{score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="character-details__infos">
        {isStoryOpen && (
          <div className="character-details__infos--back-story">
            <h3>Histoire du personnage</h3>
            <div className="character-story__container">
              <p className="character-story__container--text">
                {character.background}
              </p>
            </div>
          </div>
        )}

        {isInventoryOpen && (
          <div className="character-details__infos--inventory">
            <table>
              <caption>Inventaire</caption>
              <thead>
                <tr>
                  <th className="item table-left">Objet</th>
                  <th className="quantity table-center">Quantité</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="item">
                    <i className="fa-solid fa-coins"></i> Pièces
                  </td>
                  <td className="quantity">{character.gold}</td>
                </tr>

                {character.inventory.map((item, index) => (
                  <tr key={index}>
                    <td className="item table-left">{item.item}</td>
                    <td className="quantity table-center">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <table>
              <caption>Armes</caption>
              <thead>
                <tr>
                  <th className="item">Nom</th>
                  <th className="quantity">Dégats</th>
                </tr>
              </thead>
              <tbody>
                {character.weapons.map((weapon, index) => (
                  <tr key={index}>
                    <th className="item">{weapon.name}</th>
                    <th className="quantity">{weapon.damage}</th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
