import { useEffect, useState } from "react";
import { Character, EditableCharacter } from "../../types/Character";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import Modal from "../../components/Modal/Modal";
import defaultImg from "../../assets/person-placeholder-5.webp";
import "./EditableSheet.scss";

interface BaseSkill {
  name: string;
  link1: string;
  link2: string;
  bonusMalus: number;
}

interface EditableSheetProps {
  id: string;
}

export default function EditableSheet({ id }: EditableSheetProps) {
  const { user } = useUser();
  const currentUserId = user?._id || null;
  const [skillBonuses, setSkillBonuses] = useState<{ [key: string]: number }>(
    {}
  );
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSkillOpen, setIsSkillOpen] = useState(true);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = character && character.userId === currentUserId;
  const [editedCharacter, setEditedCharacter] =
    useState<EditableCharacter | null>(null);

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

  useEffect(() => {
    if (character) {
      setEditedCharacter({
        ...character,
        inventory: character.inventory || [],
        weapons: character.weapons || [],
        skills: character.skills || [],
      });
    }
  }, [character]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchCharacter() {
      try {
        const response = await fetch(`${API_URL}/api/characters/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du personnage");
        }
        const data = await response.json();

        // Fusionner les compétences existantes avec la liste complète
        const mergedBaseSkills = baseSkills.map((baseSkill) => {
          const existing = data.baseSkills?.find(
            (skill: BaseSkill) => skill.name === baseSkill.name
          );
          return existing
            ? { ...baseSkill, bonusMalus: existing.bonusMalus }
            : baseSkill;
        });

        setCharacter({
          ...data,
          baseSkills: mergedBaseSkills,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur inconnue est survenue."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCharacter();
  }, [id]);

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

  // Fonction pour ajouter une nouvelle ligne dans l'inventaire
  const handleAddInventoryItem = () => {
    if (editedCharacter) {
      setEditedCharacter({
        ...editedCharacter,
        inventory: [...editedCharacter.inventory, { item: "", quantity: 0 }],
      });
    }
  };

  // Fonction pour ajouter une nouvelle compétence spéciale
  const handleAddSkill = () => {
    if (editedCharacter) {
      setEditedCharacter({
        ...editedCharacter,
        skills: [
          ...editedCharacter!.skills, // TS now knows skills is not null
          { specialSkill: "", link1: "", link2: "", score: 0 },
        ],
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!editedCharacter) return;

    try {
      const formData = new FormData();

      for (const [key, value] of Object.entries(editedCharacter)) {
        if (key === "image" && value instanceof File) {
          formData.append("image", value); // 👈 image envoyée à Cloudinary
        } else {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value)
          );
        }
      }
      
      // Les compétences de base modifiées
      const bonusUpdates = baseSkills.map((skill) => {
        const bonus = skillBonuses[skill.name] ?? 0;
        return { name: skill.name, bonusMalus: bonus };
      });
      formData.append("baseSkills", JSON.stringify(bonusUpdates));
      
      
      const response = await fetch(`${API_URL}/api/characters/${id}`, {
        method: "PUT",
        body: formData,
      });
      

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du personnage");
      }

      setCharacter(editedCharacter);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur :", error);
      setError("Impossible de modifier ce personnage.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCharacter(character); // Réinitialise les valeurs d'origine
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

  const handleBonusChange = (skillName: string, value: string) => {
    const parsedValue = parseInt(value, 10) || 0;

    setSkillBonuses((prev) => ({
      ...prev,
      [skillName]: parsedValue,
    }));

    setEditedCharacter((prevCharacter) => {
      if (!prevCharacter) return null;

      const updatedCharacter = {
        ...prevCharacter,
        baseSkills:
          prevCharacter.baseSkills?.map((skill) =>
            skill.name === skillName
              ? { ...skill, bonusMalus: parsedValue } // ✅ Met à jour `bonusMalus`
              : skill
          ) || [],
      };
      return updatedCharacter;
    });
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/characters/${id}`, {
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
            <div className="character-details__identity--image">
            <img
  src={
    editedCharacter?.image
      ? typeof editedCharacter.image === "string"
        ? editedCharacter.image // 🔥 URL Cloudinary déjà complète
        : URL.createObjectURL(editedCharacter.image)
      : defaultImg
  }
  alt={character.name}
  width={260}
  height={260}
  onError={(e) => {
    e.currentTarget.src = defaultImg;
  }}
/>

              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditedCharacter((prev) =>
                        prev ? { ...prev, image: file } : null
                      );
                    }
                  }}
                />
              )}
            </div>

            {/* Statistiques du personnage */}
            <div className="character-details__identity--stats">
              {[
                "strength",
                "dexterity",
                "endurance",
                "intelligence",
                "charisma",
              ].map((stat) => (
                <p key={stat}>
                  {getStatAbbreviation(stat)}{" "}
                  {isEditing ? (
                    <input
                      type="number"
                      name={stat}
                      value={(editedCharacter as any)[stat]}
                      onChange={handleInputChange}
                      className="table-size--small"
                    />
                  ) : (
                    <span>{String(character[stat as keyof Character])}</span>
                  )}
                </p>
              ))}
            </div>

            {/* Conteneur */}
            <div className="character-wrapper">
              {/* Status, hp, blessures, défense */}
              <div className="character-details__identity--status">
                {editedCharacter &&
                  ["pointsOfLife", "injuries", "protection"].map(
                    (field, index) => {
                      const icons = ["fa-heart", "fa-heart-crack", "fa-shield"];
                      const value = (editedCharacter as any)[field];

                      return (
                        <p key={field}>
                          <i className={`fa-solid ${icons[index]}`} />{" "}
                          {isEditing ? (
                            <input
                              type="number"
                              name={field}
                              value={value}
                              onChange={handleInputChange}
                              className="table-size--small"
                            />
                          ) : (
                            <span>{value}</span>
                          )}
                        </p>
                      );
                    }
                  )}
              </div>

              {/* Infos diverse */}
              <div className="character-details__identity--text">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editedCharacter?.name || ""}
                      onChange={handleInputChange}
                      className="edit-input"
                      placeholder="Nom du personnage"
                    />
                    <div className="text-container">
                      <label className="character--class">
                        Classe :{" "}
                        <input
                          type="text"
                          name="className"
                          value={editedCharacter?.className || ""}
                          onChange={handleInputChange}
                          className="edit-input"
                          placeholder="Classe"
                        />
                      </label>
                      <label>
                        Âge :{" "}
                        <input
                          type="number"
                          name="age"
                          value={editedCharacter?.age || 0}
                          onChange={handleInputChange}
                          className="edit-input"
                          placeholder="Âge"
                        />
                      </label>
                      <label>
                        Origine :{" "}
                        <input
                          type="text"
                          name="origin"
                          value={editedCharacter?.origin || ""}
                          onChange={handleInputChange}
                          className="edit-input"
                          placeholder="Origine"
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
                      <th className="table-left">Nom</th>
                      <th className="table-center">Lien</th>
                      <th className="table-center">Score</th>
                      <th className="table-center">+/-</th>
                    </tr>
                  </thead>
                  <tbody>
                    {character.baseSkills.map(
                      ({ name, link1, link2, bonusMalus }, index) => {
                        const score = calculateScore(link1, link2); // Calcul du score
                        // On priorise la valeur du state skillBonuses (modifiée par l'utilisateur)
                        const bonus =
                          skillBonuses[name] !== undefined
                            ? skillBonuses[name]
                            : bonusMalus || 0;
                        const finalScore = Math.min(
                          100,
                          Math.max(0, score + bonus)
                        ); // Applique le bonus/malus

                        return (
                          <tr key={index}>
                            <td className="table-left">{name}</td>
                            <td className="table-center">{`${getStatAbbreviation(
                              link1
                            )} / ${getStatAbbreviation(link2)}`}</td>
                            <td className="table-center">{finalScore}</td>
                            <td className="table-center table-bonus">
                              {isEditing ? (
                                <input
                                  type="number"
                                  className="table-size--small"
                                  value={bonus}
                                  onChange={(e) =>
                                    handleBonusChange(name, e.target.value)
                                  }
                                />
                              ) : (
                                <span>{bonus}</span>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              {/* Compétences  spéciales*/}
              {(editedCharacter?.skills?.length ?? 0) > 0 && (
                <div className="character-details__skills--special">
                  <table>
                    <caption>Compétences spéciales</caption>
                    <thead>
                      <tr>
                        <th className="table-left">Nom</th>
                        <th className="table-center">Lien</th>
                        <th className="table-center">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(editedCharacter?.skills ?? [])
                        .filter((skill) =>
                          isEditing ? true : skill.specialSkill.trim() !== ""
                        )
                        .map((skill, index) => (
                          <tr key={index}>
                            {isEditing ? (
                              <>
                                <td className="table-left">
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
                                <td className="table-center">
                                  <input
                                    className="table-size--small"
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
                                    className="table-size--small"
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
                                <td>
                                  <input
                                    className="table-size--small"
                                    type="text"
                                    value={skill.score}
                                    onChange={(e) =>
                                      handleArrayChange(
                                        index,
                                        "score",
                                        e.target.value,
                                        "skills"
                                      )
                                    }
                                  />
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="table-left">
                                  {skill.specialSkill}
                                </td>
                                <td className="table-center">{`${skill.link1} / ${skill.link2}`}</td>
                                <td className="table-center">{skill.score}</td>
                              </>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {isEditing && (
                    <button type="button" onClick={handleAddSkill}>
                      Ajouter une compétence spéciale
                    </button>
                  )}
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
                <p>Biographie</p>
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
                    {isEditing ? (
                      <tr>
                        <td className="item">
                          <i className="fa-solid fa-coins"></i> Pièces
                        </td>
                        <td className="quantity table-size--small">
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
                          <td className="quantity table-center">
                            {editedCharacter?.gold ?? 0}
                          </td>
                        </tr>
                      )
                    )}
                    {(editedCharacter?.inventory ?? [])
                      .filter((item) =>
                        isEditing
                          ? true
                          : item.item.trim() !== "" && item.quantity > 0
                      )
                      .map((item, index) => (
                        <tr key={index}>
                          {isEditing ? (
                            <>
                              <td className="table-left">
                                <input
                                  className="table-size--large"
                                  type="text"
                                  value={item.item}
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
                              <td className="table-center">
                                <input
                                  className="table-size--small table-size--small"
                                  type="number"
                                  value={item.quantity}
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
                              <td className="table-left">{item.item}</td>
                              <td className="table-center">{item.quantity}</td>
                            </>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p>Aucun objet dans l'inventaire.</p>
              )}
              {isEditing && (
                <button type="button" onClick={handleAddInventoryItem}>
                  Ajouter un objet
                </button>
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
