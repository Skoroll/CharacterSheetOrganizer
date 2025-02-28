import { useState } from "react";
import "./CreateSheet.scss";
import { useNavigate } from "react-router-dom";
import placeholderImage from "../../assets/placeholder-image.webp";

// Déclaration des types pour les armes, compétences, inventaire, etc.
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

function CreateSheet() {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [className, setClassName] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [origin, setOrigin] = useState("");
  const [strength, setStrength] = useState<number | "">("");
  const [dexterity, setDexterity] = useState<number | "">("");
  const [endurance, setEndurance] = useState<number | "">("");
  const [intelligence, setIntelligence] = useState<number | "">("");
  const [charisma, setCharisma] = useState<number | "">("");

  // Vous pouvez initialiser avec un tableau vide pour permettre l'ajout dynamique
  const [weapons, setWeapons] = useState<Weapon[]>([
    { name: "", damage: "" },
    { name: "", damage: "" },
    { name: "", damage: "" },
  ]);
  const [pointsOfLife, setPointsOfLife] = useState<number | "">("");
  const [gold, setGold] = useState<number | "">("");
  const [injuries, setInjuries] = useState<number | "">("");
  const [protection, setProtection] = useState<number | "">("");
  
  // Initialisation vide pour compétences spéciales et inventaire
  const [skills, setSkills] = useState<Skill[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [background, setBackground] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");

  // Définition des statistiques du personnage
  const stats = {
    FOR: strength,
    DEX: dexterity,
    END: endurance,
    INT: intelligence,
    CHA: charisma,
  };

  // Fonction pour ajouter une nouvelle compétence spéciale
  const handleAddSkill = () => {
    setSkills([...skills, { specialSkill: "", link1: "", link2: "", score: "" }]);
  };

  // Fonction pour ajouter un nouvel objet à l'inventaire
  const handleAddInventoryItem = () => {
    setInventory([...inventory, { item: "", quantity: "" }]);
  };

  // Gestion de la prévisualisation de l'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  // Gestion des modifications des armes
  const handleWeaponChange = (
    index: number,
    field: keyof Weapon,
    value: string
  ) => {
    const updatedWeapons = [...weapons];
    updatedWeapons[index][field] = value;
    setWeapons(updatedWeapons);
  };

  // Gestion des modifications des compétences spéciales
  const handleSkillChange = (
    index: number,
    field: keyof Skill,
    value: string
  ) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = value;
    setSkills(updatedSkills);
  };

  // Gestion des modifications des objets d'inventaire
  const handleInventoryChange = (
    index: number,
    field: keyof InventoryItem,
    value: string
  ) => {
    const updatedInventory = [...inventory];
    updatedInventory[index][field] = value;
    setInventory(updatedInventory);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calcul des scores pour les compétences spéciales avant envoi
    const updatedSkills = skills.map((skill) => ({
      ...skill,
      score: skill.score || calculateScore(skill.link1, skill.link2),
    }));

    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
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

    formData.append("weapons", JSON.stringify(weapons));
    formData.append("skills", JSON.stringify(updatedSkills));
    formData.append("inventory", JSON.stringify(inventory));

    for (let pair of formData.entries()) {
      console.log(`🔹 ${pair[0]}:`, pair[1]);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/characters/`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
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
    }
  };

  // Fonction pour calculer le score en fonction des liens
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

  function refreshPage() {
    window.location.reload();
    window.scrollTo(0, 0);
  }

  return (
    <div className="sheet">
      <h2>Création du personnage :</h2>
      <div className="sheet__top">
        <div className="character-identity">
          <div className="character-identity--img">
            <h3>Image du personnage</h3>
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

          <div className="character-stats">
            <h3>Caractéristiques</h3>
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
          </div>
        </div>

        <div className="character__equipment">
          <h3>Armes</h3>
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
        <div className="character-points">
          <h3>Physique</h3>
          <label>
            Points de vie
            <input
              type="number"
              value={pointsOfLife}
              onChange={(e) => setPointsOfLife(Number(e.target.value))}
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
        <div className="sheet__bottom--fixed">
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
              {[
                { name: "Artisanat", link1: "DEX", link2: "INT" },
                { name: "Combat rapproché", link1: "FOR", link2: "DEX" },
                { name: "Combat à distance", link1: "DEX", link2: "INT" },
                { name: "Connaissance de la nature", link1: "DEX", link2: "INT" },
                { name: "Connaissance des secrets", link1: "INT", link2: "CHA" },
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

        <form className="sheet__bottom--skills">
          <h3>Vos compétences spéciales</h3>
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
                    value={skill.score || calculateScore(skill.link1, skill.link2)}
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
        </form>
      </div>
      <div className="sheet__last-section">
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
          <button type="button" onClick={handleAddInventoryItem}>
            Ajouter un objet
          </button>
        </div>
        <div className="sheet__background">
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
        <button onClick={refreshPage}>Recommencer</button>
        <button onClick={handleSubmit}>Créer le personnage</button>
      </div>
    </div>
  );
}

export default CreateSheet;
