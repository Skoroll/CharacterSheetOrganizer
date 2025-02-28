import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../Context/UserContext";
import Modal from "../../Modal/Modal";
import defaultImg from "../../../assets/default-people.webp";
import "./CharacterSheetModal.scss";

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
  pros: string;
  cons: string;
  userId: string; // ✅ Ajout de `userId`
}

interface CharacterSheetModalProps {
  characterId: string | null;
}

interface Skill {
  specialSkill: string;
  name: string;
  link1: string;
  link2: string;
}

export default function CharacterSheetModal({ characterId }: CharacterSheetModalProps) {
  const { user } = useUser();
  const currentUserId = user?._id || null;
  const [character, setCharacter] = useState<Character | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSkillOpen, setIsSkillOpen] = useState(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = character && character.userId === currentUserId;
  const API_URL = import.meta.env.VITE_API_URL;
  const [editedCharacter, setEditedCharacter] = useState<Character | null>(
    null
  );
  

  useEffect(() => {
    setEditedCharacter(character ?? null);
  }, [character]);
  
  

  useEffect(() => {
    if (!characterId) return;
    
    let isMounted = true;
    
    async function fetchCharacter() {
      try {
        const response = await fetch(`${API_URL}/api/characters/${characterId}`);
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
        
        const data = await response.json();
        if (isMounted) {
          setCharacter(data);
          setSkills(data.skills || []);
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Erreur inconnue.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
  
    fetchCharacter();
    
    return () => { isMounted = false; };
  }, [characterId]); // ✅ `characterId` est vérifié avant exécution
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editedCharacter) {
      setEditedCharacter({
        ...editedCharacter,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleArrayChange = (
    index: number,
    key: string,
    value: string,
    arrayName: keyof Character
  ) => {
    if (editedCharacter && Array.isArray(editedCharacter[arrayName])) {
      const updatedArray = (editedCharacter[arrayName] as any[]).map(
        (item, i) => (i === index ? { ...item, [key]: value } : item)
      );
      setEditedCharacter({ ...editedCharacter, [arrayName]: updatedArray });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${API_URL}/api/characters/${characterId }`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCharacter),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du personnage");
      }

      setCharacter(editedCharacter); // Met à jour l'affichage avec les nouvelles données
      setIsEditing(false); // Sort du mode édition
    } catch (error) {
      console.error("Erreur :", error);
      setError("Impossible de modifier ce personnage.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCharacter(character ?? null);
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

  if (loading)
    return (
      <div className="loader-container">
        <BeatLoader color="#36d7b7" />
      </div>
    );
  if (error) return <div>Erreur : {error}</div>;

  if (!character) {
    console.error("❌ Aucun personnage trouvé pour cet ID !");
    return <div>Aucun personnage trouvé.</div>;
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/characters/${characterId }`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du personnage");
      }

      setIsModalOpen(false); // Fermer la modale après suppression
      navigate("/"); // Redirection après suppression
    } catch (error) {
      console.error("Erreur :", error);
      setError("Impossible de supprimer ce personnage.");
    }
  };

  useEffect(() => {

  }, [characterId]);
  
  return (
    <div className="character-details">
      {/*Bouton de suppression de personnage*/}
      {isOwner && (
      <div className="edit-section">
        <button
          className="danger"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(true);
          }}
        >
          <i className="fa-solid fa-trash" />
          Supprimer le personnage
        </button>
        {isEditing ? (
          <>
            <button className="save-btn" onClick={handleSaveChanges}>
              Valider les changements
            </button>
            <button className="cancel-btn" onClick={handleCancelEdit}>
              Annuler
            </button>
          </>
        ) : (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <i className="fa-solid fa-pen"></i> Éditer le personnage
          </button>
        )}
      </div>
      )}
      {/*Barres contenant les boutons*/}
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

      <div className="content-wrapper">
        <div className="character-details__content">
          <div className="character-details__identity">
            {/* Image du perssonage */}
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

            {/* Statistiques du personnage */}
            <div className="character-details__identity--stats">
              <i className="fa-solid fa-dumbbell"></i>
              {character.strength}
              <i className="fa-solid fa-cat"></i>
              {character.dexterity}
              <i className="fa-solid fa-person-running"></i>
              {character.endurance}
              <i className="fa-solid fa-brain"></i>
              {character.charisma}
              <i className="fa-solid fa-comments"></i>
              {character.intelligence}
            </div>

            {/* Conteneur */}
            <div className="character-wrapper">
              {/* Status, hp, blessures, défense */}
              <div className="character-details__identity--status">
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

              {/* Infos diverse */}
              <div className="character-details__identity--text">
                <h2>{character.name}</h2>
                <div className="text-container">
                  <p className="character--class">
                    Classe : <span>{character.className}</span>
                  </p>
                  <p>
                    Âge : <span>{character.age}</span>
                  </p>
                  <p>
                    Origine : <span>{character.origin}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="character-mobile"></div>
        </div>
        <div className="character-details__infos">
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

              {/* Compétences  spéciales*/}
              {skills.length > 0 && (
                <div className="character-details__skills--special">
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
                      {Array.isArray(editedCharacter?.skills) &&
                        editedCharacter.skills
                          .filter((skill) => skill.specialSkill.trim() !== "") // Filtrer les compétences vides
                          .map((skill, index) => (
                            <tr key={index}>
                              {isEditing ? (
                                <>
                                  <td>
                                    <input
                                      type="text"
                                      value={skill.specialSkill}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          index,
                                          "specialSkill",
                                          e.target.value,
                                          "skills"
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      value={skill.link1}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          index,
                                          "link1",
                                          e.target.value,
                                          "skills"
                                        )
                                      }
                                    />
                                    /
                                    <input
                                      type="text"
                                      value={skill.link2}
                                      onChange={(e) =>
                                        handleArrayChange(
                                          index,
                                          "link2",
                                          e.target.value,
                                          "skills"
                                        )
                                      }
                                    />
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>{skill.specialSkill}</td>
                                  <td>{`${skill.link1} / ${skill.link2}`}</td>
                                </>
                              )}
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {isStoryOpen && (
            <div className="character-details__infos--back-story">
              <div className="pros-cons">
                <div className="pros-cons--pros">
                  <p>Vos points forts</p>
                  {isEditing ? (
                    <textarea
                      name="pros"
                      value={editedCharacter?.pros}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{character.pros}</p>
                  )}
                </div>
                <div className="pros-cons--cons">
                  <p>Vos points faibles</p>
                  {isEditing ? (
                    <textarea
                      name="cons"
                      value={editedCharacter?.cons}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{character.cons}</p>
                  )}
                </div>
              </div>
              <div className="character-story__container">
                {isEditing ? (
                  <textarea
                    className="character-story__container--text"
                    name="background"
                    value={editedCharacter?.background}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p className="character-story__container--text">
                    {character.background}
                  </p>
                )}
              </div>
            </div>
          )}
          {/* Inventaire + pièces */}
          {isInventoryOpen && (
            <div className="character-details__infos--inventory">
              {(editedCharacter?.inventory?.length ?? 0) > 0 ||
              (editedCharacter?.gold ?? 0) > 0 ? (
                <table>
                  <caption>Inventaire</caption>
                  <thead>
                    <tr>
                      <th className="item table-left">Objet</th>
                      <th className="quantity table-center">Quantité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Affichage des pièces d'or */}
                    {isEditing ? (
                      <tr>
                        <td className="item">
                          <i className="fa-solid fa-coins"></i> Pièces
                        </td>
                        <td className="quantity">
                          <input
                            type="number"
                            name="gold"
                            value={editedCharacter?.gold ?? 0}
                            onChange={handleInputChange}
                          />
                        </td>
                      </tr>
                    ) : (
                      (editedCharacter?.gold ?? 0) > 0 && (
                        <tr>
                          <td className="item">
                            <i className="fa-solid fa-coins"></i> Pièces
                          </td>
                          <td className="quantity">{editedCharacter?.gold ?? 0}</td>
                        </tr>
                      )
                      
                    )}

                    {/* Affichage des objets de l'inventaire */}
                    {Array.isArray(editedCharacter?.inventory) &&
                      editedCharacter.inventory
                        .filter(
                          (item) => item.item.trim() !== "" && item.quantity > 0
                        ) // Filtrer les entrées vides
                        .map((item, index) => (
                          <tr key={index}>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    value={item.item ?? ""}
                                    onChange={(e) =>
                                      handleArrayChange(
                                        index,
                                        "item",
                                        e.target.value,
                                        "inventory"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    value={item.quantity ?? 0}
                                    onChange={(e) =>
                                      handleArrayChange(
                                        index,
                                        "quantity",
                                        e.target.value,
                                        "inventory"
                                      )
                                    }
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{item.item}</td>
                                <td>{item.quantity}</td>
                              </>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </table>
              ) : (
                <p>Aucun objet dans l'inventaire.</p>
              )}

              {/* Tableau des armes */}
              {character.weapons.some(
                (weapon) => weapon.name && weapon.damage
              ) && (
                <table>
                  <caption>Armes</caption>
                  <thead>
                    <tr>
                      <th className="item">Nom</th>
                      <th className="quantity">Dégâts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(editedCharacter?.weapons) &&
                      editedCharacter.weapons
                        .filter(
                          (weapon) =>
                            weapon.name.trim() !== "" &&
                            weapon.damage.trim() !== ""
                        ) // Filtrer les armes vides
                        .map((weapon, index) => (
                          <tr key={index}>
                            {isEditing ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    value={weapon.name}
                                    onChange={(e) =>
                                      handleArrayChange(
                                        index,
                                        "name",
                                        e.target.value,
                                        "weapons"
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={weapon.damage}
                                    onChange={(e) =>
                                      handleArrayChange(
                                        index,
                                        "damage",
                                        e.target.value,
                                        "weapons"
                                      )
                                    }
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{weapon.name}</td>
                                <td>{weapon.damage}</td>
                              </>
                            )}
                          </tr>
                        ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modale de confirmation */}
      {isModalOpen && (
        <Modal
          title="Confirmer la suppression"
          onClose={() => setIsModalOpen(false)}
        >
          <p>Voulez-vous vraiment supprimer {character.name} ?</p>
          <div className="modal__buttons">
            <button
              className="modal__cancel-btn"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </button>
            <button className="modal__confirm-btn" onClick={handleDelete}>
              Confirmer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
