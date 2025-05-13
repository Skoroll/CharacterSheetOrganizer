import { useState } from "react";
import Collapse from "../../Collapse/Collapse";
import { CollapseGroup } from "../../../Context/CollapseGroup";
import Modal from "../../Modal/Modal";
import { Npc } from "../../../types/Npc";

interface NpcDetailsModalProps {
  npc: Npc;
  onClose: () => void;
  isGameMaster?: boolean;
  onSave?: () => void;
}

export default function NpcDetailsModal({
  npc,
  onClose,
  isGameMaster,
  onSave
}: NpcDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNpc, setEditedNpc] = useState<Npc>({
    ...npc,
    specialSkills: npc.specialSkills || [],
    inventory: npc.inventory || [],
  });
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedNpc((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in editedNpc) {
        if (key === "specialSkills" || key === "inventory") {
          formData.append(key, JSON.stringify((editedNpc as any)[key]));
        } else if (key === "image" && editedNpc.image instanceof File) {
          formData.append("image", editedNpc.image);
        } else if ((editedNpc as any)[key] !== undefined) {
          formData.append(key, String((editedNpc as any)[key]));
        }
      }

      const res = await fetch(`${API_URL}/api/npcs/${npc._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du PNJ");

      setIsEditing(false);
      onClose();
      onSave?.();
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
      console.error(err);
    }
  };

  const updateSpecialSkill = (index: number, key: string, value: string | number) => {
    const updated = [...editedNpc.specialSkills];
    updated[index] = { ...updated[index], [key]: value };
    setEditedNpc({ ...editedNpc, specialSkills: updated });
  };

  const updateInventoryItem = (index: number, key: string, value: string | number) => {
    const updated = [...editedNpc.inventory];
    updated[index] = { ...updated[index], [key]: value };
    setEditedNpc({ ...editedNpc, inventory: updated });
  };

  return (
    <Modal title={editedNpc.name} onClose={onClose}>
      <div className="npc-details">
        <div className="npc-details--first-block">
          {editedNpc.image && typeof editedNpc.image === "string" && (
            <img
              src={editedNpc.image}
              alt={editedNpc.name}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "6px",
                objectFit: "cover",
              }}
            />
          )}
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setEditedNpc((prev) => ({ ...prev, image: file }));
                }
              }}
            />
          )}
          <ul>
            {["strength", "dexterity", "intelligence", "charisma", "endurance"].map((stat) => (
              <li key={stat}>
                <strong>{stat.charAt(0).toUpperCase() + stat.slice(1)} :</strong>{" "}
                {isEditing ? (
                  <input
                    type="number"
                    name={stat}
                    value={(editedNpc as any)[stat]}
                    onChange={handleChange}
                  />
                ) : (
                  (editedNpc as any)[stat]
                )}
              </li>
            ))}
          </ul>
        </div>

        <p>
          <strong>Âge :</strong>{" "}
          {isEditing ? (
            <input
              type="number"
              name="age"
              value={editedNpc.age}
              onChange={handleChange}
            />
          ) : (
            `${editedNpc.age} ans`
          )}
        </p>
        <p>
          <strong>Lieu :</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={editedNpc.location}
              onChange={handleChange}
            />
          ) : (
            editedNpc.location
          )}
        </p>

        <CollapseGroup>
          <Collapse
            id="0"
            title="Compétences spéciales"
            content={
              isEditing ? (
                <>
                  {editedNpc.specialSkills.map((skill, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        placeholder="Nom"
                        value={skill.name}
                        onChange={(e) => updateSpecialSkill(index, "name", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Score"
                        value={skill.score}
                        onChange={(e) => updateSpecialSkill(index, "score", Number(e.target.value))}
                      />
                      <button
                        onClick={() => {
                          const updated = [...editedNpc.specialSkills];
                          updated.splice(index, 1);
                          setEditedNpc({ ...editedNpc, specialSkills: updated });
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setEditedNpc({
                        ...editedNpc,
                        specialSkills: [...editedNpc.specialSkills, { name: "", score: 0 }],
                      })
                    }
                  >
                    + Ajouter une compétence
                  </button>
                </>
              ) : (
                <ul>
                  {editedNpc.specialSkills.map((skill, index) => (
                    <li key={index}>
                      {skill.name} ({skill.score})
                    </li>
                  ))}
                </ul>
              )
            }
          />
          <Collapse
            id="1"
            title="Inventaire"
            content={
              isEditing ? (
                <>
                  {editedNpc.inventory.map((item, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        placeholder="Objet"
                        value={item.item}
                        onChange={(e) => updateInventoryItem(index, "item", e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={item.quantity}
                        onChange={(e) =>
                          updateInventoryItem(index, "quantity", Number(e.target.value))
                        }
                      />
                      <button
                        onClick={() => {
                          const updated = [...editedNpc.inventory];
                          updated.splice(index, 1);
                          setEditedNpc({ ...editedNpc, inventory: updated });
                        }}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setEditedNpc({
                        ...editedNpc,
                        inventory: [...editedNpc.inventory, { item: "", quantity: 1 }],
                      })
                    }
                  >
                    + Ajouter un objet
                  </button>
                </>
              ) : (
                <ul>
                  {editedNpc.inventory.map((item, index) => (
                    <li key={index}>
                      {item.item} × {item.quantity}
                    </li>
                  ))}
                </ul>
              )
            }
          />
          <Collapse
            id="2"
            title="Histoire"
            content={
              isEditing ? (
                <textarea
                  name="story"
                  value={editedNpc.story}
                  onChange={handleChange}
                  rows={6}
                />
              ) : (
                <p style={{ whiteSpace: "pre-line" }}>{editedNpc.story}</p>
              )
            }
          />
        </CollapseGroup>
        <div className="npc-details__edit-btns">
          {isGameMaster && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              ✏️ Modifier
            </button>
          )}
          {isGameMaster && isEditing && (
            <button onClick={handleSave} className="save-btn">
              💾 Enregistrer
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
