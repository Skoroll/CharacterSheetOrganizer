import { useState, useEffect } from "react";
import "./NotePannel.scss";

interface NotesPanelProps {
  notes: {
    characters: string;
    quest: string;
    other: string;
    items: string;
  };
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSaveNotes: () => Promise<void>;
  isGameMaster: boolean;
  currentTableId: string;
  userId: string;
}

interface NoteSectionProps {
  activeNote: string | null;
  notes: any;
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSaveNotes: () => void;
  noteName: string;
  label: string;
}

const NoteSection = ({
  activeNote,
  notes,
  handleNotesChange,
  handleSaveNotes,
  noteName,
  label,
}: NoteSectionProps) => {
  if (activeNote !== noteName) return null;
  return (
    <div className="notes-section">
      <label>{label}</label>
      <textarea
  name={noteName}
  value={notes[noteName] || ""} // 📌 Associe la valeur aux notes actuelles
  onChange={handleNotesChange}
/>

      <button onClick={handleSaveNotes}>Sauvegarder</button>
    </div>
  );
};

const NotesPanel = ({ currentTableId, userId, isGameMaster }: NotesPanelProps) => {
  const [activeNote, setActiveNote] = useState<string | null>("characters");
  const [isSideOpen, setIsSideOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const [notes, setNotes] = useState({
    characters: "",
    quest: "",
    other: "",
    items: ""
  });
  
  

  // 📌 Gestion du changement de texte
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNotes((prevNotes) => ({
      ...prevNotes,
      [name]: value,
    }));
  };
  

  // 📌 Sauvegarde des notes en fonction du rôle
  const handleSaveNotes = async () => {
    if (!currentTableId) return;
  
    try {
      const url = isGameMaster
        ? `${API_URL}/api/tabletop/tables/${currentTableId}/notes`
        : `${API_URL}/api/tabletop/tables/${currentTableId}/player-notes`;
  
      const payload = isGameMaster
        ? notes
        : { ...notes, playerId: userId };
  
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
  
  // 📌 Chargement des notes au montage du composant
// 📌 Chargement des notes au montage du composant
useEffect(() => {
  const fetchNotes = async () => {
    try {
      const url = isGameMaster
      ? `${API_URL}/api/tabletop/tables/${currentTableId}/notes`
      : `${API_URL}/api/tabletop/tables/${currentTableId}/player-notes?playerId=${userId}`;
      

      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur lors du chargement des notes");

      const data = await response.json();

      setNotes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des notes :", error);
    }
  };

  fetchNotes();
}, [currentTableId, userId, isGameMaster]); // 📌 Recharge les notes si la table ou l'utilisateur change  

  return (
    <div className={`table__notes-pannel ${isSideOpen ? "open" : ""}`}>
      <div className="table__notes-pannel--inside">
        {!isSideOpen && <p className="notes-title">Notes</p>}
        <div className={`notes--opacity ${isSideOpen ? "visible" : ""}`}>
          <ul className="notes__btns">
            <li onClick={() => setActiveNote("characters")}>
              <i className="fa-solid fa-person"></i>
            </li>
            <li onClick={() => setActiveNote("quest")}>
              <i className="fa-solid fa-exclamation"></i>
            </li>
            <li onClick={() => setActiveNote("items")}>
              <i className="fa-solid fa-sack-dollar"></i>
            </li>
            <li onClick={() => setActiveNote("other")}>
              <i className="fa-solid fa-box"></i>
            </li>
          </ul>

          <h3>Notes du {isGameMaster ? "MJ" : "Joueur"}</h3>

          <NoteSection
            activeNote={activeNote}
            notes={notes}
            handleNotesChange={handleNotesChange}
            handleSaveNotes={handleSaveNotes}
            noteName="characters"
            label="Personnages"
          />
          <NoteSection
            activeNote={activeNote}
            notes={notes}
            handleNotesChange={handleNotesChange}
            handleSaveNotes={handleSaveNotes}
            noteName="quest"
            label="Quêtes"
          />
          <NoteSection
            activeNote={activeNote}
            notes={notes}
            handleNotesChange={handleNotesChange}
            handleSaveNotes={handleSaveNotes}
            noteName="items"
            label="Objets"
          />
          <NoteSection
            activeNote={activeNote}
            notes={notes}
            handleNotesChange={handleNotesChange}
            handleSaveNotes={handleSaveNotes}
            noteName="other"
            label="Autres"
          />
        </div>
      </div>
      <div
        onClick={() => setIsSideOpen((prev) => !prev)}
        className="table__notes-pannel--slide-btn"
      >
        <i
          className={`fa-solid ${
            isSideOpen ? "fa-chevron-left" : "fa-chevron-right"
          }`}
        />
      </div>
    </div>
  );
};

export default NotesPanel;
