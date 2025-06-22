import { useEffect, useState } from "react";
import { useModal } from "../../../Context/ModalContext";
import { Character, EditableCharacter } from "../../../types/Character";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../Context/UserContext";
import ChooseBannerFrame from "../../Premium/ChooseBannerFrame/ChooseBannerFrame";
import Modal from "../../../components/Modal/Modal";
import defaultImg from "../../../assets/person-placeholder-5.webp";
import "./EditableSheetAria.scss";
import { frameOptions } from "../../Premium/ChooseBannerFrame/ChooseBannerFrame";
import FrameOverlay from "../../Premium/FrameOverlay/FrameOverlay";

interface BaseSkill {
  name: string;
  link1: string;
  link2: string;
  bonusMalus: number;
}

interface EditableSheetProps {
  id: string;
  tableId?: string;
}

export default function EditableSheetAria({ id }: EditableSheetProps) {
  const { openUserProfileModal } = useModal();
  const { user } = useUser();
  const [selectedFrame, setSelectedFrame] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const currentUserId = user?._id || null;
  const [skillBonuses, setSkillBonuses] = useState<{ [key: string]: number }>(
    {}
  );
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSkillOpen, setIsSkillOpen] = useState(true);
  const [isMagicOpen, setIsMagicOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = character && character.userId === currentUserId;
  const [editedCharacter, setEditedCharacter] =
    useState<EditableCharacter | null>(null);

  //Liste des compétences de base
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

  const handleOpenOwnerProfile = async () => {
    if (!character || !character.ownerId) return;
    const ownerId = character.ownerId;
    console.log("➡️ handleOpenOwnerProfile appelé avec ownerId =", ownerId);
    if (!ownerId) {
      console.warn("❌ ownerId manquant, la requête ne part pas.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/profile/${ownerId}`
      );

      if (!res.ok) throw new Error("Impossible de récupérer le profil");
      const data = await res.json();
      openUserProfileModal(data.user);
    } catch (err) {
      console.error("Erreur de récupération :", err);
    }
  };

  const normalizeMagic = (
    magic: Partial<Character["magic"]> = {}
  ): Character["magic"] => ({
    ariaMagic: magic.ariaMagic ?? false,
    ariaMagicLevel: magic.ariaMagicLevel ?? 1,
    ariaMagicCards: magic.ariaMagicCards ?? [],
    ariaMagicUsedCards: magic.ariaMagicUsedCards ?? [],
    deathMagic: magic.deathMagic ?? false,
    deathMagicCount: magic.deathMagicCount ?? 0,
    deathMagicMax: magic.deathMagicMax ?? 10,
  });

  //Regroupe tous les types de magie
  const mergeMagic = (
    prevMagic: Partial<Character["magic"]>,
    patch: Partial<Character["magic"]>
  ) => {
    return normalizeMagic({ ...prevMagic, ...patch });
  };

  //Remise à 0 du deck de carte pour la magie d'Aria
  const handleResetDeck = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/characters/${id}/reshuffleAriaDeck`
      );
      if (!response.ok)
        throw new Error("Erreur lors de la réinitialisation du deck");
      const data = await response.json();

      if (data.character) {
        setEditedCharacter((prev) =>
          prev ? { ...prev, magic: data.character.magic } : prev
        );
      } else if (data.magic) {
        setEditedCharacter((prev) =>
          prev ? { ...prev, magic: data.magic } : prev
        );
      }
    } catch (err) {
      console.error("Erreur reset deck :", err);
    }
  };

  useEffect(() => {
    if (character) {
      setEditedCharacter({
        ...character,
        inventory: character.inventory || [],
        weapons: character.weapons || [],
        skills: character.skills || [],
        tableId: character.tableId,
        magic: normalizeMagic(character.magic),
      });
      setSelectedFrame(character.selectedFrame || "");
    }
  }, [character]);

  const API_URL = import.meta.env.VITE_API_URL;

  //Récupère le personnage via ID, peu importe son jeu
  const fetchCharacter = async () => {
    try {
      const response = await fetch(`${API_URL}/api/characters/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du personnage");
      }
      const data = await response.json();

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
        err instanceof Error ? err.message : "Une erreur inconnue est survenue."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, [id]);

  //Gère les changements dans les inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    const parsedValue = type === "number" ? parseInt(value, 10) || 0 : value;

    if (editedCharacter) {
      setEditedCharacter({
        ...editedCharacter,
        [name]: parsedValue,
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

  //Sauvegarde les modifications sur une feuille de personnage
  const handleSaveChanges = async () => {
    if (!editedCharacter) return;

    // ✅ Empêche de cliquer plusieurs fois
    if (isSaving) return;
    setIsSaving(true);

    const { magic } = editedCharacter;

    if (magic?.deathMagic && magic.deathMagicCount > magic.deathMagicMax) {
      setErrorMessages([
        "Les points de magie de la mort ne peuvent pas dépasser le maximum défini.",
      ]);
      setErrorModalOpen(true);
      setIsSaving(false); // ✅ on déverrouille le bouton même en cas d'erreur
      return;
    }

    const hasImageFile = editedCharacter.image instanceof File;

    const updatedMagic = {
      ...editedCharacter.magic,
      ariaMagicLevel:
        editedCharacter.magic?.ariaMagicLevel !== undefined
          ? editedCharacter.magic.ariaMagicLevel
          : 1,
    };

    const mergedBaseSkills = baseSkills.map((defaultSkill) => {
      const existing = editedCharacter.baseSkills?.find(
        (skill) => skill.name === defaultSkill.name
      );
      return existing
        ? { ...defaultSkill, bonusMalus: existing.bonusMalus }
        : defaultSkill;
    });

    try {
      let response;

      if (hasImageFile) {
        const formData = new FormData();

        for (const [key, value] of Object.entries(editedCharacter)) {
          if (key === "image" && value instanceof File) {
            formData.append("image", value);
          } else if (key !== "magic" && value !== undefined && value !== null) {
            formData.append(
              key,
              typeof value === "object" ? JSON.stringify(value) : String(value)
            );
          }
        }

        formData.set("magic", JSON.stringify(updatedMagic));
        formData.set("baseSkills", JSON.stringify(mergedBaseSkills));
        if (selectedFrame) {
          formData.append("selectedFrame", selectedFrame);
        }

        response = await fetch(`${API_URL}/api/characters/aria/${id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/api/characters/aria/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editedCharacter,
            baseSkills: mergedBaseSkills,
            magic: updatedMagic,
            selectedFrame,
          }),
        });
      }

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      const updatedCharacter = await response.json();

      // ✅ Mise à jour locale
      setCharacter(updatedCharacter);
      setIsEditing(false);

      // ✅ Evite de garder un File après l'upload
      setEditedCharacter({
        ...updatedCharacter,
        image:
          typeof updatedCharacter.image === "string"
            ? updatedCharacter.image
            : editedCharacter.image instanceof File
            ? updatedCharacter.image
            : "",
      });
    } catch (error) {
      console.error("❌ Erreur sauvegarde personnage :", error);
      setError("Impossible de modifier ce personnage.");
    } finally {
      // ✅ Toujours déverrouiller le bouton à la fin
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCharacter(character); // Réinitialise les valeurs d'origine
  };

  function toggleSkills() {
    setIsSkillOpen(true);
    setIsInventoryOpen(false);
    setIsStoryOpen(false);
    setIsMagicOpen(false);
  }

  function toggleMagic() {
    setIsMagicOpen(true);
    setIsSkillOpen(false);
    setIsInventoryOpen(false);
    setIsStoryOpen(false);
  }

  function toggleInventory() {
    setIsInventoryOpen(true);
    setIsSkillOpen(false);
    setIsMagicOpen(false);
    setIsStoryOpen(false);
  }

  function toggleStory() {
    setIsStoryOpen(true);
    setIsSkillOpen(false);
    setIsInventoryOpen(false);
    setIsMagicOpen(false);
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
    const source = isEditing && editedCharacter ? editedCharacter : character;
    if (!source) return 0;

    const stat1 = source[link1 as keyof typeof source];
    const stat2 = source[link2 as keyof typeof source];

    if (typeof stat1 === "number" && typeof stat2 === "number") {
      const average = (stat1 + stat2) / 2;
      const percentage = Math.floor(average / 5) * 5;
      return Math.min(100, Math.max(0, percentage));
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

  //Gère la suppression du personnage
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
      <h1>{character.name}</h1>
      <div className="character-details__owner">
        <span>Propriétaire :</span>{" "}
        <span
          className="character-details__owner--name clickable"
          onClick={() => handleOpenOwnerProfile()}
        >
          {character.ownerName ?? "Inconnu"}{" "}
          {/* ou "Nom à récupérer" si vide */}
        </span>
      </div>

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
        <button onClick={toggleMagic}>
          <i className="fa-solid fa-wand-sparkles" />
        </button>
      </div>

      <div className="content-wrapper">
        <div className="character-details__content">
          <div className="character-details__identity">
            <div className="character-details__identity--image frame-wrapper">
              {!isEditing && character.selectedFrame && (
                <FrameOverlay
                  frameSrc={frameOptions[selectedFrame]}
                  className="frame-overlay frame-overlay--edit"
                  width="315px"
                  height="315px"
                />
              )}

              <img
                className="character-portrait"
                src={
                  editedCharacter?.image
                    ? typeof editedCharacter.image === "string"
                      ? editedCharacter.image
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

              {isEditing && user?.isPremium === true && selectedFrame && (
                <FrameOverlay
                  frameSrc={frameOptions[selectedFrame]}
                  className="frame-overlay frame-overlay--edit"
                  width="315px"
                  height="315px"
                />
              )}

              {isEditing && (
                <label>
                  <i className="fa-solid fa-pen-to-square"></i>
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
                </label>
              )}
              {isEditing && user?.isPremium === true && (
                <ChooseBannerFrame
                  selectedFrame={selectedFrame}
                  setSelectedFrame={setSelectedFrame}
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
              {(!isEditing || (editedCharacter?.skills?.length ?? 0) > 0) && (
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
              {(editedCharacter?.weapons?.length ?? 0) > 0 && (
                <table>
                  <caption>Équipement</caption>
                  <thead>
                    <tr>
                      <th className="item table-left">Arme</th>
                      <th className="quantity table-center">Dégâts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(editedCharacter?.weapons ?? [])
                      .filter((weapon) =>
                        isEditing
                          ? true
                          : weapon.name.trim() !== "" &&
                            weapon.damage.trim() !== ""
                      )
                      .map((weapon, index) => (
                        <tr key={index}>
                          {isEditing ? (
                            <>
                              <td className="table-left">
                                <input
                                  className="table-size--large"
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
                              <td className="table-center">
                                <input
                                  className="table-size--small"
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
                              <td className="table-left">{weapon.name}</td>
                              <td className="table-center">{weapon.damage}</td>
                            </>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}

              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    setEditedCharacter((prev) =>
                      prev
                        ? {
                            ...prev,
                            weapons: [
                              ...(prev.weapons ?? []),
                              { name: "", damage: "" },
                            ],
                          }
                        : null
                    )
                  }
                >
                  Ajouter une arme
                </button>
              )}

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

          {isMagicOpen && (
            <div className="character-details__infos--magic">
              <h3>Magie</h3>

              <p>
                <strong>Magie d'Aria :</strong>{" "}
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editedCharacter?.magic?.ariaMagic ?? false}
                    onChange={(e) =>
                      setEditedCharacter((prev) =>
                        prev
                          ? {
                              ...prev,
                              magic: mergeMagic(prev.magic, {
                                ariaMagic: e.target.checked,
                              }),
                            }
                          : prev
                      )
                    }
                  />
                ) : editedCharacter?.magic?.ariaMagic ? (
                  "Oui"
                ) : (
                  "Non"
                )}
              </p>
              {editedCharacter?.magic?.ariaMagic && (
                <div className="magic__aria-details">
                  <p>
                    <strong>Niveau de magie :</strong>{" "}
                    {character.magic?.ariaMagicLevel ?? "?"}
                  </p>

                  <p>
                    <strong>Cartes restantes :</strong>{" "}
                    {editedCharacter.magic.ariaMagicCards?.length ?? 0}
                  </p>
                  <p>
                    <strong>Cartes jouées :</strong>{" "}
                    {editedCharacter.magic.ariaMagicUsedCards?.length ?? 0}
                  </p>
                </div>
              )}
              {editedCharacter?.magic?.ariaMagic && isEditing && (
                <>
                  <label>
                    Niveau de magie :
                    <select
                      value={editedCharacter.magic.ariaMagicLevel ?? 1}
                      onChange={(e) =>
                        setEditedCharacter((prev) =>
                          prev
                            ? {
                                ...prev,
                                magic: mergeMagic(prev.magic, {
                                  ariaMagicLevel: parseInt(e.target.value, 10),
                                }),
                              }
                            : prev
                        )
                      }
                    >
                      <option value={1}>Niveau 1</option>
                      <option value={2}>Niveau 2</option>
                      <option value={3}>Niveau 3</option>
                    </select>
                  </label>

                  <button
                    className="reset-btn"
                    type="button"
                    onClick={handleResetDeck}
                  >
                    Réinitialiser le deck
                  </button>
                </>
              )}

              <p>
                <strong>Magie de la mort :</strong>{" "}
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editedCharacter?.magic?.deathMagic ?? false}
                    onChange={(e) =>
                      setEditedCharacter((prev) =>
                        prev
                          ? {
                              ...prev,
                              magic: mergeMagic(prev.magic, {
                                deathMagic: e.target.checked,
                              }),
                            }
                          : prev
                      )
                    }
                  />
                ) : editedCharacter?.magic?.deathMagic ? (
                  "Oui"
                ) : (
                  "Non"
                )}
              </p>

              {editedCharacter?.magic?.deathMagic && (
                <div className="magic__death--points">
                  <label>
                    Points de magie de la mort :&nbsp;
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedCharacter.magic.deathMagicCount}
                        onChange={(e) =>
                          setEditedCharacter((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  magic: mergeMagic(prev.magic, {
                                    deathMagicCount:
                                      parseInt(e.target.value, 10) || 0,
                                  }),
                                }
                              : prev
                          )
                        }
                      />
                    ) : (
                      `${editedCharacter.magic.deathMagicCount} / ${editedCharacter.magic.deathMagicMax}`
                    )}
                  </label>
                  {isEditing && (
                    <label>
                      Maximum :
                      <input
                        type="number"
                        value={editedCharacter.magic.deathMagicMax}
                        onChange={(e) =>
                          setEditedCharacter((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  magic: mergeMagic(prev.magic, {
                                    deathMagicMax:
                                      parseInt(e.target.value, 10) || 0,
                                  }),
                                }
                              : prev
                          )
                        }
                      />
                    </label>
                  )}
                </div>
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
      {/*Bouton de suppression de personnage*/}
      {isOwner && (
        <div className="edit-section">
          {!isEditing ? (
            <button
              className="danger"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <i className="fa-solid fa-trash" />
            </button>
          ) : (
            ""
          )}
          {isEditing ? (
            <>
              <button className="cancel-btn" onClick={handleCancelEdit}>
                <i className="fa-solid fa-x"></i>
              </button>
              <button
                className="save-btn"
                onClick={handleSaveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <BeatLoader size={8} color="#fff" />
                ) : (
                  <i className="fa-solid fa-check"></i>
                )}
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <i className="fa-solid fa-pen"></i> Modifier
            </button>
          )}
        </div>
      )}
      {errorModalOpen && (
        <Modal
          title="Erreur de validation"
          onClose={() => setErrorModalOpen(false)}
        >
          <ul className="error-list">
            {errorMessages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </Modal>
      )}

    </div>
  );
}
