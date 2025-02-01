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
  skills: { name: string; link1: string; link2: string }[]; // Compétences spéciales ajoutées
}

interface Skill {
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

  if (loading) return <BeatLoader />;
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

  return (
    <div className="character-details">
      <div className="character-details__content">
        <img
          src={
            character.image
              ? `${API_URL}/${character.image.replace("\\", "/")}`
              : defaultImg
          }
          alt={character.name}
        />
        <div className="character-mobile">
          <div className="character-details__stats">
            <p>
              Classe : <span>{character.className}</span>
            </p>
            <p>
              Âge : <span>{character.age}</span>
            </p>
            <p>
              Force : <span>{character.strength}</span>
            </p>
            <p>
              Dextérité : <span>{character.dexterity}</span>
            </p>
            <p>
              Endurance : <span>{character.endurance}</span>
            </p>
            <p>
              Intelligence : <span>{character.intelligence}</span>
            </p>
            <p>
              Charisme : <span>{character.charisma}</span>
            </p>
          </div>

          <div className="character-details__health">
            <p>
              Point de vie : <span>{character.pointsOfLife}</span>
            </p>
            <p>
              Blessure : <span>{character.injuries}</span>
            </p>
            <p>
              Protection : <span>{character.protection}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Compétences du personnage */}
      <div className="character-details__skills">
        <h3>Compétences</h3>
        <table>
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

        <div className="character-details__special-skills">
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
              {skills.map(({ name, link1, link2 }, index) => {
                const score = calculateScore(link1, link2); // Calcul du score pour chaque compétence spéciale
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
      </div>
    </div>
  );
}
