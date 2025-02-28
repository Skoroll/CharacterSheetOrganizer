import { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { io, Socket } from "socket.io-client";
import "./PlayersAtTable.scss";
import EditableSheet from "../EditableSheet/EditableSheet";
import Modal from "../Modal/Modal";

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
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
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
          body: JSON.stringify({ pointsOfLife: newHealth, tableId }), // ✅ Ajout de `tableId`
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

  if (error) return <p>Erreur : {error}</p>;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !document
          .querySelector(".player__easy-acces")
          ?.contains(event.target as Node)
      ) {
        setOpenPanel(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
  useEffect(() => {
    console.log("🛠 Table ID récupéré via useParams :", tableId);
  }, [tableId]);

  useEffect(() => {
    if (!tableId) return;
    fetchPlayers(); // Charger les joueurs au montage

    socket.emit("joinTable", tableId); // ✅ Rejoindre la salle Socket.io

    // 🔥 Écouter les mises à jour des PV en temps réel
    socket.on("updateHealth", ({ characterId, pointsOfLife }) => {
      console.log(
        "🔄 Mise à jour des PV reçue via Socket.io :",
        characterId,
        pointsOfLife
      );

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
      socket.off("updateHealth"); // Nettoyage de l'écouteur lors du démontage
    };
  }, [tableId]);

  return (
    <div className="players-at-table">
      {players.length > 0 ? (
        <div className="players-at-table--container">
          {players
            .filter((player) => !player.isGameMaster)
            .map((player, index) => {
              const { selectedCharacter } = player;
              const isCurrentUser = player.userId
                ? currentUserId === player.userId.toString()
                : false;

              return (
                <div
                  key={`${tableId}-${player.playerId || index}`}
                  className="player"
                >
                  {/* 🌟 Boutons easy-access visibles uniquement pour le propriétaire */}
                  {isCurrentUser && selectedCharacter && (
                    <div className="player__easy-acces">
                      {/* Points de vie */}
                      <div
                        className="player__easy-acces--hp"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePanel(player.playerId, "hp");
                        }}
                      >
                        <p>
                          <i className="fa-regular fa-heart"></i>
                        </p>
                        {openPanel?.playerId === player.playerId &&
                          openPanel?.panel === "hp" && (
                            <div className="player__easy-acces--inside">
                              <i
                                className="fa-solid fa-chevron-down"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateHealth(selectedCharacter, -1);
                                }}
                              ></i>
                              <span>{selectedCharacter.pointsOfLife}</span>
                              <i
                                className="fa-solid fa-chevron-up"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateHealth(selectedCharacter, 1);
                                }}
                              ></i>
                            </div>
                          )}
                      </div>

                      {/* Pièces d'or */}
                      <div
                        className="player__easy-acces--coins"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePanel(player.playerId, "coins");
                        }}
                      >
                        <p>
                          <i className="fa-solid fa-coins"></i>
                        </p>
                        {openPanel?.playerId === player.playerId &&
                          openPanel?.panel === "coins" && (
                            <div className="player__easy-acces--inside">
                              {selectedCharacter.gold} pièces
                            </div>
                          )}
                      </div>

                      {/* Inventaire */}
                      <div
                        className="player__easy-acces--inventory"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePanel(player.playerId, "inventory");
                        }}
                      >
                        <p>
                          <i className="fa-solid fa-briefcase"></i>
                        </p>
                        {openPanel?.playerId === player.playerId &&
                          openPanel?.panel === "inventory" &&
                          selectedCharacter.inventory.length !== 0 && (
                            <div className="player__easy-acces--inside">
                              {/* Filtrer les objets valides (évite les lignes vides) */}
                              {selectedCharacter.inventory.filter(
                                (item) => item.item.trim() !== ""
                              ).length > 0 ? (
                                <table>
                                  <thead>
                                    <tr>
                                      <th className="table-left">Objet</th>
                                      <th>Quantité</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedCharacter.inventory
                                      .filter((item) => item.item.trim() !== "") // Supprime les objets vides
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
                                <p>Aucun objet dans l'inventaire</p> // Message si tout est vide
                              )}
                            </div>
                          )}
                      </div>

                      {/* Équipement */}
                      <div
                        className="player__easy-acces--equipment"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePanel(player.playerId, "gear");
                        }}
                      >
                        <p>
                          <i className="fa-solid fa-shield"></i>
                        </p>
                        {openPanel?.playerId === player.playerId &&
                          openPanel?.panel === "gear" &&
                          selectedCharacter.weapons.length !== 0 && (
                            <div className="player__easy-acces--inside">
                              {selectedCharacter.weapons.length} armes
                            </div>
                          )}
                      </div>
                    </div>
                  )}

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
                          src={`${API_URL}/${selectedCharacter.image}`}
                          alt={selectedCharacter.name}
                        />
                      )}
                      <p className="player__image--name">
                        {selectedCharacter.name}
                      </p>
                    </div>
                  ) : (
                    <p>(Pas de personnage sélectionné)</p>
                  )}

                  {/* Bouton Modifier visible uniquement pour l'utilisateur */}
                </div>
              );
            })}
        </div>
      ) : (
        <p>Aucun joueur trouvé.</p>
      )}

      {/* Modale d'affichage du personnage */}
      {isModalOpen && selectedCharacter?._id && (
  <Modal title="Fiche du personnage" onClose={() => setIsModalOpen(false)}>
    <EditableSheet id={selectedCharacter._id} />
  </Modal>
)}



    </div>
  );
};

export default PlayerAtTable;
