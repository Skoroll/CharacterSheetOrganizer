import { useEffect, useState, useRef } from "react";
import { useUser } from "../../Context/UserContext";
import { Sword } from "phosphor-react";
import { io, Socket } from "socket.io-client";
import "./PlayersAtTable.scss";
import EditableSheet from "../EditableSheet/EditableSheet";
import Modal from "../Modal/Modal";
import ToolTip from "../Tooltip/Tooltip";
import defaultImg from "../../assets/person-placeholder-5.webp";

interface Character {
  _id: string;
  name: string;
  image?: string;
  className: string;
  age: number;
  strength: number;
  dexterity: number;
  endurance: number;
  intelligence: number;
  charisma: number;
  pointsOfLife: number;
  gold: number;
  injuries: string;
  protection: string;
  background: string;
  origin: string;
  weapons: { name: string; damage: string }[];
  skills: {
    specialSkill: string;
    score: number;
    link1: string;
    link2: string;
  }[];
  inventory: { item: string; quantity: number }[];
  tableId?: string; // ✅ Correction ici
}

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

const socket: Socket = io(import.meta.env.VITE_API_URL);

const PlayerAtTable: React.FC<PlayerAtTableProps> = ({ tableId, API_URL }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPersonalMenuOpen, setShowPersonalMenuOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const easyAccessRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      setPlayers(data);
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
        console.error("❌ Erreur réponse serveur :", errorResponse);
        throw new Error(
          `Erreur HTTP ${response.status}: ${errorResponse.message}`
        );
      }

      const updatedCharacter = await response.json();
      console.log("✅ Réponse serveur :", updatedCharacter);
    } catch (error) {
      console.error("❌ Erreur mise à jour des PV :", error);
    }
  };

  const handlePlayerClick = (character: Character | null) => {
    if (character) {
      setSelectedCharacter(character);
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

    // Seulement quand le menu est ouvert
    if (showPersonalMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showPersonalMenuOpen]);

  const togglePanel = (
    playerId: string,
    panel: "hp" | "coins" | "inventory" | "gear"
  ) => {
    setOpenPanel((prev) =>
      prev && prev.playerId === playerId && prev.panel === panel
        ? null
        : { playerId, panel }
    );
  };

  const otherPlayers = players.filter(
    (player) => !player.isGameMaster && player.userId !== currentUserId
  );

  const currentPlayer = players.find(
    (player) => !player.isGameMaster && player.userId === currentUserId
  );

  return (
    <div className="players-at-table">
      {players.length > 0 ? (
        <div className="players-at-table--container">
          {otherPlayers.map((player, index) => {
            const { selectedCharacter } = player;
            return (
              <div
                key={`${tableId}-${player.playerId || index}`}
                className="player"
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
                    {selectedCharacter.image && (
                      <img
                        src={
                          typeof selectedCharacter.image === "string"
                            ? selectedCharacter.image
                            : URL.createObjectURL(selectedCharacter.image)
                        }
                        alt={selectedCharacter.name}
                        onError={(e) => {
                          e.currentTarget.src = defaultImg;
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <p></p>
                )}
              </div>
            );
          })}

          {currentPlayer &&
            (() => {
              const { selectedCharacter } = currentPlayer;
              return (
                <div
                  key={`${tableId}-me-${currentPlayer.playerId}`}
                  className="player is-current-user"
                >
                  <div className="player__easy-access--wrapper">
                    {/* Boutons easy-access visibles uniquement pour le propriétaire */}
                    {selectedCharacter && (
                      <>
                      <ToolTip text="Menu rapide" position="top" classTooltip="chevron">
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
                          <div
                            className="player__easy-access"
                            ref={easyAccessRef}
                          >
                            {/* Boutons */}
                            <div className="player__easy-access--buttons">
                            <ToolTip text="Santé" position="top">
                              <button
                                onClick={() =>
                                  togglePanel(currentPlayer.playerId, "hp")
                                }
                              >
                                <i className="fa-regular fa-heart"></i>
                              </button>
                              </ToolTip>
                              <ToolTip text="Argent" position="top">
                              <button
                                onClick={() =>
                                  togglePanel(currentPlayer.playerId, "coins")
                                }
                              >
                                <i className="fa-solid fa-coins"></i>
                              </button>
                              </ToolTip>
                              <ToolTip text="Inventaire" position="top">
                              <button
                                onClick={() =>
                                  togglePanel(
                                    currentPlayer.playerId,
                                    "inventory"
                                  )
                                }
                              >
                                <i className="fa-solid fa-briefcase"></i>
                              </button>
                              </ToolTip>
                              <ToolTip text="Arme(s)" position="top">
                              <button
                                onClick={() =>
                                  togglePanel(currentPlayer.playerId, "gear")
                                }
                              >
                                <Sword size={18} />
                              </button>
                              </ToolTip>
                            </div>

                            {/* Affichage du contenu dynamique */}
                            {openPanel &&
                              openPanel.playerId === currentPlayer.playerId && (
                                <div className="player__easy-access--inside">
                                  {openPanel.panel === "hp" && (
                                    <>
                                      <button className="health-modifier">
                                        <i
                                          className="fa-solid fa-chevron-down"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updateHealth(selectedCharacter, -1);
                                          }}
                                        ></i>
                                      </button>
                                      <span>
                                        {selectedCharacter.pointsOfLife}
                                      </span>
                                      <button className="health-modifier">
                                        <i
                                          className="fa-solid fa-chevron-up"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            updateHealth(selectedCharacter, 1);
                                          }}
                                        ></i>
                                      </button>
                                    </>
                                  )}

                                  {openPanel.panel === "coins" && (
                                    <span className="coins">
                                      {selectedCharacter.gold} pièces
                                    </span>
                                  )}

                                  {openPanel.panel === "inventory" &&
                                  selectedCharacter.inventory.length > 0 ? (
                                    <table>
                                      <thead>
                                        <tr>
                                          <th className="table-left">Objet</th>
                                          <th>Quantité</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedCharacter.inventory
                                          .filter(
                                            (item) => item.item.trim() !== ""
                                          )
                                          .map((item, index) => (
                                            <tr key={index}>
                                              <td className="table-left">
                                                {item.item}
                                              </td>
                                              <td>{item.quantity}</td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  ) : (
                                    openPanel.panel === "inventory" && (
                                      <p>Aucun objet dans l'inventaire</p>
                                    )
                                  )}

                                  {openPanel.panel === "gear" &&
                                    (selectedCharacter.weapons.length > 0 ? (
                                      <table>
                                        <thead>
                                          <tr>
                                            <th className="table-left">Arme</th>
                                            <th>Dégâts</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {selectedCharacter.weapons
                                            .filter(
                                              (weapon) =>
                                                weapon.name.trim() !== ""
                                            )
                                            .map((weapon, index) => (
                                              <tr key={index}>
                                                <td className="table-left">
                                                  {weapon.name}
                                                </td>
                                                <td>{weapon.damage}</td>
                                              </tr>
                                            ))}
                                        </tbody>
                                      </table>
                                    ) : (
                                      <p>Aucune arme équipée</p>
                                    ))}
                                </div>
                              )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* Affichage du personnage */}
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
                      {selectedCharacter.image && (
                        <img
                          src={
                            typeof selectedCharacter.image === "string"
                              ? selectedCharacter.image
                              : URL.createObjectURL(selectedCharacter.image)
                          }
                          alt={selectedCharacter.name}
                          onError={(e) => {
                            e.currentTarget.src = defaultImg;
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <p>(Pas de personnage sélectionné)</p>
                  )}
                </div>
              );
            })()}
        </div>
      ) : (
        <p>Aucun joueur trouvé.</p>
      )}

      {isModalOpen && selectedCharacter?._id && (
        <Modal
          title="Fiche du personnage"
          onClose={() => setIsModalOpen(false)}
        >
          <EditableSheet id={selectedCharacter._id} />
        </Modal>
      )}
    </div>
  );
};

export default PlayerAtTable;
