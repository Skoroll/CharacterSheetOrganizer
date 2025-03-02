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
        <i onClick={() => togglePanel("sendDocs")} className="fa-solid fa-file-import"></i>
        <i onClick={() => togglePanel("playerList")} className="fa-solid fa-user"></i>
        <i onClick={() => togglePanel("soundBoard")} className="fa-solid fa-music"></i>
        <i onClick={() => togglePanel("npcs")} className="fa-solid fa-ghost"></i>
        <i className="fa-solid fa-hat-wizard"></i>
        <i className="fa-solid fa-suitcase"></i>
        <i onClick={() => togglePanel("tableStyle")} className="fa-solid fa-brush"></i>

        {/* ✅ L'icône ouvre directement la modale de suppression */}
        <i onClick={() => setIsDeleteModalOpen(true)} className="fa-solid fa-trash"></i>
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
