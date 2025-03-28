import React, { useRef, useEffect, useState } from "react";
import DeleteTable from "../DeleteTable/DeleteTable";
import Npcs from "../Npcs/Npcs";
import PlayerList from "../PlayerList/PlayerList";
import SendDocs from "../SendDocs/SendDocs";
import SoundBoard from "../SoundBoard/SoundBoard";
import TableStyle from "../TableStyle/TableStyle";
import "./GmToolBar.scss";

interface GmToolBarProps {
  tableId: string;
  API_URL: string;
  refreshTables: () => void;
  players: {
    _id: string;
    userId: string;
    playerName: string;
    selectedCharacter: string | null;
    isGameMaster: boolean;
  }[];
  isGameMaster: boolean;
  activePanel: "npcs" | "sendDocs" | "playerList" | "soundBoard" | "tableStyle" | null;
  togglePanel: (panel: "npcs" | "sendDocs" | "playerList" | "soundBoard" | "tableStyle" | null) => void;
  onStyleUpdate: () => void;
}

const GmToolBar: React.FC<GmToolBarProps> = ({ tableId, API_URL, players, isGameMaster, activePanel, refreshTables, togglePanel, onStyleUpdate }) => {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // ✅ État pour afficher la modale de suppression

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        togglePanel(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [togglePanel]);

  return (
    <div className="gm-toolbar-container" ref={toolbarRef}>
      <p className="gm-toolbar__heading">Outils du Maître de Jeu</p>
      <div className="gm-toolbar">
        <button onClick={() => togglePanel("sendDocs")} ><i className="fa-solid fa-file-import"></i></button>
        <button onClick={() => togglePanel("playerList")} ><i className="fa-solid fa-user"></i></button>
        <button onClick={() => togglePanel("soundBoard")}><i className="fa-solid fa-music"></i></button>
        <button onClick={() => togglePanel("npcs")}><i  className="fa-solid fa-ghost"></i></button>
        <button><i className="fa-solid fa-hat-wizard"></i></button>
        <button><i className="fa-solid fa-suitcase"></i></button>
        <button onClick={() => togglePanel("tableStyle")}><i  className="fa-solid fa-brush"></i></button>

        {/* ✅ L'icône ouvre directement la modale de suppression */}
       <button onClick={() => setIsDeleteModalOpen(true)}> <i className="fa-solid fa-trash"></i></button>
      </div>

      {/* ✅ Affichage de la modale de suppression */}
      {isDeleteModalOpen && (
        <DeleteTable 
          tableId={tableId} 
          API_URL={API_URL} 
          onTableDeleted={refreshTables} 
          closeModal={() => setIsDeleteModalOpen(false)} // ✅ Permet de fermer la modale
        />
      )}

      {/* Affichage des panneaux */}
      {activePanel === "npcs" && <Npcs tableId={tableId} />}
      {activePanel === "sendDocs" && <SendDocs />}
      {activePanel === "playerList" && <PlayerList players={players} tableId={tableId} isGameMaster={isGameMaster} />}
      {activePanel === "soundBoard" && <SoundBoard />}
      {activePanel === "tableStyle" && <TableStyle tableId={tableId} API_URL={API_URL} onStyleUpdate={onStyleUpdate} />}
    </div>
  );
};

export default GmToolBar;
