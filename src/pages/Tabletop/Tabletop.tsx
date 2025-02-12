import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "../../components/Chat/Chat";
import DiceRoller from "../../components/DiceRoller/DiceRoller";
import NotesPanel from "../../components/NotesPanel/NotesPannel";
import PlayerAtTable from "../../components/PlayersAtTable/PlayerAtTable";
import PlayerList from "../../components/PlayerList/PlayerList";
import SendDocs from "../../components/SendDocs/SendDocs";
import "./Tabletop.scss";

interface Table {
  _id: string;
  name: string;
  gameMaster: string;
  gameMasterName: string;
  game: string;
  players: Player[];
  gameMasterNotes: {
    characters: string;
    quest: string;
    other: string;
    items: string;
  };
}

interface Player {
  _id: string;
  playerName: string;
  selectedCharacter: string | null;
}

export default function TableComponent() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const [isSideOpen, setIsSideOpen] = useState(false);
  const [isSendDocOpen, setIsSendDocOpen] = useState(true);
  const [isPlayerListOpen, setIsPlayerListOpen] = useState(false);
  const [notes, setNotes] = useState({
    characters: "",
    quest: "",
    other: "",
    items: "",
  });
  const [isGameMaster, setIsGameMaster] = useState(false);

  const toggleSendDoc = () => {
    setIsSendDocOpen((prev) => !prev);
  };

  const togglePlayerList = () => {
    setIsPlayerListOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!id) return;

    async function fetchTable() {
      try {
        const response = await fetch(`${API_URL}/api/tabletop/tables/${id}`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération de la table.");

        const data = await response.json();
        setTable(data);

        // Vérifie si l'utilisateur est le maître du jeu
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.id || "";

        if (data.gameMaster === userId) {
          setIsGameMaster(true);
        }

        setNotes(
          data.gameMasterNotes || {
            characters: "",
            quest: "",
            other: "",
            items: "",
          }
        );
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur inconnue est survenue."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTable();
  }, [id, API_URL]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!table) return <p>Table non trouvée.</p>;

  // Mise à jour des joueurs avec les informations nécessaires
  const players: Player[] = table.players.map((player) => ({
    _id: player._id,
    playerName: player.playerName || "Nom inconnu", // Vous pouvez ici récupérer le vrai nom du joueur si possible
    selectedCharacter: player.selectedCharacter || null,
  }));

  return (
    <div className="table">
      <PlayerAtTable
        tableId={table._id}
        API_URL={API_URL}
        gameMaster={table.gameMaster}
      />

      <div className="table__content">
        <div className="table__content--header">
          <h2>{table?.name}</h2>
          <div className="container">
            <p>Maître du Jeu : {table?.gameMasterName}</p>
            <p>Système de jeu : {table.game}</p>
          </div>
        </div>
        <NotesPanel
          notes={notes}
          handleNotesChange={(e) =>
            setNotes({ ...notes, [e.target.name]: e.target.value })
          }
          handleSaveNotes={async () => {
            try {
              const response = await fetch(
                `${API_URL}/api/tabletop/tables/${id}/notes`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(notes),
                }
              );

              if (!response.ok)
                throw new Error("Erreur lors de la mise à jour des notes");
            } catch (error) {
              console.error(error);
            }
          }}
          isGameMaster={isGameMaster}
          isSideOpen={isSideOpen}
          setIsSideOpen={setIsSideOpen}
        />
        {isGameMaster && (
          <div className="table__gm-options">
            <i onClick={toggleSendDoc} className="fa-solid fa-file-import"></i>
            <i onClick={togglePlayerList} className="fa-solid fa-user"></i>
            <i className="fa-solid fa-music"></i>
          </div>
        )}
        {!isSendDocOpen && <SendDocs />}
        {isPlayerListOpen && <PlayerList players={players} tableId={table._id} />}

        <div className="table__content--main-container">
          <DiceRoller />
        </div>
        <div>
          <Chat />
        </div>
      </div>
    </div>
  );
}
