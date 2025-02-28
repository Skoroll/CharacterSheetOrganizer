import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import Collapses from "../../../Collapses/Collapses";
import Modal from "../../../Modal/Modal";
import TabletopJoin from "../TabletopJoin/TabletopJoin";
import "./TableTopBrowse.scss";

type Player = {
  playerId: string; // ID du joueur
  playerName: string; // Nom du joueur
  selectedCharacter: string | null; // ID du personnage sélectionné
  isGameMaster: boolean; // Si le joueur est le Game Master
};

type Table = {
  _id: string;
  name: string;
  gameMaster: string;
  game: string;
  players: Player[]; // Ajout de la propriété players avec les informations des joueurs
  gameMasterNotes?: {
    notes: string;
  };
};

export default function TableTopBrowse() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleJoinTable = (tableId: string) => {
    setSelectedTableId(tableId);
    setIsJoinModalOpen(true);
  };

  const handleJoinSuccess = () => {
    setIsJoinModalOpen(false); // Ferme le modal
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tabletop/getTables`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des tables");

        const data = await response.json();
        setTables(data.tables);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur inconnue est survenue."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="tabletop-browse">
      <Collapses
        title="Rejoindre une table"
        content={
          <>
            {loading && <BeatLoader />}
            {error && (
              <div>
                <p>Erreur : Le serveur semble inatteignable</p>
                <p>Réessayez plus tard</p>
              </div>
            )}
            {!loading && !error && tables.length === 0 && <p>Aucune table</p>}
            {!loading && !error && tables.length > 0 && (
  <ul>
    {tables.map((table) => (
      <li key={table._id}>
        <div className="is-online" />
        <div className="table-infos">
          <p>{table.name}</p>
          <p>
            <i className="fa-regular fa-user"></i>{" "}
            {table.players?.length || 0}
          </p>
          <p>{table.game}</p>
        </div>
        <div className="tabletop-browse__btn">
          <button
            className="tabletop-browse--join"
            onClick={() => handleJoinTable(table._id)}
          >
            <i className="fa-solid fa-right-to-bracket" />
          </button>
        </div>
      </li>
    ))}
  </ul>
)}

          </>
        }
      />

      {isJoinModalOpen && selectedTableId && (
        <Modal
          title="Sélectionnez votre personnage"
          onClose={() => setIsJoinModalOpen(false)}
        >
          <TabletopJoin
            tableId={selectedTableId}
            onClose={() => setIsJoinModalOpen(false)}
            onJoin={handleJoinSuccess}
            gameMasterId={
              tables.find((table) => table._id === selectedTableId)
                ?.gameMaster || ""
            }
          />
        </Modal>
      )}
    </div>
  );
}
