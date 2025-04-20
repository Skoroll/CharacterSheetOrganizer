import { useEffect, useState, useRef } from "react";
import { useUser } from "../../Context/UserContext";
import socket from "../../utils/socket";
import EasyAccessAria from "./EasyAccessAria/EasyAccessAria";
import EditableSheet from "../EditableSheet/EditableSheet";
import Modal from "../Modal/Modal";
import type { Character } from "../../types/Character";
import ToolTip from "../Tooltip/Tooltip";
import defaultImg from "../../assets/person-placeholder-5.webp";
import "./PlayersAtTable.scss";

interface Player {
  playerId: string;
  playerName: string;
  selectedCharacter: Character | null;
  isGameMaster: boolean;
  userId: string;
}

interface PlayerAtTableProps {
  tableId: string;
  API_URL: string;
  gameMaster: string;
  selectedCharacterId: string | null;
}

const PlayerAtTable: React.FC<PlayerAtTableProps> = ({ tableId, API_URL }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPersonalMenuOpen, setShowPersonalMenuOpen] = useState(false);
  const easyAccessRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCharacter, setModalCharacter] = useState<Character | null>(null);
  const [lastDrawnCard, setLastDrawnCard] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<{
    playerId: string;
    panel: string;
  } | null>(null);
  const { user } = useUser();
  const currentUserId = user?._id || null;



  const drawCard = async (character: Character) => {
    if (!character?._id) return;

    try {
      const response = await fetch(
        `${API_URL}/api/characters/${character._id}/drawAriaCard`,
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
        
        
        
                  

        // ✅ Mets à jour l'état local du deck
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => {
            if (player.selectedCharacter?._id === character._id)
              {
              const updatedCharacter = {
                ...player.selectedCharacter,
                magic: {
                  ...(player.selectedCharacter.magic ?? {
                    ariaMagic: false,
                    deathMagic: false,
                    deathMagicCount: 0,
                    deathMagicMax: 0,
                    ariaMagicCards: [],
                    ariaMagicUsedCards: [],
                  }),
                  ariaMagicCards:
                    player.selectedCharacter.magic?.ariaMagicCards?.filter(
                      (c) => c !== data.card
                    ) ?? [],
                  ariaMagicUsedCards: [
                    ...(player.selectedCharacter.magic?.ariaMagicUsedCards ?? []),
                    data.card,
                  ],
                },
              };
        
              return {
                ...player,
                selectedCharacter: updatedCharacter,
              };
            }
        
            return player;
          }) as Player[]
        );
        
      }
    } catch (err) {
      console.error("❌ Erreur réseau lors de la pioche :", err);
    }
  };



  useEffect(() => {
    if (!tableId) return;

    fetchPlayers();
    socket.emit("joinTable", tableId);

    socket.on("updateHealth", ({ characterId, pointsOfLife }) => {
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.selectedCharacter &&
          player.selectedCharacter._id === characterId
            ? {
                ...player,
                selectedCharacter: {
                  ...player.selectedCharacter,
                  pointsOfLife,
                },
              }
            : player
        )
      );
    });

    return () => {
      socket.off("updateHealth");
      socket.off("characterUpdated");
    };
  }, [tableId]);

  const fetchPlayers = async () => {
    if (!tableId) return;

    try {
      const response = await fetch(
        `${API_URL}/api/tabletop/tables/${tableId}/players`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }
      const data = await response.json();
      const clonedData = data.map((player: Player) => ({
        ...player,
        selectedCharacter: player.selectedCharacter
          ? { ...player.selectedCharacter }
          : null,
      }));

      setPlayers(clonedData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [tableId]);

  const updateHealth = async (character: Character, change: number) => {
    if (!character) return;

    const newHealth = character.pointsOfLife + change;
    if (newHealth < 0) return;

    try {
      const response = await fetch(
        `${API_URL}/api/characters/${character._id}/update-health`,
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

  const handlePlayerClick = (character: Character | null) => {
    if (character) {
      setModalCharacter(character);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        easyAccessRef.current &&
        !easyAccessRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setOpenPanel(null);
        setShowPersonalMenuOpen(false);
      }
    };

    if (showPersonalMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPersonalMenuOpen]);



  const otherPlayers = players.filter(
    (player) => !player.isGameMaster && player.userId !== currentUserId
  );

  const currentPlayer = players.find(
    (player) => !player.isGameMaster && player.userId === currentUserId
  );
  const currentCharacter = currentPlayer?.selectedCharacter;

  return (
    <div className="players-at-table">
      {players.length > 0 ? (
        <div className="players-at-table--container">
          {otherPlayers.map((player, index) => {
            const { selectedCharacter } = player;
            return (
              <div
                key={`${tableId}-${player.playerId || index}`}
                className="player bordered"
              >
                {selectedCharacter ? (
                  <div
                    className="player__image"
                    onClick={() => handlePlayerClick(selectedCharacter)}
                  >
                    <p className="character-hp">
                      <i className="fa-regular fa-heart"></i>
                      <i className="fa-solid fa-heart"></i>
                      <span>{selectedCharacter.pointsOfLife}</span>
                    </p>
                    {typeof selectedCharacter.image === "string" && (
  <ToolTip text={selectedCharacter.name} position="bottom">
    <img
      src={selectedCharacter.image}
      alt={selectedCharacter.name}
      onError={(e) => {
        e.currentTarget.src = defaultImg;
      }}
    />
  </ToolTip>
)}

                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            );
          })}

          {currentPlayer && currentCharacter && (
            <div
              key={`${tableId}-me-${currentPlayer.playerId}`}
              className="player is-current-user"
            >
              <div className="player__easy-access--wrapper">
                <ToolTip
                  text="Menu rapide"
                  position="top"
                  classTooltip="chevron"
                >
                  <button
                    ref={toggleButtonRef}
                    className="chevron"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPersonalMenuOpen((prev) => !prev);
                    }}
                  >
                    <i
                      className={`fa-solid ${
                        showPersonalMenuOpen
                          ? "fa-chevron-right"
                          : "fa-chevron-left"
                      }`}
                    ></i>
                  </button>
                </ToolTip>
                {showPersonalMenuOpen && (
  <div ref={easyAccessRef}>
<EasyAccessAria
  character={currentCharacter}
  updateHealth={updateHealth}
  openPanel={openPanel}
  setOpenPanel={setOpenPanel}
  setShowPersonalMenuOpen={setShowPersonalMenuOpen}
  easyAccessRef={easyAccessRef}
  toggleButtonRef={toggleButtonRef}
  playerId={currentPlayer.playerId}
  tableId={tableId}
  socket={socket}
  drawCard={drawCard} // <- il prend character en param
  lastDrawnCard={lastDrawnCard}
/>


  </div>
)}
              </div>
              <div
                className="player__image"
                onClick={() => handlePlayerClick(currentCharacter)}
              >
                <p className="character-hp">
                  <i className="fa-regular fa-heart"></i>
                  <i className="fa-solid fa-heart"></i>
                  <span>{currentCharacter.pointsOfLife}</span>
                </p>
                {typeof currentCharacter.image ==="string" && (
                  <ToolTip text={currentCharacter.name} position="bottom">
                    <img
                      src={currentCharacter.image}
                      alt={currentCharacter.name}
                      onError={(e) => {
                        e.currentTarget.src = defaultImg;
                      }}
                    />
                  </ToolTip>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Aucun joueur trouvé.</p>
      )}

      {isModalOpen && modalCharacter?._id && (
        <Modal
          title="Fiche du personnage"
          onClose={() => {
            setIsModalOpen(false);
            fetchPlayers(); // ✅ Refresh général des joueurs et personnages
          }}
        >
          <EditableSheet id={modalCharacter._id} tableId={tableId} />
        </Modal>
      )}
    </div>
  );
};

export default PlayerAtTable;
