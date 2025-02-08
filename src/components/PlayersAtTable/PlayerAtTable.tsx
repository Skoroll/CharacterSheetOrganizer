import { useEffect, useState } from "react";
import "./PlayersAtTable.scss";

// Définir l'interface Character
interface Character {
  name: string;
  image: string;
}

interface Player {
  _id: string;
  playerName: string;
  selectedCharacter: Character | null; // selectedCharacter est maintenant un objet ou null
}

interface PlayerAtTableProps {
  tableId: string;
  API_URL: string;
  playerIds: string[]; // Ajout de playerIds dans les props
}

const PlayerAtTable: React.FC<PlayerAtTableProps> = ({ tableId, API_URL }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayersDetails = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/tabletop/tables/${tableId}/players`
        );

        if (!response.ok) {
          console.error("Erreur API :", response);
          throw new Error("Erreur lors de la récupération des joueurs.");
        }

        const playersData = await response.json();
        if (Array.isArray(playersData) && playersData.length > 0) {
          setPlayers(playersData);
        } else {
          setError("Aucun joueur trouvé.");
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur inconnue est survenue."
        );
      }
    };

    if (tableId) {
      fetchPlayersDetails();
    }
  }, [tableId, API_URL]);

  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="players-at-table">
      <div className="players-at-table--container">
        {players.map((player) => (
          <div key={player._id} className="player">
            {player.selectedCharacter && player.selectedCharacter.image && (
              <>
                {console.log("Image URL:", player.selectedCharacter.image)}{" "}
                <img
                  src={`${API_URL}/${player.selectedCharacter.image}`}
                  alt={player.selectedCharacter.name}
                />
                <p>{player.selectedCharacter.name}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerAtTable;
