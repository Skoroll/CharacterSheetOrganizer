import { useEffect, useState } from "react";
import "./PlayersAtTable.scss";
import Modal from "../Modal/Modal";
import CharacterSheetModal from "../ModalContent/CharacterSheetModal/CharacterSheetModal";

interface Character {
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
  skills: { specialSkill: string; score: number; link1: string; link2: string }[];
  inventory: { item: string; quantity: number }[];
}

interface Player {
  playerId: string;
  playerName: string;
  selectedCharacter: Character | null;
  isGameMaster: boolean;
}

interface PlayerAtTableProps {
  tableId: string;
  API_URL: string;
  gameMaster: string;
}

const PlayerAtTable: React.FC<PlayerAtTableProps> = ({ tableId }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');  // Récupère le token du localStorage
  const currentUserId = localStorage.getItem('userId');  // ID de l'utilisateur actuel

  // Fonction pour supprimer un joueur
  const handleDeletePlayer = (playerId: string) => {
    const tableId = "67a8b7529cc2eee548959ffc"; // Remplace par l'ID de la table

    // Vérifie si playerId est défini
    console.log("Player ID:", playerId);  // Vérification

    fetch(`http://localhost:8080/api/tabletop/tables/${tableId}/players/${playerId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur de suppression');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // Rafraîchir les joueurs après la suppression
        fetchPlayers();
      })
      .catch(error => console.error('Error:', error));
  };

  // Fonction pour récupérer les joueurs
  const fetchPlayers = async () => {
    if (!tableId) return; // Ne pas exécuter la requête si tableId est invalide

    try {
      const response = await fetch(`${API_URL}/api/tabletop/tables/${tableId}/players`);
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
    fetchPlayers(); // Charger les joueurs au démarrage
  }, [tableId]);

  const handlePlayerClick = (character: Character | null) => {
    if (character) {
      setSelectedCharacter(character);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCharacter(null);
  };

  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="players-at-table">
      {players.length > 0 ? (
        <div className="players-at-table--container">

          {players
            .filter((player) => !player.isGameMaster) // Exclure le Maître de Jeu des joueurs normaux
            .map((player) => {
              const { selectedCharacter } = player;
              const isCurrentUser = currentUserId === player.playerId; // Vérification si c'est le joueur concerné
              const isGameMaster = player.isGameMaster; // Vérification si c'est le Maître de Jeu
              const canDelete = isGameMaster || isCurrentUser; // Seul le MJ ou le joueur concerné peut supprimer

              return (
                <div
                  key={player.playerId}
                  className="player"
                  onClick={() => handlePlayerClick(selectedCharacter)}
                >
                  {canDelete && (
                    <i
                      className="fa-solid fa-x"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlayer(player.playerId);
                      }}
                    />
                  )}
                  {selectedCharacter ? (
                    <>
                      {selectedCharacter.image && (
                        <img src={`${API_URL}/${selectedCharacter.image}`} alt={selectedCharacter.name} />
                      )}
                      <p>{selectedCharacter.name}</p>
                    </>
                  ) : (
                    <p>(Pas de personnage sélectionné)</p>
                  )}

                  <p className="character-hp"><i className="fa-regular fa-heart"></i> <span>{selectedCharacter?.pointsOfLife}</span></p>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="players-at-table--container">
          <p>Aucun joueur trouvé.</p>
        </div>
      )}

      {isModalOpen && selectedCharacter && (
        <Modal title={selectedCharacter.name} onClose={handleModalClose}>
          <CharacterSheetModal character={selectedCharacter} onClose={handleModalClose} />
        </Modal>
      )}
    </div>
  );
};



export default PlayerAtTable;
