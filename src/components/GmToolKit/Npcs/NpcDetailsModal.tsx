import { useState } from "react";
import Collapse from "../../Collapse/Collapse";
import { CollapseGroup } from "../../../Context/CollapseGroup";
import Modal from "../../Modal/Modal";
import { Npc } from "../../../types/Npc";

interface NpcDetailsModalProps {
  npc: Npc;
  onClose: () => void;
  isGameMaster?: boolean;
}

export default function NpcDetailsModal({
  npc,
  onClose,
  isGameMaster,
}: NpcDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNpc, setEditedNpc] = useState<Npc>(npc);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedNpc((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/api/npcs/${npc._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedNpc),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du PNJ");

      setIsEditing(false);
      onClose(); // Optionnel : recharger les données parent si besoin
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
      console.error(err);
    }
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
          <ul>
            <li>
              <strong>Force :</strong> {editedNpc.strength}
            </li>
            <li>
              <strong>Dextérité :</strong> {editedNpc.dexterity}
            </li>
            <li>
              <strong>Intelligence :</strong> {editedNpc.intelligence}
            </li>
            <li>
              <strong>Charisme :</strong> {editedNpc.charisma}
            </li>
            <li>
              <strong>Endurance :</strong> {editedNpc.endurance}
            </li>
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
              <ul>
                {editedNpc.specialSkills.map((skill, index) => (
                  <li key={index}>
                    {skill.name} ({skill.score})
                  </li>
                ))}
              </ul>
            }
          />
          <Collapse
            id="1"
            title="Inventaire"
            content={
              <ul>
                {editedNpc.inventory.map((item, index) => (
                  <li key={index}>
                    {item.item} × {item.quantity}
                  </li>
                ))}
              </ul>
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
