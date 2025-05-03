import { useState, useEffect } from "react";
import socket from "../../../../utils/socket";
import { Sword } from "phosphor-react";
import ToolTip from "../../../Tooltip/Tooltip";
import { Character } from "../../../../types/Character";
import "./EasyAccessAria.scss";

interface EasyAccessAriaProps {
  character: Character;
  playerId: string;
  socket: any;
  tableId: string;

  openPanel: {
    playerId: string;
    panel: string;
  } | null;
  setOpenPanel: React.Dispatch<
    React.SetStateAction<{
      playerId: string;
      panel: string;
    } | null>
  >;
  setShowPersonalMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  easyAccessRef: React.RefObject<HTMLDivElement>;
  toggleButtonRef: React.RefObject<HTMLButtonElement>; 
}

type Panel = "hp" | "coins" | "inventory" | "gear" | "ariaMagic" | "deathMagic";

const EasyAccessAria = ({
  character,
  playerId,
  openPanel,
  setOpenPanel,
  tableId,
}: EasyAccessAriaProps) => {
  const togglePanel = (panel: Panel) => {
    setOpenPanel((prev) =>
      prev && prev.playerId === playerId && prev.panel === panel
        ? null
        : { playerId, panel }
    );
  };
  const [isEditingGold, setIsEditingGold] = useState(false);
  const [editedGold, setEditedGold] = useState(character.gold);
  const [lastDrawnCard, setLastDrawnCard] = useState<string | null>(null);
  const [localDeathMagicCount, setLocalDeathMagicCount] = useState(character.magic?.deathMagicCount ?? 0);

  const handleChangeDeathMagic = async (change: number) => {
    const current = localDeathMagicCount;
    const max = character.magic?.deathMagicMax ?? 0;
    const newCount = current + change;
  
    if (newCount < 0 || newCount > max) return;
  
    // Optimistic update
    setLocalDeathMagicCount(newCount);
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/characters/${character._id}/update-death-magic`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deathMagicCount: newCount, tableId }),
        }
      );
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Erreur HTTP ${response.status}: ${errorResponse.message}`);
      }
  
      const data = await response.json();
  
      if (character.magic) {
        character.magic.deathMagicCount = data.magic.deathMagicCount;
      }
  
      setLocalDeathMagicCount(data.magic.deathMagicCount);
      
    } catch (error) {
      console.error("❌ Erreur mise à jour des points de magie de mort :", error);
      // Si erreur, on peut revenir à la valeur précédente si besoin
      setLocalDeathMagicCount(current);
    }
  };
  

  const updateGold = async () => {
    if (editedGold < 0) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/characters/${
          character._id
        }/update-gold`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gold: editedGold }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `Erreur HTTP ${response.status} : ${errorResponse.message}`
        );
      }

      setIsEditingGold(false);
      character.gold = editedGold; // met à jour localement sans rechargement
    } catch (error) {
      console.error("❌ Erreur mise à jour de l'or :", error);
    }
  };

  const updateHealth = async (character: Character, change: number) => {
    const newHealth = character.pointsOfLife + change;
    if (newHealth < 0) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/characters/${
          character._id
        }/update-health`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pointsOfLife: newHealth, tableId }),
        }
      );
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `Erreur HTTP ${response.status}: ${errorResponse.message}`
        );
      }
    } catch (error) {
      console.error("❌ Erreur mise à jour des PV :", error);
    }
  };

  const drawCard = async (character: Character) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/characters/${
          character._id
        }/drawAriaCard`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("❌ Erreur lors de la pioche :", response.status, text);
        return;
      }

      const data = await response.json();
      if (data.card) {
        setLastDrawnCard(data.card);

        const suitMap = {
          H: "♥️",
          D: "♦️",
          C: "♣️",
          S: "♠️",
          "♥": "♥️",
          "♦": "♦️",
          "♣": "♣️",
          "♠": "♠️",
        };

        const value = data.card.slice(0, -1);
        const suit = data.card.slice(-1) as keyof typeof suitMap;
        const symbol = suitMap[suit] ?? "❓";

        socket.emit("chatMessage", {
          content: `${character.name} a pioché la carte ${value}${symbol}.`,
          characterName: "Système",
          senderName: "Système",
          tableId,
          isSystem: true,
        });
      }
    } catch (err) {
      console.error("❌ Erreur réseau lors de la pioche :", err);
    }
  };

  const getSuitIcon = (card: string) => {
    const suit = card.slice(-1);
    switch (suit) {
      case "H":
        return <span style={{ color: "red" }}>♥️</span>;
      case "D":
        return <span style={{ color: "red" }}>♦️</span>;
      case "C":
        return <span style={{ color: "green" }}>♣️</span>;
      case "S":
        return <span style={{ color: "black" }}>♠️</span>;
      default:
        return null;
    }
  };

  useEffect(() => {
    setLocalDeathMagicCount(character.magic?.deathMagicCount ?? 0);
  }, [character.magic?.deathMagicCount]);

  const isPanelOpen = (panel: string) => openPanel?.panel === panel;

  return (
    <div className="player__easy-access">
      <div className="player__easy-access--buttons">
        <ToolTip text="Santé" position="top">
          <button onClick={() => togglePanel("hp")}>
            {" "}
            <i className="fa-regular fa-heart"></i>{" "}
          </button>
        </ToolTip>
        <ToolTip text="Argent" position="top">
          <button onClick={() => togglePanel("coins")}>
            {" "}
            <i className="fa-solid fa-coins"></i>{" "}
          </button>
        </ToolTip>
        <ToolTip text="Inventaire" position="top">
          <button onClick={() => togglePanel("inventory")}>
            {" "}
            <i className="fa-solid fa-briefcase"></i>{" "}
          </button>
        </ToolTip>
        <ToolTip text="Arme(s)" position="top">
          <button onClick={() => togglePanel("gear")}>
            {" "}
            <Sword size={18} />{" "}
          </button>
        </ToolTip>
        {character.magic?.ariaMagic && (
          <ToolTip text="Magie d'Aria" position="top">
            <button onClick={() => togglePanel("ariaMagic")}>
              <i className="fa-solid fa-wand-sparkles"></i>
            </button>
          </ToolTip>
        )}
        <ToolTip text="Magie de la mort" position="top">
          <button onClick={() => togglePanel("deathMagic")}>
            <i className="fa-solid fa-skull"></i>
          </button>
        </ToolTip>
      </div>

      {isPanelOpen("hp") && (
        <div className="player__easy--wrapper player-hp">
          <button onClick={() => updateHealth(character, -1)}>
            <i className="fa-solid fa-chevron-down"></i>
          </button>
          <span>{character.pointsOfLife}</span>
          <button onClick={() => updateHealth(character, 1)}>
            <i className="fa-solid fa-chevron-up"></i>
          </button>
        </div>
      )}

      {isPanelOpen("coins") && (
        <div className="coins ">
          {isEditingGold ? (
            <>
              <input
                type="number"
                value={editedGold}
                onChange={(e) => setEditedGold(Number(e.target.value))}
                className="gold-input"
              />
              <button onClick={updateGold}>
                <i className="fa-solid fa-check"></i>
              </button>
              <button
                onClick={() => {
                  setEditedGold(character.gold);
                  setIsEditingGold(false);
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </>
          ) : (
            <>
              <span>{character.gold} pièces</span>
              <button onClick={() => setIsEditingGold(true)}>
                <i className="fa-solid fa-feather-pointed"></i>
              </button>
            </>
          )}
        </div>
      )}

      {isPanelOpen("inventory") &&
        (character.inventory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th className="table-left">Objet</th>
                <th>Quantité</th>
              </tr>
            </thead>
            <tbody>
              {character.inventory
                .filter((item) => item.item.trim() !== "")
                .map((item, index) => (
                  <tr key={index}>
                    <td className="table-left">{item.item}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun objet dans l'inventaire</p>
        ))}

      {isPanelOpen("gear") &&
        (character.weapons.length > 0 ? (
          <div className="gear">
            <table>
              <thead>
                <tr>
                  <th className="table-left">Arme</th>
                  <th>Dégâts</th>
                </tr>
              </thead>
              <tbody>
                {character.weapons
                  .filter((weapon) => weapon.name.trim() !== "")
                  .map((weapon, index) => (
                    <tr key={index}>
                      <td className="table-left">{weapon.name}</td>
                      <td>{weapon.damage}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aucune arme équipée</p>
        ))}

      {isPanelOpen("deathMagic") && (
        <div className="death-magic">
          <ToolTip text="Magie de mort restante" position="top">
            <span className="death-magic__label">Magie de la mort</span>
          </ToolTip>
          <div className="death-magic__controls">
            <button onClick={() => handleChangeDeathMagic(-1)}>
              <i className="fa-solid fa-chevron-down"></i>
            </button>
            <span>
  {localDeathMagicCount} / {character.magic?.deathMagicMax ?? 0}
</span>


            <button onClick={() => handleChangeDeathMagic(1)}>
              <i className="fa-solid fa-chevron-up"></i>
            </button>
          </div>
        </div>
      )}

      {isPanelOpen("ariaMagic") && (
        <div className="ariaMagic">
          <div className="ariaMagic__help">
            <ToolTip text="Manipuler les émotions" position="top">
              <span style={{ color: "red", fontSize: "1.2rem" }}>♥️</span>
            </ToolTip>
            <ToolTip text="Manipuler la matière" position="top">
              <span style={{ color: "red", fontSize: "1.2rem" }}>♦️</span>
            </ToolTip>

            <ToolTip text="Manipuler les éléments" position="top">
              <span
                style={{
                  color: "green",
                  fontSize: "1.2rem",
                }}
              >
                ♣️
              </span>
            </ToolTip>

            <ToolTip text="Manipuler la mort" position="top">
              <span
                style={{
                  color: "black",
                  fontSize: "1.2rem",
                }}
              >
                ♠️
              </span>
            </ToolTip>
          </div>
          <p>
            Cartes restantes : {character?.magic?.ariaMagicCards?.length ?? 0}
          </p>
          <button className="card-draw" onClick={() => drawCard(character)}>
            Piocher
          </button>

          {lastDrawnCard && (
            <p className="drawn-card">
              Carte piochée : {getSuitIcon(lastDrawnCard)}{" "}
              <strong>{lastDrawnCard.slice(0, -1)}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EasyAccessAria;
