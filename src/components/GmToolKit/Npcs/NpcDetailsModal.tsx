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
  return (
    <Modal title={`Détails de ${npc.name}`} onClose={onClose}>
      <div className="npc-details">
        <div className="npc-details--first-block">
          {npc.image && typeof npc.image === "string" && (
            <img
              src={npc.image}
              alt={npc.name}
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
              <strong>Force :</strong> {npc.strength}
            </li>
            <li>
              <strong>Dextérité :</strong> {npc.dexterity}
            </li>
            <li>
              <strong>Intelligence :</strong> {npc.intelligence}
            </li>
            <li>
              <strong>Charisme :</strong> {npc.charisma}
            </li>
            <li>
              <strong>Endurance :</strong> {npc.endurance}
            </li>
          </ul>
        </div>
        <p>
          <strong>Âge :</strong> {npc.age} ans
        </p>
        <p>
          <strong>Lieu :</strong> {npc.location}
        </p>
        <CollapseGroup>
          <Collapse
            id="0"
            title="Compétences spéciales"
            content={
              <ul>
                {npc.specialSkills.map((skill, index) => (
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
                {npc.inventory.map((item, index) => (
                  <li key={index}>
                    {item.item} × {item.quantity}
                  </li>
                ))}
              </ul>
            }
          />
            {isGameMaster &&
          <Collapse id="2" title="Histoire" content={<p>{npc.story}</p>} />
        }
        </CollapseGroup>
      </div>
    </Modal>
  );
}
