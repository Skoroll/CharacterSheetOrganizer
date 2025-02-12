import { useEffect, useState } from "react";
import "./PlayerList.scss";

type PlayerListProps = {
  players: { _id: string; playerName: string; selectedCharacter: string | null }[];
  tableId: string;
};

export default function PlayerList({ players, tableId }: PlayerListProps) {
  const [characters, setCharacters] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [playerList, setPlayerList] = useState(players);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log("Joueurs reçus:", players);
    const characterIds = players
      .filter((player) => player.selectedCharacter)
      .map((player) => player.selectedCharacter);

    if (characterIds.length === 0) {
      console.log("Aucun personnage sélectionné par les joueurs.");
      return;
    }

    async function fetchCharacterNames() {
      setLoading(true);
      try {
        console.log("Chargement des noms des personnages...");
        const characterPromises = characterIds.map((id) =>
          fetch(`${API_URL}/api/characters/${id}`).then((res) => res.json())
        );

        const charactersData = await Promise.all(characterPromises);

        const characterNames = charactersData.reduce(
          (acc: Record<string, string>, character: { _id: string; name: string }) => {
            acc[character._id] = character.name;
            return acc;
          },
          {}
        );

        setCharacters(characterNames);
        console.log("Noms des personnages récupérés:", characterNames);
      } catch (error) {
        console.error("Erreur lors de la récupération des personnages", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCharacterNames();
  }, [players, API_URL]);

  const removePlayer = async (tableId: string, playerId: string) => {
    console.log(`Suppression du joueur avec l'ID: ${playerId} pour la table ${tableId}`);
    try {
      const response = await fetch(`${API_URL}/api/tabletop/${tableId}/removePlayer/${playerId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        console.error(`Erreur lors de la suppression du joueur, statut: ${response.status}`);
        throw new Error(`Erreur lors de la suppression du joueur, statut: ${response.status}`);
      }
  
      console.log(`Joueur ${playerId} supprimé avec succès.`);
    } catch (error) {
      console.error('Erreur lors de la suppression du joueur', error);
    }
  };
  

  return (
    <div className="table-user">
      <p>Liste des joueurs</p>
      <ul>
  {playerList.map((player) => (
    <li key={player._id}>
      <i className="fa-solid fa-trash" onClick={() => removePlayer(tableId, player._id)} />
      <div className="table-user__info">
        <p>Nom du joueur : {player.playerName}</p>
        {player.selectedCharacter ? (
          <p>
            Nom du personnage :{" "}
            {loading ? "Chargement..." : characters[player.selectedCharacter] || "Inconnu"}
          </p>
        ) : (
          <p>Pas de personnage sélectionné</p>
        )}
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}
