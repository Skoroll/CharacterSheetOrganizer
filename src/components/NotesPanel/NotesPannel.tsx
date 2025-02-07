import { useState } from "react";

interface NotesPanelProps {
  notes: any;
  handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSaveNotes: () => void;
  isGameMaster: boolean;
  isSideOpen: boolean;
  setIsSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotesPanel = ({
  notes,
  handleNotesChange,
  handleSaveNotes,
  isGameMaster,
  isSideOpen,
  setIsSideOpen,
}: NotesPanelProps) => {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const NotesSection = ({
    activeNote,
    notes,
    handleNotesChange,
    handleSaveNotes,
    noteName,
    label,
  }: {
    activeNote: string | null;
    notes: any;
    handleNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSaveNotes: () => void;
    noteName: string;
    label: string;
  }) => {
    if (activeNote !== noteName) return null;

    return (
      <div className="notes-section">
        <label>{label}</label>
        <textarea
        
          name={noteName}
          value={notes[noteName]}
          onChange={handleNotesChange}
        ></textarea>
        <button onClick={handleSaveNotes}>Sauvegarder</button>
      </div>
    );
  };

  return (
    <div className="table__notes-pannel">

      <div className="table__notes-pannel--inside">
        <p><i className="fa-solid fa-pen"></i></p>
        {!isSideOpen &&(
          <p className="notes-title">Notes</p>
        )}
        {isSideOpen && (
          <>
            <ul>
              <li onClick={() => setActiveNote("characters")}><i className="fa-solid fa-person"></i></li>
              <li onClick={() => setActiveNote("quest")}><i className="fa-solid fa-exclamation"></i></li>
              <li onClick={() => setActiveNote("items")}><i className="fa-solid fa-sack-dollar"></i></li>
              <li onClick={() => setActiveNote("other")}><i className="fa-solid fa-box"></i></li>
            </ul>

            <h3>Notes du {isGameMaster ? "MJ" : "Joueur"}</h3>

            <NotesSection
              activeNote={activeNote}
              notes={notes}
              handleNotesChange={handleNotesChange}
              handleSaveNotes={handleSaveNotes}
              noteName="characters"
              label="Personnages"
            />
            <NotesSection
              activeNote={activeNote}
              notes={notes}
              handleNotesChange={handleNotesChange}
              handleSaveNotes={handleSaveNotes}
              noteName="quest"
              label="Quêtes"
            />
            <NotesSection
              activeNote={activeNote}
              notes={notes}
              handleNotesChange={handleNotesChange}
              handleSaveNotes={handleSaveNotes}
              noteName="items"
              label="Objets"
            />
            <NotesSection
              activeNote={activeNote}
              notes={notes}
              handleNotesChange={handleNotesChange}
              handleSaveNotes={handleSaveNotes}
              noteName="other"
              label="Autres"
            />
          </>
        )}
      </div>
      {isSideOpen && (
        <div className="table__notes-pannel--divider"/>
      )}
      <div 
        onClick={() => setIsSideOpen((prev) => !prev)}
        className="table__notes-pannel--slide-btn"
        >
        <i className={`fa-solid ${isSideOpen ? "fa-chevron-left" : "fa-chevron-right"}`}/>
      </div>
    </div>
  );
};

export default NotesPanel;
