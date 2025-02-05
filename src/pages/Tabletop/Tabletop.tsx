import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "../../components/Chat/Chat"
import DiceRoller from "../../components/DiceRoller/DiceRoller";

interface Table {
  _id: string;
  name: string;
  gameMaster: { _id: string; name: string }; // 👈 Mise à jour de l'interface
}

export default function TableComponent() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!id) return;
  
    async function fetchTable() {
      try {
        const response = await fetch(`${API_URL}/api/tabletop/table/${id}`);
  
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la table.");
        }
        const data = await response.json();
        console.log("Table récupérée :", data); // 👈 Vérifier la structure reçue
        setTable(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchTable();
  }, [id, API_URL]);
  

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="table">
      <h2>{table?.name}</h2>
      <p>Maître du Jeu : {table?.gameMaster?.name}</p>
      <div className="table__main-container">
      <DiceRoller />

      </div>
      <div>

        <Chat />
      </div>
    </div>
  );
}

