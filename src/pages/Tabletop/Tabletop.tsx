import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "../../components/Chat/Chat";
import DiceRoller from "../../components/DiceRoller/DiceRoller";
import NotesPanel from "../../components/NotesPanel/NotesPannel";
import PlayerAtTable from "../../components/PlayersAtTable/PlayerAtTable";
import "./Tabletop.scss";

interface Table {
  _id: string;
  name: string;
  gameMaster: string;
  gameMasterName: string;
  players: { _id: string }[];  // Mise à jour pour utiliser _id
  gameMasterNotes: {
    characters: string;
    quest: string;
    other: string;
    items: string;
  };
}

export default function TableComponent() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const [isSideOpen, setIsSideOpen] = useState(false);
  const [notes, setNotes] = useState({
    characters: "",
    quest: "",
    other: "",
    items: "",
  });
  const [isGameMaster, setIsGameMaster] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchTable() {
      try {
        const response = await fetch(`${API_URL}/api/tabletop/tables/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de la table.");
        const data = await response.json();
        console.log("Table data reçue :", table);
        console.log("Données brutes des joueurs :", table?.players);
        setTable(data);
        table?.players?.forEach((player, index) => {
          console.log(`Joueur ${index} :`, player);
        });
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;

        if (data.gameMaster === userId) setIsGameMaster(true);
        setNotes(data.gameMasterNotes || { characters: "", quest: "", other: "", items: "" });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
      } finally {
        setLoading(false);
      }
    }

    fetchTable();
  }, [id, API_URL]);

  // Correction du typage de playerIds
  const playerIds = (table?.players?.map((player) => player._id) || []).filter((id) => id);

  console.log("Player IDs filtrés:", playerIds);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="table">
      <div className="table__header">
        <h2>{table?.name}</h2>
        <p>Maître du Jeu : {table?.gameMasterName}</p>
      </div>

      <NotesPanel
        notes={notes}
        handleNotesChange={(e) => setNotes({ ...notes, [e.target.name]: e.target.value })}
        handleSaveNotes={async () => {
          try {
            const response = await fetch(`${API_URL}/api/tabletop/tables/${id}/notes`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(notes),
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour des notes");

            const data = await response.json();
            console.log("Notes mises à jour :", data);
          } catch (error) {
            console.error(error);
          }
        }}
        isGameMaster={isGameMaster}
        isSideOpen={isSideOpen}
        setIsSideOpen={setIsSideOpen}
      />

      <div className="table__main-container">
        <DiceRoller />
        <PlayerAtTable playerIds={playerIds} API_URL={API_URL} />

      </div>
      <div>
        <Chat />
      </div>
    </div>
  );
}
