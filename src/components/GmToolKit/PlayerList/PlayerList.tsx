import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import Modal from "../../Modal/Modal";
import "./PlayerList.scss";

type ActionType = "ban" | "removeCharacter" | null;

type Player = {
  _id: string;
  userId: string | { _id: string; name: string }; // peut être string ou objet si peuplé
  playerName: string;
  selectedCharacter: string | null;
  isGameMaster: boolean;
};

type PlayerListProps = {
  players: Player[];
  tableId: string;
  isGameMaster: boolean;
};

type BannedPlayer = {
  _id: string;
  name: string;
};

export default function PlayerList({ players, tableId }: PlayerListProps) {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [targetPlayerId, setTargetPlayerId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [bannedPlayers, setBannedPlayers] = useState<BannedPlayer[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  // socket.io client
  const socket = useMemo(() => io(API_URL), [API_URL]);

  useEffect(() => {
    const fetchBanned = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tabletop/tables/${tableId}`);
        const data = await res.json();
        const bannedIds: string[] = data.bannedPlayers || [];

        // Optionnel : fetch noms des utilisateurs si nécessaire
        const detailed = await Promise.all(
          bannedIds.map(async (id) => {
            const res = await fetch(`${API_URL}/api/users/${id}`);
            const user = await res.json();
            return { _id: id, name: user.name };
          })
        );

        setBannedPlayers(detailed);
      } catch (e) {
        console.error("❌ Erreur fetch bannis :", e);
      }
    };

    fetchBanned();
  }, [tableId]);
  

  useEffect(() => {
    const updated = players.filter((p) => !p.isGameMaster);
    setPlayerList(updated);
  }, [players]);

  const confirmAction = async () => {
    if (!targetPlayerId || !actionType) return;

    const endpoint =
      actionType === "ban"
        ? `/api/tabletop/tables/${tableId}/removePlayer/${targetPlayerId}`
        : `/api/tabletop/tables/${tableId}/removeCharacter/${targetPlayerId}`;

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Erreur côté serveur");

      if (actionType === "ban") {
        setPlayerList((prev) => prev.filter((p) => p._id !== targetPlayerId));
      } else {
        setPlayerList((prev) =>
          prev.map((p) =>
            p._id === targetPlayerId ? { ...p, selectedCharacter: null } : p
          )
        );
      }

      // ✅ Notifier tous les clients
      socket.emit("refreshPlayers", { tableId });
    } catch (error) {
      console.error("❌ Erreur action modale :", error);
    } finally {
      setModalVisible(false);
      setTargetPlayerId(null);
      setActionType(null);
    }
  };

  useEffect(() => {
    socket.on("refreshPlayers", () => {
      // ⚠️ Tu dois fetch à nouveau la table ici (ou un callback pour refresh)
      window.location.reload(); // ou une méthode plus propre
    });

    return () => {
      socket.off("refreshPlayers");
    };
  }, [socket]);

  return (
    <div className="gm-tool table-user">
      <p>Liste des joueurs</p>
      <ul>
        {playerList.map((player) => (
          <li key={player._id}>
            <div className="table-user__buttons">
              <i
                className="fa-solid fa-gavel"
                onClick={() => {
                  setTargetPlayerId(
                    typeof player.userId === "object"
                      ? player.userId._id
                      : player.userId
                  );
                  setActionType("ban");
                  setModalVisible(true);
                }}
                title="Bannir le joueur"
              />
              <i
                className="fa-solid fa-skull"
                onClick={() => {
                  setTargetPlayerId(
                    typeof player.userId === "object"
                      ? player.userId._id
                      : player.userId
                  );
                  setActionType("removeCharacter");
                  setModalVisible(true);
                }}
                title="Retirer le personnage"
              />
            </div>
            <div className="table-user__info">
              <p>
                Nom du joueur :{" "}
                {(player as any).userId?.name || player.playerName}
              </p>
              <p>ID personnage : {player.selectedCharacter ?? "Aucun"}</p>
            </div>
          </li>
        ))}
      </ul>

      {bannedPlayers.length > 0 && (
        <>
          <h4>Joueurs bannis</h4>
          <ul>
            {bannedPlayers.map((player) => (
              <li key={player._id}>
                {player.name}
                <button
                  onClick={async () => {
                    await fetch(
                      `${API_URL}/api/tabletop/tables/${tableId}/unbanPlayer/${player._id}`,
                      {
                        method: "PATCH",
                      }
                    );
                    setBannedPlayers((prev) =>
                      prev.filter((p) => p._id !== player._id)
                    );
                    socket.emit("refreshPlayers", { tableId });
                  }}
                >
                  Débannir
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ✅ MODALE DE CONFIRMATION */}
      {modalVisible && (
        <Modal
          title={
            actionType === "ban"
              ? "Confirmer le bannissement"
              : "Confirmer le retrait du personnage"
          }
          onClose={() => setModalVisible(false)}
        >
          <p>
            Es-tu sûr de vouloir{" "}
            {actionType === "ban"
              ? "bannir ce joueur de la table ? Cette action est irréversible."
              : "retirer le personnage de ce joueur ?"}
          </p>
          <div className="modal__actions">
            <button onClick={confirmAction}>Oui</button>
            <button onClick={() => setModalVisible(false)}>Annuler</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
