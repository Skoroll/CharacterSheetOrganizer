import { useState, useEffect } from "react";
import "../CreateSheet.scss";
import { useNavigate } from "react-router-dom";
import ToolTip from "../../Tooltip/Tooltip";
import Modal from "../../Modal/Modal";
import baseSkillsTooltip from "../../../assets/Help/Aria/FR/baseSkills.json";
import healthTooltip from "../../../assets/Help/Aria/FR/health.json";
import sepcialSkillsTooltip from "../../../assets/Help/Aria/FR/specialSkills.json";
import statsTooltip from "../../../assets/Help/Aria/FR/stats.json";
import weaponsTooltip from "../../../assets/Help/Aria/FR/weapons.json";
import placeholderImage from "../../../assets/placeholder-image.webp";
import ariaLogo from "../../../assets/Aria_logo_large.webp";
import { BeatLoader } from "react-spinners";
import ChooseBannerFrame from "../../Premium/ChooseBannerFrame/ChooseBannerFrame";
import { useUser } from "../../../Context/UserContext";
import { AppUser } from "../../../types/AppUser";
import { frameOptions } from "../../Premium/ChooseBannerFrame/ChooseBannerFrame"


interface CreateSheetAriaProps {
  game: string;
  user: AppUser;
}

interface Weapon {
  name: string;
  damage: string;
}

interface Skill {
  specialSkill: string;
  link1: string;
  link2: string;
  score: string;
}

interface InventoryItem {
  item: string;
  quantity: string;
}

interface Magic {
  ariaMagic: boolean;
  deathMagic: boolean;
  deathMagicCount: number;
  deathMagicMax: number;
  ariaMagicLevel?: number;
}

export default function CreateSheetAria({ game }: CreateSheetAriaProps) {
  const { user } = useUser();
  const [selectedFrame, setSelectedFrame] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const navigate = useNavigate();
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [className, setClassName] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(0);
  const [origin, setOrigin] = useState("");
  const [strength, setStrength] = useState<number>(0);
  const [dexterity, setDexterity] = useState<number>(0);
  const [endurance, setEndurance] = useState<number>(0);
  const [intelligence, setIntelligence] = useState<number>(0);
  const [charisma, setCharisma] = useState<number>(0);
  const [isPVModifiedManually, setIsPVModifiedManually] = useState(false);
  const [weapons, setWeapons] = useState<Weapon[]>([
    { name: "", damage: "" },
    { name: "", damage: "" },
    { name: "", damage: "" },
  ]);
  const [pointsOfLife, setPointsOfLife] = useState<number>(0);
  const [gold, setGold] = useState<number>(0);
  const [injuries, setInjuries] = useState<number>(0);
  const [protection, setProtection] = useState<number>(0);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [background, setBackground] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const totalPoints =
    strength + dexterity + endurance + intelligence + charisma;
  const [magic, setMagic] = useState<Magic>({
    ariaMagic: false,
    deathMagic: false,
    deathMagicCount: 0,
    deathMagicMax: 10,
  });
  const stats = {
    FOR: strength,
    DEX: dexterity,
    END: endurance,
    INT: intelligence,
    CHA: charisma,
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    if (!isPVModifiedManually && typeof endurance === "number") {
      const autoPV = Math.min(Math.floor(endurance / 5), 14);
      setPointsOfLife(autoPV);
    }
  }, [endurance, isPVModifiedManually]);

  const handleWeaponChange = (
    index: number,
    field: keyof Weapon,
    value: string
  ) => {
    const updatedWeapons = [...weapons];
    updatedWeapons[index][field] = value;
    setWeapons(updatedWeapons);
  };

  const handleSkillChange = (
    index: number,
    field: keyof Skill,
    value: string
  ) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = value;
    setSkills(updatedSkills);
  };

  const handleInventoryChange = (
    index: number,
    field: keyof InventoryItem,
    value: string
  ) => {
    const updatedInventory = [...inventory];
    updatedInventory[index][field] = value;
    setInventory(updatedInventory);
  };

  const handleAddSkill = () => {
    setSkills([
      ...skills,
      { specialSkill: "", link1: "", link2: "", score: "" },
    ]);
  };

  const handleAddInventoryItem = () => {
    setInventory([...inventory, { item: "", quantity: "" }]);
  };

  const calculateScore = (link1: string, link2: string): number => {
    const stat1 = stats[link1 as keyof typeof stats];
    const stat2 = stats[link2 as keyof typeof stats];
    if (typeof stat1 === "number" && typeof stat2 === "number") {
      const average = (stat1 + stat2) / 2;
      const percentage = Math.floor(average / 5) * 5;
      return Math.min(100, Math.max(0, percentage));
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    const errors: string[] = [];
    
    if (!className) errors.push("La classe est obligatoire.");
    if (!name) errors.push("Le nom est obligatoire.");
    if (age === 0) errors.push("L'âge est obligatoire.");
    if (origin === "") errors.push("L'origine est obligatoire.");
    if (strength === 0) errors.push("La force est obligatoire.");
    if (dexterity === 0) errors.push("La dextérité est obligatoire.");
    if (endurance === 0) errors.push("L'endurance est obligatoire.");
    if (intelligence === 0) errors.push("L'intelligence est obligatoire.");
    if (charisma === 0) errors.push("Le charisme est obligatoire.");
    if (pointsOfLife === 0) errors.push("Les points de vie sont obligatoires.");
    if (!background) errors.push("L'histoire du personnage est obligatoire.");
    if (!pros) errors.push("Les qualités sont obligatoires.");
    if (!cons) errors.push("Les défauts sont obligatoires.");


    const updatedSkills = skills.map((skill) => ({
      ...skill,
      score: skill.score || calculateScore(skill.link1, skill.link2),
    }));

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("className", className);
    formData.append("name", name);
    formData.append("age", age.toString());
    formData.append("strength", strength.toString());
    formData.append("dexterity", dexterity.toString());
    formData.append("endurance", endurance.toString());
    formData.append("intelligence", intelligence.toString());
    formData.append("charisma", charisma.toString());
    formData.append("pointsOfLife", pointsOfLife.toString());
    formData.append("injuries", injuries.toString());
    formData.append("protection", protection.toString());
    formData.append("background", background);
    formData.append("pros", pros);
    formData.append("cons", cons);
    formData.append("gold", gold.toString());
    formData.append("origin", origin);
    formData.append("game", game);
    formData.append("selectedFrame", selectedFrame);
    formData.append("weapons", JSON.stringify(weapons));
    formData.append("skills", JSON.stringify(updatedSkills));
    formData.append("inventory", JSON.stringify(inventory));
    formData.append("magic", JSON.stringify(magic));

    if (errors.length > 0) {
      setErrorMessages(errors);
      setErrorModalOpen(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/characters/aria`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate("/");
      } else {
        alert("Erreur lors de la création du personnage.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function refreshPage() {
    window.location.reload();
    window.scrollTo(0, 0);
  }

  return (
    <div className="sheet">
      <img src={ariaLogo} alt="Logo Aria" className="game-logo" />
      <div className="sheet__top">
        <div className="character-identity">
          <div className="character-identity--img">
            <h3>Image du personnage</h3>
            {user?.isPremium === true && (
  <>
    <ChooseBannerFrame
      selectedFrame={selectedFrame}
      setSelectedFrame={setSelectedFrame}
    />
{selectedFrame && (
  <img
    className="frame-overlay frame-overlay--creation"
    src={frameOptions[selectedFrame]}
    alt={`Cadre ${selectedFrame}`}
  />
)}

  </>
)}

            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload"
              />
              <div className="img-container">
                {!image && (
                  <img
                    src={placeholderImage}
                    alt="Personnage"
                    className="image-placeholder"
                  />
                )}
                {!image && <p>Ajouter votre photo</p>}
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="image-preview"
                  />
                )}
              </div>
            </label>
          </div>

          {/* Bloque principal, image, nom, origine ... */}
          <div className="sheet_top--main-stats">
            <h3>Personnage</h3>
            <label>
              Classe
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </label>
            <label>
              Nom
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              Âge
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </label>
            <label>
              Origine
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </label>
          </div>

          {/* Statistiques Force, Dext ... */}
          <div className="character-stats">
            <h3>
              Caractéristiques
              <ToolTip text={statsTooltip} position="left">
                <span className="tooltip-ancor">?</span>
              </ToolTip>
            </h3>

            <label>
              Force
              <input
                type="number"
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
              />
            </label>
            <label>
              Dextérité
              <input
                type="number"
                value={dexterity}
                onChange={(e) => setDexterity(Number(e.target.value))}
              />
            </label>
            <label>
              Endurance
              <input
                type="number"
                value={endurance}
                onChange={(e) => setEndurance(Number(e.target.value))}
              />
            </label>
            <label>
              Intelligence
              <input
                type="number"
                value={intelligence}
                onChange={(e) => setIntelligence(Number(e.target.value))}
              />
            </label>
            <label>
              Charisme
              <input
                type="number"
                value={charisma}
                onChange={(e) => setCharisma(Number(e.target.value))}
              />
            </label>
            <p>Point dépensé : {totalPoints}</p>
          </div>
        </div>

        {/* Armes */}
        <div className="character__equipment">
          <h3>
            Armes
            <ToolTip text={weaponsTooltip} position="left">
              <span className="tooltip-ancor">?</span>
            </ToolTip>
          </h3>
          {weapons.map((weapon, index) => (
            <div key={index} className="character__equipment--weapon">
              <label>
                Arme {index + 1}
                <input
                  type="text"
                  className="input-weap-name"
                  value={weapon.name}
                  onChange={(e) =>
                    handleWeaponChange(index, "name", e.target.value)
                  }
                />
              </label>
              <label>
                Dégâts
                <input
                  type="text"
                  className="input-weap-dmg"
                  value={weapon.damage}
                  onChange={(e) =>
                    handleWeaponChange(index, "damage", e.target.value)
                  }
                />
              </label>
            </div>
          ))}
        </div>

        {/* Santé */}
        <div className="character-points">
          <h3>
            Physique
            <ToolTip text={healthTooltip} position="left">
              <span className="tooltip-ancor">?</span>
            </ToolTip>
          </h3>
          <label>
            Points de vie
            <input
              type="number"
              value={pointsOfLife}
              onChange={(e) => {
                setPointsOfLife(Number(e.target.value));
                setIsPVModifiedManually(true); // désactive le calcul auto dès modif manuelle
              }}
            />
          </label>
          <label>
            Blessures
            <input
              type="number"
              value={injuries}
              onChange={(e) => setInjuries(Number(e.target.value))}
            />
          </label>
          <label>
            Protection
            <input
              type="number"
              value={protection}
              onChange={(e) => setProtection(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="sheet__bottom">
        {/* Compétences de base */}
        <div className="sheet__bottom--fixed">
          <h3>
            Compétences
            <ToolTip text={baseSkillsTooltip} position="right">
              <span className="tooltip-ancor">?</span>
            </ToolTip>
          </h3>
          <table>
            <thead>
              <tr>
                <th>Compétence</th>
                <th>Lien</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Artisanat", link1: "DEX", link2: "INT" },
                { name: "Combat rapproché", link1: "FOR", link2: "DEX" },
                { name: "Combat à distance", link1: "DEX", link2: "INT" },
                {
                  name: "Connaissance de la nature",
                  link1: "DEX",
                  link2: "INT",
                },
                {
                  name: "Connaissance des secrets",
                  link1: "INT",
                  link2: "CHA",
                },
                { name: "Courir/Sauter", link1: "DEX", link2: "END" },
                { name: "Discrétion", link1: "DEX", link2: "CHA" },
                { name: "Réflexe", link1: "DEX", link2: "INT" },
                { name: "Intimider", link1: "FOR", link2: "CHA" },
                { name: "Lire/Ecrire", link1: "INT", link2: "CHA" },
                { name: "Mentir/Convaincre", link1: "INT", link2: "CHA" },
                { name: "Perception", link1: "INT", link2: "CHA" },
                { name: "Serrures et pièges", link1: "DEX", link2: "END" },
                { name: "Soigner", link1: "INT", link2: "CHA" },
                { name: "Survie", link1: "END", link2: "INT" },
                { name: "Voler", link1: "INT", link2: "CHA" },
              ].map(({ name, link1, link2 }, index) => {
                const score = calculateScore(link1, link2);
                return (
                  <tr key={index}>
                    <td className="table-left">{name}</td>
                    <td className="table-center">{`${link1} / ${link2}`}</td>
                    <td className="table-center">{score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Compétence spéciales */}
        <form className="sheet__bottom--skills">
          <h3>
            Vos compétences spéciales
            <ToolTip text={sepcialSkillsTooltip} position="left">
              <span className="tooltip-ancor">?</span>
            </ToolTip>
          </h3>
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="what-skil">
                <label>
                  Compétence spéciale
                  <input
                    type="text"
                    value={skill.specialSkill}
                    onChange={(e) =>
                      handleSkillChange(index, "specialSkill", e.target.value)
                    }
                  />
                </label>
                <div className="what-skil--link">
                  <label>
                    Lien 1
                    <input
                      type="text"
                      value={skill.link1}
                      onChange={(e) =>
                        handleSkillChange(index, "link1", e.target.value)
                      }
                    />
                  </label>
                  <label>
                    Lien 2
                    <input
                      type="text"
                      value={skill.link2}
                      onChange={(e) =>
                        handleSkillChange(index, "link2", e.target.value)
                      }
                    />
                  </label>
                </div>
                <label>
                  Score
                  <input
                    type="number"
                    value={
                      skill.score || calculateScore(skill.link1, skill.link2)
                    }
                    onChange={(e) =>
                      handleSkillChange(index, "score", e.target.value)
                    }
                  />
                </label>
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddSkill}>
            Ajouter une compétence spéciale
          </button>
          {/*Magies */}
          <div className="magic-types">
            <h3> Types de magie :</h3>
            <div className="magic-types--details">
              <label>
                <input
                  type="checkbox"
                  checked={magic.ariaMagic}
                  onChange={(e) =>
                    setMagic((prev) => ({
                      ...prev,
                      ariaMagic: e.target.checked,
                    }))
                  }
                />
                <span>Magie d'Aria</span>
              </label>
              {magic.ariaMagic && (
                <label>
                  Niveau de magie d'Aria
                  <select
                    value={magic.ariaMagicLevel ?? 1}
                    onChange={(e) =>
                      setMagic((prev) => ({
                        ...prev,
                        ariaMagicLevel: Number(e.target.value),
                      }))
                    }
                  >
                    <option value={1}>Niveau 1</option>
                    <option value={2}>Niveau 2</option>
                    <option value={3}>Niveau 3</option>
                  </select>
                </label>
              )}
            </div>
            <div className="magic-types--details">
              <label>
                <input
                  type="checkbox"
                  checked={magic.deathMagic}
                  onChange={(e) =>
                    setMagic((prev) => ({
                      ...prev,
                      deathMagic: e.target.checked,
                    }))
                  }
                />
                <span>Magie de la Mort</span>
              </label>

              {magic.deathMagic && (
                <label>
                  Points de magie de la mort
                  <div className="death-magic-points">
                    <input
                      type="number"
                      min={0}
                      value={magic.deathMagicCount ?? 0}
                      onChange={(e) =>
                        setMagic((prev) => ({
                          ...prev,
                          deathMagicCount: Number(e.target.value),
                        }))
                      }
                      placeholder="Actuels"
                    />
                    /
                    <input
                      type="number"
                      min={1}
                      value={magic.deathMagicMax ?? 10}
                      onChange={(e) =>
                        setMagic((prev) => ({
                          ...prev,
                          deathMagicMax: Number(e.target.value),
                        }))
                      }
                      placeholder="Maximum"
                    />
                  </div>
                </label>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="sheet__last-section">
        {/* Inventaire */}
        <div className="sheet__bottom--inventory">
          <h3>Inventaire de base</h3>
          <label className="gold">
            Or
            <input
              type="number"
              value={gold}
              onChange={(e) => setGold(Number(e.target.value))}
            />
          </label>
          {inventory.map((item, index) => (
            <div key={index} className="item">
              <label>
                Objet
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) =>
                    handleInventoryChange(index, "item", e.target.value)
                  }
                />
              </label>
              <label>
                Quantité
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleInventoryChange(index, "quantity", e.target.value)
                  }
                />
              </label>
            </div>
          ))}
          <h3 className="section-heading">Possession du personnage </h3>
          <button type="button" onClick={handleAddInventoryItem}>
            Ajouter un objet
          </button>
        </div>
        <div className="sheet__background">
          {/* Background */}
          <div className="sheet__background--pros-and-cons">
            <label>
              Vos qualités :
              <textarea
                value={pros}
                onChange={(e) => setPros(e.target.value)}
              />
            </label>
            <label>
              Vos défauts :
              <textarea
                value={cons}
                onChange={(e) => setCons(e.target.value)}
              />
            </label>
          </div>
          <label>
            Histoire du personnage
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="btn-container">
        <button onClick={() => setIsResetModalOpen(true)}>Recommencer</button>
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <BeatLoader size={8} color="#fff" />
          ) : (
            "Créer le personnage"
          )}
        </button>
      </div>
      {errorModalOpen && (
        <Modal
          title="Formulaire incomplet"
          onClose={() => setErrorModalOpen(false)}
        >
          <ul className="error-list">
            {errorMessages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </Modal>
      )}
      {isResetModalOpen && (
        <Modal title="" onClose={() => setIsResetModalOpen(false)}>
          <p>Vous perdrez toute la progression sur le personnage.</p>
          <div className="modal__buttons">
            <button
              className="modal__cancel-btn"
              onClick={() => setIsResetModalOpen(false)}
            >
              Annuler
            </button>
            <button className="modal__confirm-btn" onClick={refreshPage}>
              Confirmer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
