import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import Collapses from "../../../Collapses/Collapses";
import Modal from "../../../Modal/Modal";
import TabletopJoin from "../TabletopJoin/TabletopJoin";
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
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/tabletop/tables/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json", // ✅ Ajout de l’en-tête manquant
        },
      });

      if (!response.ok) {
        let errorMessage = "Erreur lors de la suppression de la table.";
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch {
          // Si la réponse n'est pas JSON, garder le message par défaut
        }
        throw new Error(errorMessage);
      }

      alert("Table supprimée avec succès !");
      setTables((prevTables) => prevTables.filter((table) => table._id !== id));
    } catch (err: unknown) {
      console.error("Erreur:", err);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  const handleJoinTable = (tableId: string) => {
    console.log("Table sélectionnée pour rejoindre :", tableId);
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
        if (!response.ok) throw new Error("Erreur lors de la récupération des tables");

        const data = await response.json();
        setTables(data.tables);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
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
          </>
        }
      />

      {isJoinModalOpen && selectedTableId && (
        
        <Modal
          title="Sélectionnez votre personnage"
          onClose={() => setIsJoinModalOpen(false)}
          content={
<TabletopJoin
  tableId={selectedTableId}
  onClose={() => setIsJoinModalOpen(false)}
  onJoin={handleJoinSuccess}
  gameMasterId={""} // ⚠️ À récupérer depuis les données de la table
/>

          }
        />
      )}
    </div>
  );
}
