import { useEffect, useState } from "react";
import "./PlayerList.scss"

type Player = {
  _id: string;
  playerId?: string;
  playerName: string;
  selectedCharacter: string | null;
  isGameMaster: boolean; // Ajouter la propriété isGameMaster ici
};

type PlayerListProps = {
  players: Player[];
  tableId: string;
  isGameMaster: boolean; // Assurez-vous que isGameMaster est ici
};

export default function PlayerList({
  players,
  tableId,

}: PlayerListProps) {
  const [playerList, setPlayerList] = useState<Player[]>([]);
  console.log(setPlayerList);
  const API_URL = import.meta.env.VITE_API_URL;

  // Mettre à jour la liste des joueurs (en excluant les GameMasters)
  useEffect(() => {
    const updatedPlayers = players.filter((player) => !player.isGameMaster); // Exclure les GameMasters
    setPlayerList(updatedPlayers);
  }, [players]);

  // Fonction pour supprimer un joueur
  const removePlayer = async (tableId: string, userId: string) => {
    if (!userId) {
      console.error("Erreur : `userId` est undefined !");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/tabletop/tables/${tableId}/removePlayer/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Erreur ${response.status}: ${errorMessage}`);
        throw new Error(
          `Erreur lors de la suppression du joueur, statut: ${response.status}`
        );
      }

      setPlayerList((prevPlayers) =>
        prevPlayers.filter((player) => player.playerId !== userId)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du joueur", error);
    }
  };

  // Fonction pour supprimer le personnage du joueur
  const removeCharacter = async (tableId: string, userId: string) => {
    if (!userId) {
      console.error("Erreur : `userId` est undefined !");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/tabletop/tables/${tableId}/removeCharacter/${userId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Erreur ${response.status}: ${errorMessage}`);
        throw new Error(
          `Erreur lors de la suppression du personnage, statut: ${response.status}`
        );
      }

      setPlayerList((prevPlayers) =>
        prevPlayers.map((player) =>
          player.playerId === userId
            ? { ...player, selectedCharacter: null }
            : player
        )
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du personnage", error);
    }
  };

  return (
    <div className="gm-tool table-user">
      <p>Liste des joueurs</p>
      <ul>
        {playerList.map((player) => (
          <li key={player._id}>
            {/* Vérifier si ce n'est pas un GameMaster avant d'afficher les icônes */}
            {!player.isGameMaster && (
              <div className="table-user__buttons">
                <i
                  className="fa-solid fa-gavel"
                  onClick={() =>
                    removePlayer(tableId, player.playerId || player._id)
                  }
                />
                <i
                  className="fa-solid fa-skull"
                  onClick={() =>
                    removeCharacter(tableId, player.playerId || player._id)
                  }
                />
              </div>
            )}
            <div className="table-user__info">
              <p>Nom du joueur : {player.playerName}</p>
              <p>ID personnage : {player.selectedCharacter}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
