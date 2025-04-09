import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { MessageType } from "../../types/Messages";
import Banner from "../../components/Banner/Banner";
import Chat from "../../components/Chat/Chat";
import DiceRoller from "../../components/DiceRoller/DiceRoller";
import GmToolBar from "../../components/GmToolKit/GmToolBar/GmToolBar";
import MediaDisplay from "../../components/MediaDisplay/MediaDisplay";
import { useCallback } from "react";
{
  /*import NotesPanel from "../../components/NotesPanel/NotesPannel/"*/
}
import PlayerAtTable from "../../components/PlayersAtTable/PlayerAtTable";
import SoundPlayer from "../../components/SoundPlayer/SoundPlayer";
import { useUser } from "../../Context/UserContext"; // Utilisation du context
import { io } from "socket.io-client"; // Importer io pour utiliser Socket.io
import "./Tabletop.scss";

interface Table {
  _id: string;
  name: string;
  selectedFont?: string;
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
  tableBG: string;
}

interface Player {
  _id: string;
  userId: string;
  playerName: string;
  selectedCharacter: string | null;
  isGameMaster: boolean; // Ajoutez ici la propriété isGameMaster
}

export default function TableComponent() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGameMaster, setIsGameMaster] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { user, setUser } = useUser(); // Utiliser le context pour récupérer l'utilisateur
  const API_URL = import.meta.env.VITE_API_URL;
  const socket = useMemo(() => io(API_URL), [API_URL]);
  const [isComOpen, setIsComOpen] = useState(false);
  const tableBG = table?.tableBG || "";
  const currentPlayer = table?.players.find(
    (player) => player.userId === user._id
  );
  const selectedCharacterId = currentPlayer?.selectedCharacter || null;
  const [activePanel, setActivePanel] = useState<
    "npcs" | "sendDocs" | "playerList" | "soundBoard" | "tableStyle" | null
  >(null);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 1000);
  }, []);

  const refreshTables = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tabletop/tables`);
      if (!response.ok)
        throw new Error("Erreur lors de la mise à jour des tables.");
      console.log("✅ Tables mises à jour !");
    } catch (err) {
      console.error("❌ Erreur lors du rafraîchissement des tables :", err);
    }
  };

  // 📌 Ajouter un state pour stocker les notes
  {
    /*
  const [notes, setNotes] = useState(table?.gameMasterNotes || {
  characters: "",
  quest: "",
  other: "",
  items: ""
});
*/
  }

  // 📌 Fonction pour modifier les notes
  {
    /*
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  setNotes((prevNotes) => ({
    ...prevNotes,
    [name]: value,
  }));
};

// 📌 Fonction pour sauvegarder les notes
const handleSaveNotes = async () => {
  if (!table?._id) return;

  try {
    const response = await fetch(`${API_URL}/api/tables/${table._id}/notes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notes),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'enregistrement des notes");
    }

    alert("Notes sauvegardées !");
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des notes :", error);
    alert("Impossible de sauvegarder les notes.");
  }
};
*/
  }

  useEffect(() => {
    if (!table) return;

    socket.emit("joinTable", table._id);

    const handleNewMessage = (newMessage: MessageType) => {
      if (newMessage.tableId !== table._id) return;

      const isDiceRoll = newMessage.messageType === "diceRoll";

      setMessages((prev) => {
        const alreadyExists = prev.some(
          (msg) => msg._id && msg._id === newMessage._id
        );

        if (!isDiceRoll && alreadyExists) return prev;

        return [
          ...prev,
          {
            ...newMessage,
            animate: true, // 🪄 propriété spéciale
          },
        ];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [table, socket]);

  const togglePanel = (
    panel:
      | "npcs"
      | "sendDocs"
      | "playerList"
      | "soundBoard"
      | "tableStyle"
      | null
  ) => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  const fetchTable = useCallback(async () => {
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/api/tabletop/tables/${id}`);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération de la table.");

      const data = await response.json();
      setTable(data);

      // Vérifie si le joueur actuel est GM
      const currentPlayer = data.players.find(
        (player: Player) => player.userId === user._id
      );
      if (currentPlayer?.selectedCharacter) {
        const characterResponse = await fetch(
          `${API_URL}/api/characters/${currentPlayer.selectedCharacter}`
        );
        const characterData = await characterResponse.json();

        setUser((prevUser) => ({
          ...prevUser,
          selectedCharacterName:
            characterData.name || "Nom du personnage non défini",
        }));
      }

      if (data.gameMaster === user._id) {
        setIsGameMaster(true);
      } else {
        setIsGameMaster(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue."
      );
    } finally {
      setLoading(false);
    }
  }, [id, API_URL, user._id, setUser]);

  useEffect(() => {
    fetchTable();
  }, [fetchTable]);

  useEffect(() => {
    socket.on("refreshTableStyle", () => {
      console.log("🎨 Style de table mis à jour via socket");
      fetchTable(); // recharge les infos de la table (et donc le style)
      setRefreshTrigger((prev) => prev + 1); // si nécessaire pour forcer un rerender (comme pour Banner)
    });
  
    return () => {
      socket.off("refreshTableStyle");
    };
  }, [socket, fetchTable]);  

  if (loading)
    return (
      <p>
        <BeatLoader />
      </p>
    );
  if (error) return <p>Erreur : {error}</p>;
  if (!table) return <p>Table non trouvée.</p>;

  return (
    <div className="table">
      <div className="table__content">
        {/* Heading */}
        <div>
          <div className="table__content--header">
            <h2 className={`font-${table?.selectedFont || ""}`}>
              {table?.name}
            </h2>
            <div className="header-container">
              <p>Maître du Jeu : {table?.gameMasterName}</p>
              <p>Système de jeu : {table.game}</p>
            </div>
          </div>
          <Banner
            tableId={table?._id ?? ""}
            API_URL={API_URL}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/*<NotesPanel
  notes={notes}
  handleNotesChange={handleNotesChange}
  handleSaveNotes={handleSaveNotes}
  isGameMaster={isGameMaster}
  currentTableId={table._id} 
  userId={user._id ?? ""} // Si _id est undefined, on utilise une chaîne vide
/>*/}

        {isGameMaster && (
          <GmToolBar
            tableId={table?._id ?? ""}
            players={table?.players ?? []}
            isGameMaster={isGameMaster}
            activePanel={activePanel}
            togglePanel={togglePanel}
            API_URL={API_URL}
            refreshTables={refreshTables}
            onStyleUpdate={async () => {
              await fetchTable(); // attendre la mise à jour de table (donc de la font)
              setRefreshTrigger((prev) => prev + 1); // ensuite seulement on refresh Banner
            }}
          />
        )}

        <div className="table__content--main-container">
          <div
            className="table-content__media-container"
            style={{
              backgroundImage: tableBG ? `url(${tableBG})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <MediaDisplay
              tableId={table._id}
              API_URL={API_URL}
              isGameMaster={isGameMaster}
            />
          </div>
          <PlayerAtTable
            tableId={table._id}
            API_URL={API_URL}
            gameMaster={table.gameMaster}
            selectedCharacterId={selectedCharacterId}
          />
        </div>
      </div>
      <div className="table__low-bar">
        <SoundPlayer />
        <button onClick={() => setIsComOpen((prev) => !prev)}>
          Discussion/Jet de dés
        </button>

        {isComOpen && (
            <div className="table-side-pannel">
              <DiceRoller
                socket={socket}
                tableId={table._id}
                userCharacterName={
                  isGameMaster
                    ? "Maître de jeu"
                    : user.selectedCharacterName ||
                      "Nom de personnage non défini"
                }
                userPseudo={user.userPseudo}
              />

              <Chat
                messages={messages}
                setMessages={setMessages}
                tableId={table._id}
                socket={socket}
                userCharacterName={
                  isGameMaster
                    ? "Maître de jeu"
                    : user.selectedCharacterName ||
                      "Nom de personnage non défini"
                }
                userPseudo={user.userPseudo}
              />
            </div>
          )}
      </div>
    </div>
  );
}
