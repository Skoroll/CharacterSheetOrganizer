import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import Modal from "../../../Modal/Modal";
import TableSearch from "./TableSearch";
import TabletopJoin from "../TabletopJoin/TabletopJoin";
import "./TableTopBrowse.scss";

type Player = {
  playerId: string;
  playerName: string;
  selectedCharacter: string | null;
  isGameMaster: boolean;
};

type Table = {
  _id: string;
  name: string;
  gameMaster: string;
  game: string;
  players: Player[];
  gameMasterNotes?: { notes: string };
};

export default function TableTopBrowse() {
  const [tables, setTables] = useState<Table[]>([]);
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const tablesPerPage = 5; // Nombre de tables par page

  const API_URL = import.meta.env.VITE_API_URL;

  const handleJoinTable = (tableId: string) => {
    setSelectedTableId(tableId);
    setIsJoinModalOpen(true);
  };

  const handleJoinSuccess = () => {
    setIsJoinModalOpen(false);
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tabletop/getTables`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des tables");

        const data = await response.json();
        setTables(data.tables);
        setFilteredTables(data.tables); // Initialisation des tables affichées
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur inconnue est survenue."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Appliquer le filtre uniquement lorsqu'on soumet le formulaire
  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = tables.filter(
      (table) =>
        table.name.toLowerCase().includes(lowerCaseQuery) ||
        table.game.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredTables(filtered);
    setCurrentPage(1); // Réinitialise à la première page après une recherche
  };

  // Pagination : Déterminer les tables à afficher
  const indexOfLastTable = currentPage * tablesPerPage;
  const indexOfFirstTable = indexOfLastTable - tablesPerPage;
  const currentTables = filteredTables.slice(indexOfFirstTable, indexOfLastTable);

  // Changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="tabletop-browse">
      <h2>Toutes les tables</h2>
      <TableSearch onSearch={handleSearch} />

      {loading && <BeatLoader />}
      {error && (
        <div>
          <p>Erreur : Le serveur semble inatteignable</p>
          <p>Réessayez plus tard</p>
        </div>
      )}
      {!loading && !error && currentTables.length === 0 && <p>Aucune table</p>}
      {!loading && !error && currentTables.length > 0 && (
        <>
          <ul>
            {currentTables.map((table) => (
              <li key={table._id}>
                <div className="is-online" />
                <div className="table-infos">
                  <p>{table.name}</p>
                  <p>
                    <i className="fa-regular fa-user"></i> {table.players?.length || 0}
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

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredTables.length / tablesPerPage) }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

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
              tables.find((table) => table._id === selectedTableId)?.gameMaster || ""
            }
          />
        </Modal>
      )}
    </div>
  );
}
