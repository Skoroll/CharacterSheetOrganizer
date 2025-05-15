import { useEffect, useState, useRef } from "react";
import { useUser } from "../../Context/UserContext";
import socket from "../../utils/socket";
import EasyAccessRouter from "./EasyAcces/renderEasyAccess";
import EditableSheet from "../EditableSheet/EditableSheetAria/EditableSheetAria";
import Modal from "../Modal/Modal";
import type { Character } from "../../types/Character";
import ToolTip from "../Tooltip/Tooltip";
import defaultImg from "../../assets/person-placeholder-5.webp";
import "./PlayersAtTable.scss";
import { frameOptions } from "../Premium/ChooseBannerFrame/ChooseBannerFrame";
import FrameOverlay from "../Premium/FrameOverlay/FrameOverlay";

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
  game: string;
}

const PlayerAtTable: React.FC<PlayerAtTableProps> = ({
  tableId,
  API_URL,
  game,
}) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPersonalMenuOpen, setShowPersonalMenuOpen] = useState(false);
  const easyAccessRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCharacter, setModalCharacter] = useState<Character | null>(null);
  const [openPanel, setOpenPanel] = useState<{
    playerId: string;
    panel: string;
  } | null>(null);
  const { user } = useUser();
  const currentUserId = user?._id || null;

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

  useEffect(() => {
    if (!tableId) return;

    const handleRefreshPlayers = () => {
      console.log("[SOCKET] refreshPlayers reçu → rafraîchir les joueurs");
      fetchPlayers();
    };

    socket.on("refreshPlayers", handleRefreshPlayers);

    return () => {
      socket.off("refreshPlayers", handleRefreshPlayers);
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
                        {selectedCharacter.selectedFrame && (
                          <FrameOverlay
                            frameSrc={
                              frameOptions[selectedCharacter.selectedFrame]
                            }
                            alt="Cadre"
                            className="frame-overlay--game"
                            width="100%"
                            height="100%"
                          />
                        )}

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
                {showPersonalMenuOpen && currentPlayer && currentCharacter && (
                  <div ref={easyAccessRef}>
                    <EasyAccessRouter
                      game={game}
                      character={currentCharacter}
                      playerId={currentPlayer.playerId}
                      openPanel={openPanel}
                      setOpenPanel={setOpenPanel}
                      setShowPersonalMenuOpen={setShowPersonalMenuOpen}
                      easyAccessRef={easyAccessRef}
                      toggleButtonRef={toggleButtonRef}
                      tableId={tableId}
                      socket={socket}
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
                {typeof currentCharacter.image === "string" && (
                  <ToolTip text={currentCharacter.name} position="bottom">
                    <>
                      {currentCharacter.selectedFrame && (
                        <FrameOverlay
                          frameSrc={
                            frameOptions[currentCharacter.selectedFrame]
                          }
                          alt="Cadre"
                          className="frame-overlay--game"
                          width="100%"
                          height="100%"
                        />
                      )}

                      <img
                        src={currentCharacter.image}
                        alt={currentCharacter.name}
                        onError={(e) => {
                          e.currentTarget.src = defaultImg;
                        }}
                      />
                    </>
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
            fetchPlayers(); // Refresh général des joueurs et personnages
          }}
        >
          <EditableSheet id={modalCharacter._id} tableId={tableId} />
        </Modal>
      )}
    </div>
  );
};

export default PlayerAtTable;
