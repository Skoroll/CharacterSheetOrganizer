import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import "./Npcs.scss";

interface Npc {
  type: "Friendly" | "Hostile";
  _id: string;
  name: string;
  age: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  charisma: number;
  endurance: number;
  inventory: { item: string; quantity: number }[];
  specialSkills: { name: string; score: number }[];
  story: string;
  tableId?: string; // ✅ Ajout de tableId
}

interface NpcsProps {
  tableId: string;
}

export default function Npcs({ tableId }: NpcsProps) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [npcs, setNpcs] = useState<Npc[]>([]); // Liste des PNJs récupérés
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { label: "+ Nouveau PNJ", key: "new" },
    { label: "Amicaux", key: "friendly" },
    { label: "Hostiles", key: "hostile" },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [npcData, setNpcData] = useState<Npc>({
    _id: "",
    type: "Friendly",
    name: "",
    age: 1,
    strength: 50,
    dexterity: 50,
    intelligence: 50,
    charisma: 50,
    endurance: 50,
    inventory: [],
    specialSkills: [],
    story: "",
    tableId: tableId || "",
  });

  // Mapping des noms de stats en anglais -> français
  const statLabels: { [key: string]: string } = {
    strength: "Force",
    dexterity: "Dextérité",
    intelligence: "Intelligence",
    charisma: "Charisme",
    endurance: "Endurance",
  };

  const handleDeleteNpc = async (npcId: string) => {
    if (!window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce PNJ ?"))
      return;

    try {
      const response = await fetch(`${API_URL}/api/npcs/${npcId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      alert("✅ PNJ supprimé !");
      fetchNpcs(); // 🔄 Met à jour la liste des PNJs
    } catch (error) {
      console.error("❌ Erreur suppression PNJ :", error);
      alert("Erreur lors de la suppression du PNJ.");
    }
  };

  const handleCategoryClick = (key: string) => {

    setSelectedCategory(key);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNpcData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const addInventoryItem = () => {
    setNpcData((prev) => ({
      ...prev,
      inventory: [...prev.inventory, { item: "", quantity: 1 }],
    }));
  };

  const updateInventoryItem = (
    index: number,
    key: string,
    value: string | number
  ) => {
    setNpcData((prev) => {
      const updatedInventory = [...prev.inventory];
      updatedInventory[index] = { ...updatedInventory[index], [key]: value };
      return { ...prev, inventory: updatedInventory };
    });
  };

  const removeInventoryItem = (index: number) => {
    setNpcData((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((_, i) => i !== index),
    }));
  };

  const addSpecialSkill = () => {
    setNpcData((prev) => ({
      ...prev,
      specialSkills: [...prev.specialSkills, { name: "", score: 0 }],
    }));
  };

  const updateSpecialSkill = (
    index: number,
    key: string,
    value: string | number
  ) => {
    setNpcData((prev) => {
      const updatedSkills = [...prev.specialSkills];
      updatedSkills[index] = { ...updatedSkills[index], [key]: value };
      return { ...prev, specialSkills: updatedSkills };
    });
  };

  const removeSpecialSkill = (index: number) => {
    setNpcData((prev) => ({
      ...prev,
      specialSkills: prev.specialSkills.filter((_, i) => i !== index),
    }));
  };

  const filteredNpcs =
    selectedCategory === "friendly"
      ? npcs.filter((npc) => npc.type === "Friendly")
      : selectedCategory === "hostile"
      ? npcs.filter((npc) => npc.type === "Hostile")
      : [];

  // Fonction pour récupérer les PNJs liés à la table
  const fetchNpcs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/npcs/${tableId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des PNJs.");
      }
      const data: Npc[] = await response.json();
      setNpcs(data);
    } catch (err) {
      console.error("❌ Erreur lors du fetch des PNJs :", err);
      setError("Impossible de récupérer les PNJs.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les PNJs au montage
  useEffect(() => {
    fetchNpcs();
  }, [tableId]); // Re-fetch si le tableId change

  const handleSubmit = async () => {
    if (!tableId) {
      alert("Impossible de créer un PNJ : ID de la table introuvable.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/npcs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(npcData),
      });

      if (!response.ok) throw new Error("Erreur lors de la création du PNJ.");

      alert("✅ PNJ créé avec succès !");

      setTimeout(() => {
        fetchNpcs(); // 🔄 Attendre un peu avant de récupérer la liste mise à jour
      }, 500); // Ajout d'un délai pour assurer la mise à jour
    } catch (error) {
      console.error("❌ Erreur :", error);
    }
  };

  return (
    <div className="npcs gm-tool">
      <div className="npcs__bar">
        <ul>
          {categories.map(({ label, key }) => (
            <li key={key} onClick={() => handleCategoryClick(key)}>
              {label}
            </li>
          ))}
        </ul>
      </div>

      {selectedCategory === "new" && (
        <div className="npcs__form">
          <h3>Créer un nouveau PNJ</h3>
          <div className="form-content">
            <div className="npcs__form--base">
              <label>Type :</label>
              <select name="type" value={npcData.type} onChange={handleChange}>
                <option value="Friendly">Amical</option>
                <option value="Hostile">Hostile</option>
              </select>

              <label>Nom :</label>
              <input
                type="text"
                name="name"
                value={npcData.name}
                onChange={handleChange}
              />

              <label>Âge :</label>
              <input
                type="number"
                name="age"
                value={npcData.age}
                onChange={handleChange}
              />

              <label>Stats :</label>
              {Object.entries(statLabels).map(([key, label]) => {
                const statValue = npcData[key as keyof Npc];

                return (
                  <div key={key}>
                    <label>{label} :</label>
                    <input
                      type="number"
                      name={key} // ✅ Associe la clé correcte
                      value={typeof statValue === "number" ? statValue : 0} // ✅ Vérifie et force un number
                      onChange={(e) =>
                        setNpcData({
                          ...npcData,
                          [key]: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                );
              })}
            </div>
            <div className="npcs__form--details">
              <h4>Inventaire</h4>
              {npcData.inventory.map((item, index) => (
                <div key={index} className="inventory-item">
                  <input
                    type="text"
                    placeholder="Nom de l'objet"
                    value={item.item}
                    onChange={(e) =>
                      updateInventoryItem(index, "item", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Quantité"
                    value={item.quantity}
                    onChange={(e) =>
                      updateInventoryItem(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                  />
                  <button onClick={() => removeInventoryItem(index)}>❌</button>
                </div>
              ))}
              <button onClick={addInventoryItem}>+ Ajouter un objet</button>

              <h4>Compétences spéciales</h4>
              {npcData.specialSkills.map((skill, index) => (
                <div key={index} className="special-skill">
                  <input
                    type="text"
                    placeholder="Nom de la compétence"
                    value={skill.name}
                    onChange={(e) =>
                      updateSpecialSkill(index, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Score"
                    value={skill.score}
                    onChange={(e) =>
                      updateSpecialSkill(index, "score", Number(e.target.value))
                    }
                  />
                  <button onClick={() => removeSpecialSkill(index)}>❌</button>
                </div>
              ))}
              <button onClick={addSpecialSkill}>
                + Ajouter une compétence
              </button>
              <h4>Histoire</h4>
              <textarea
                name="story"
                value={npcData.story}
                onChange={handleChange}
              />
            </div>
          </div>
          <button className="create-npc" onClick={handleSubmit}>
            Créer PNJ
          </button>
        </div>
      )}
      {/* ✅ Affichage des PNJs Amicaux ou Hostiles */}
      {selectedCategory && (
        <div className="npcs__list">
          <h3>
            {selectedCategory === "friendly"
              ? "PNJs Amicaux"
              : selectedCategory === "hostile"
              ? "PNJs Hostiles"
              : ""}
          </h3>

          {loading ? (
            <p><BeatLoader/></p>
          ) : error ? (
            <p>Erreur : {error}</p>
          ) : filteredNpcs.length > 0 ? (
            <ul className="npcs__scroll">
              {filteredNpcs.map((npc) => (
                <li key={npc._id} className="npc">
                  <h2>
                    {npc.name}
                    <button
                      onClick={() => handleDeleteNpc(npc._id)}
                      className="delete-btn"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </h2>
                  <p>{npc.age} ans</p>
                  <div className="npc__stats">
                    <ul>
                      <li>
                        Force: <span>{npc.strength}</span>
                      </li>
                      <li>
                        Dexterité: <span>{npc.dexterity}</span>
                      </li>
                      <li>
                        Endurance: <span>{npc.endurance}</span>
                      </li>
                      <li>
                        Intelligence: <span>{npc.intelligence}</span>
                      </li>
                      <li>
                        Charisme: <span>{npc.charisma}</span>
                      </li>
                    </ul>
                    <ul>
                      {npc.specialSkills.map((skill, index) => (
                        <li key={index}>
                          {skill.name} | <span>{skill.score}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="npc__items">
                    <p>Inventaire</p>
                    <ul>
                      {npc.inventory.map((item, index) => (
                        <li key={index}>
                          {" "}
                          {item.item} <span>{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p>{npc.story}</p>
                </li>
              ))}
            </ul>
          ) : (
            filteredNpcs.length === 0 &&
            selectedCategory !== "new" && <p>Aucun PNJ trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}
