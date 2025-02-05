import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import Modal from "../../../Modal/Modal";
import TabletopJoin from "../TabletopJoin/TabletopJoin"; // Importer le composant
import "./TableTopBrowse.scss";

export default function TableTopBrowse() {
  const navigate = useNavigate();
  const [tables, setTables] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const deleteTable = async (id: string) => {
    try {
      const token = localStorage.getItem("token"); // Récupère le token de l'utilisateur connecté
  
      const response = await fetch(`${API_URL}/api/tabletop/table/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erreur lors de la suppression de la table.");
      }
  
      alert("Table supprimée avec succès !");
      setTables((prevTables) => prevTables.filter((table) => table._id !== id));
    } catch (err: unknown) {
      console.error("Erreur:", err);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const handleJoinTable = (tableId: string) => {
    setSelectedTableId(tableId);
    setIsJoinModalOpen(true);
  };

  const handleJoinSuccess = (characterId: string, tableId: string) => {
    alert(`Vous avez rejoint la table ${tableId} avec le personnage ${characterId}`);
    setIsJoinModalOpen(false);
    navigate(`/table/${tableId}`);
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tabletop/getTables`);
        const data = await response.json();
        if (response.ok) {
          setTables(data.tables);
        } else {
          throw new Error(data.message || "Erreur lors de la récupération des tables");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur inconnue est survenue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="tabletop-browse">
      {loading && <BeatLoader />}
      {error && <div><p>Erreur : Le serveur semble inatteignable</p><p>Réessayez plus tard</p></div>}

      {!loading && !error && tables.length === 0 && <p>Aucune table</p>}

      {!loading && !error && tables.length > 0 && (
        <ul>
          {tables.map((table) => (
            <li key={table._id}>
              <div className="is-online" />
              <p>{table.name}</p>
              <div className="tabletop-browse__btn">
                <button
                  className="tabletop-browse--join"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTable(table._id);
                  }}
                >
                  <i className="fa-solid fa-trash" />
                </button>

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

      {isJoinModalOpen && selectedTableId && (
        <Modal 
          title="Sélectionnez votre personnage"
          onClose={() => setIsJoinModalOpen(false)}
          content={(
            <TabletopJoin
              tableId={selectedTableId}
              onClose={() => setIsJoinModalOpen(false)}
              onJoin={handleJoinSuccess}
            />
          )}
        />
      )}
    </div>
  );
}
