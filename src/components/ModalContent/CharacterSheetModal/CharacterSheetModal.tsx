import { useState } from "react";
import { Character } from "../../../types/Character";
import "./CharacterSheetModal.scss";

const CharacterSheetModal: React.FC<{
  character: Character | null;
  onClose: () => void;
}> = ({ character }) => {
  if (!character) {
    return <div>Personnage non trouvé</div>;
  }
  console.log("Données reçues par CharacterSheetModal :", character);
  const API_URL = import.meta.env.VITE_API_URL;
  const [isSkillOpen, setIsSkillOpen] = useState(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

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

  return (
    <div className="character-sheet-modal">
      <div className="character-sheet-modal__main-block">
        <div className="character-sheet-modal__main-block--infos">
          {character.image ? (
            <img src={`${API_URL}/${character.image}`} alt={character.name} />
          ) : (
            <p>Aucune image disponible</p>
          )}
          {character.className ? (
            <p>Classe : {character.className}</p>
          ) : (
            <p></p>
          )}
          {character.age ? <p>Âge : {character.age}</p> : <p></p>}
          {character.origin ? <p>Origine : {character.origin}</p> : <p></p>}
        </div>
        <div className="character-sheet-modal__main-block--stats">
          <h2>Statistiques</h2>
          <ul>
            <li>
              Force <span>{character.strength}</span>
            </li>
            <li>
              Dextérité <span>{character.dexterity}</span>
            </li>
            <li>
              Endurance <span>{character.endurance}</span>
            </li>
            <li>
              Intelligence <span>{character.intelligence}</span>
            </li>
            <li>
              Charisme <span>{character.charisma}</span>
            </li>
          </ul>
        </div>

        <div className="character-sheet-modal__main-block--status">
          <h2 className="">Etat</h2>
          <p>
            <i className="fa-solid fa-heart" />{" "}
            <span>{character.pointsOfLife} </span>
          </p>
          <p>
            <i className="fa-solid fa-heart-crack" />{" "}
            <span>{character.injuries} </span>
          </p>
          <p>
            <i className="fa-solid fa-shield" />{" "}
            <span>{character.protection} </span>
          </p>
        </div>
      </div>
      <div className="character-sheet-modal--button-list">
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
      {isSkillOpen && (
        <div className="character-sheet-modal__skills">
          <h2>Compétences</h2>
          <div className="skills-wrapper">
            <div className="character-sheet-modal__skills--basic">
              <table>
                <caption>Compétences basiques</caption>
                <thead>
                  <tr>
                    <th className="table-left">Compétence</th>
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

            <div className="character-sheet-modal__skills--special">
              {character.skills && character.skills.length > 0 ? (
                <table>
                  <caption>Compétences spéciales</caption>
                  <thead>
                    <tr>
                      <th>Compétence</th>
                      <th>Lien</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {character.skills.map((skill, index) => (
                      <tr key={index}>
                        <td className="table-left">{skill.specialSkill}</td>
                        <td>
                          {skill.link1 && skill.link2
                            ? `${getStatAbbreviation(
                                skill.link1
                              )} / ${getStatAbbreviation(skill.link2)}`
                            : "N/A"}
                        </td>
                        <td>{skill.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Aucune compétence disponible.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {isInventoryOpen && (
        <div className="character-sheet-modal__possession">
          <div className="character-sheet-modal__possession--weapons">
            <h2>Armes</h2>

            {character.weapons && character.weapons.length > 0 ? (
              <table className="character-table">
                <thead>
                  <tr>
                    <th className="table-left">Nom</th>
                    <th>Dégâts</th>
                  </tr>
                </thead>
                <tbody>
                  {character.weapons.map((weapon, index) => (
                    <tr key={index}>
                      <td className="table-left">{weapon.name}</td>
                      <td>{weapon.damage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune arme</p>
            )}
          </div>

          <div className="character-sheet-modal__possession--inventory">
            {/* Table de l'Inventaire */}
            <h2>Inventaire</h2>
            {character.inventory && character.inventory.length > 0 ? (
              <table className="character-table">
                <thead>
                  <tr>
                    <th className="table-left">Objet</th>
                    <th>Quantité</th>
                  </tr>
                </thead>
                <tbody>
                  {character.inventory.map((item, index) => (
                    <tr key={index}>
                      <td className="table-left">{item.item}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucun objet</p>
            )}
          </div>
        </div>
      )}

      {isStoryOpen && (
        <div className="character-sheet-modal__backstory">
          <p>{character.background}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterSheetModal;
