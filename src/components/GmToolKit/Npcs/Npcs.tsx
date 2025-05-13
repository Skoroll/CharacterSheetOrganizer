import { useState, useEffect, useRef } from "react";
import Modal from "../../Modal/Modal";
import NpcDetailsModal from "./NpcDetailsModal";
import { BeatLoader } from "react-spinners";
import { io } from "socket.io-client";
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
  tableId?: string;
  image?: string | File | null;
  location?: string;
  isGameMaster?: boolean;
}

interface NpcsProps {
  tableId: string;
  isGameMaster?: boolean;
}

export default function Npcs({ tableId, isGameMaster }: NpcsProps) {
  const [selectedNpc, setSelectedNpc] = useState<Npc | null>(null);
  const sentNpcIds = useRef<Set<string>>(new Set());
  const API_URL = import.meta.env.VITE_API_URL;
  const socketRef = useRef(io(API_URL, { autoConnect: false }));
  const [npcs, setNpcs] = useState<Npc[]>([]); // Liste des PNJs récupérés
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const initialNpcData: Npc = {
    _id: "",
    type: "Friendly",
    image: null,
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
    location: "",
  };

  const categories = [
    { label: "+ Nouveau PNJ", key: "new" },
    { label: "Amicaux", key: "friendly" },
    { label: "Hostiles", key: "hostile" },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [npcData, setNpcData] = useState<Npc>(initialNpcData);

  // Mapping des noms de stats en anglais -> français
  const statLabels: { [key: string]: string } = {
    strength: "Force",
    dexterity: "Dextérité",
    intelligence: "Intelligence",
    charisma: "Charisme",
    endurance: "Endurance",
  };

  const validateNpcData = () => {
    if (!npcData.name.trim()) return "Le nom du PNJ est requis.";
    if (npcData.age <= 0) return "L'âge doit être supérieur à 0.";
    if (npcData.inventory.some((item) => !item.item.trim()))
      return "Chaque objet d'inventaire doit avoir un nom.";
    if (npcData.specialSkills.some((skill) => !skill.name.trim()))
      return "Chaque compétence spéciale doit avoir un nom.";
    return null;
  };

  useEffect(() => {
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }

    socketRef.current.on("connect", () =>
      socketRef.current.emit("joinTable", tableId)
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [API_URL, tableId]);

  const handleDeleteNpc = async (npcId: string) => {
    if (!window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer ce PNJ ?"))
      return;

    try {
      const response = await fetch(`${API_URL}/api/npcs/${npcId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      alert("PNJ supprimé !");
      fetchNpcs(); // Met à jour la liste des PNJs
    } catch (error) {
      console.error("Erreur suppression PNJ :", error);
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
      console.error("Erreur lors du fetch des PNJs :", err);
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
    const validationError = validateNpcData();
    if (validationError) {
      setErrorMessage(validationError);
      setIsErrorModalOpen(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("tableId", tableId);
      formData.append("type", npcData.type);
      formData.append("name", npcData.name);
      formData.append("age", npcData.age.toString());
      formData.append("location", npcData.location?.toString() || "");
      formData.append("strength", npcData.strength.toString());
      formData.append("dexterity", npcData.dexterity.toString());
      formData.append("intelligence", npcData.intelligence.toString());
      formData.append("charisma", npcData.charisma.toString());
      formData.append("endurance", npcData.endurance.toString());
      formData.append("inventory", JSON.stringify(npcData.inventory));
      formData.append("specialSkills", JSON.stringify(npcData.specialSkills));
      formData.append("story", npcData.story);

      if (npcData.image instanceof File) {
        formData.append("image", npcData.image);
      }

      const response = await fetch(`${API_URL}/api/npcs`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de la création du PNJ.");

      setNpcData(initialNpcData);
      fetchNpcs();
    } catch (error) {
      setErrorMessage("Une erreur est survenue lors de la création du PNJ.");
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="npcs gm-tool">
      <div className="npcs__bar">
        <div className="npcs__bar--buttons">
          {categories.map(({ label, key }) => (
            <button key={key} onClick={() => handleCategoryClick(key)}>
              {label}
            </button>
          ))}
        </div>
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
              <label>
                Image :
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNpcData((prev) => ({ ...prev, image: file }));
                    }
                  }}
                />
              </label>
              <label>Nom :</label>
              <input
                type="text"
                name="name"
                value={npcData.name}
                onChange={handleChange}
              />
              <label>Lieu :</label>
              <input
                type="text"
                name="location"
                value={npcData.location}
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
                      name={key} // Associe la clé correcte
                      value={typeof statValue === "number" ? statValue : 0} // Vérifie et force un number
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
      {/* Affichage des PNJs Amicaux ou Hostiles */}
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
            <p>
              <BeatLoader />
            </p>
          ) : error ? (
            <p>Erreur : {error}</p>
          ) : filteredNpcs.length > 0 ? (
            <ul className="npcs__scroll">
              {filteredNpcs.map((npc) => (
                <li
                  key={npc._id}
                  className="npc"
                  onClick={() => setSelectedNpc(npc)}
                >
                  <h2>{npc.name}</h2>
                  {npc.image && typeof npc.image === "string" && (
                    <img
                      src={npc.image}
                      alt={npc.name}
                      className="npc__image"
                      width={90}
                      height={90}
                      style={{ borderRadius: "6px", objectFit: "cover" }}
                    />
                  )}
                  <div className="npc__btns">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNpc(npc._id);
                      }}
                      className="delete-btn"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <button
                      className="show-btn"
                      title="Afficher ce PNJ"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!sentNpcIds.current.has(npc._id)) {
                          socketRef.current.emit("sendNpcToDisplay", {
                            ...npc,
                            tableId,
                          });
                          sentNpcIds.current.add(npc._id);
                        }
                      }}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            filteredNpcs.length === 0 &&
            selectedCategory !== "new" && <p>Aucun PNJ trouvé.</p>
          )}
        </div>
      )}
      {isErrorModalOpen && errorMessage && (
        <Modal title="Erreur" onClose={() => setIsErrorModalOpen(false)}>
          <p>{errorMessage}</p>
        </Modal>
      )}
      {selectedNpc && (
        <NpcDetailsModal
          npc={selectedNpc}
          onClose={() => setSelectedNpc(null)}
          isGameMaster={isGameMaster}
          onSave={fetchNpcs} 
        />
      )}
    </div>
  );
}
