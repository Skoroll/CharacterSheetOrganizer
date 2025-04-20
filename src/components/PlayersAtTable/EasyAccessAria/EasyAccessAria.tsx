import { Sword } from "phosphor-react";
import ToolTip from "../../Tooltip/Tooltip";
import { Character } from "../../../types/Character";
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
    drawCard: (character: Character) => void;
    lastDrawnCard: string | null;
    updateHealth: (character: Character, change: number) => void;
    setShowPersonalMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    easyAccessRef: React.RefObject<HTMLDivElement>; // ✅ Ajout ici
    toggleButtonRef: React.RefObject<HTMLButtonElement>; // ✅ Et ici
  }
  

type Panel = "hp" | "coins" | "inventory" | "gear" | "ariaMagic";

const EasyAccessAria = ({
  character,
  playerId,
  openPanel,
  setOpenPanel,
  drawCard,
  lastDrawnCard,
  updateHealth,
}: EasyAccessAriaProps) => {
  const togglePanel = (panel: Panel) => {
    setOpenPanel((prev) =>
      prev && prev.playerId === playerId && prev.panel === panel
        ? null
        : { playerId, panel }
    );
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
      </div>

      {isPanelOpen("hp") && (
        <>
          <button onClick={() => updateHealth(character, -1)}>
            <i className="fa-solid fa-chevron-down"></i>
          </button>
          <span>{character.pointsOfLife}</span>
          <button onClick={() => updateHealth(character, 1)}>
            <i className="fa-solid fa-chevron-up"></i>
          </button>
        </>
      )}

      {isPanelOpen("coins") && (
        <span className="coins">{character.gold} pièces</span>
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
        ) : (
          <p>Aucune arme équipée</p>
        ))}

      {isPanelOpen("ariaMagic") && (
        <div className="ariaMagic">
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
        </div>
      )}
    </div>
  );
};

export default EasyAccessAria;
