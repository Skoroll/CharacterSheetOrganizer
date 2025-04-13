import React, { createContext, useContext, useState } from "react";

// Déclare les modales que tu veux contrôler globalement
interface ModalContextProps {
  showLeaveModal: boolean;
  showCreateTableModal: boolean;
  showJoinTableModal: boolean; // ✅ AJOUT
  joinTableData: { tableId: string; gameMasterId: string; game: string } | null;
  openJoinTableModal: (data: { tableId: string; gameMasterId: string; game: string }) => void;
  closeJoinTableModal: () => void;
  openLeaveModal: () => void;
  closeLeaveModal: () => void;
  openCreateTableModal: () => void;
  closeCreateTableModal: () => void;
}


// Création du contexte
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

// Provider
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const openLeaveModal = () => setShowLeaveModal(true);
  const closeLeaveModal = () => setShowLeaveModal(false);
  const [showJoinTableModal, setShowJoinTableModal] = useState(false);
  const [joinTableData, setJoinTableData] = useState<ModalContextProps["joinTableData"]>(null);
  const openCreateTableModal = () => setShowCreateTableModal(true); // ✅ AJOUT
  const closeCreateTableModal = () => setShowCreateTableModal(false); // ✅ AJOUT
  const openJoinTableModal = (data: { tableId: string; gameMasterId: string; game: string }) => {
    setJoinTableData(data);
    setShowJoinTableModal(true);
  };
  
  
  const closeJoinTableModal = () => {
    setJoinTableData(null);
    setShowJoinTableModal(false);
  };

  return (
<ModalContext.Provider
  value={{
    showLeaveModal,
    showCreateTableModal,
    showJoinTableModal,
    joinTableData,
    openLeaveModal,
    closeLeaveModal,
    openCreateTableModal,
    closeCreateTableModal,
    openJoinTableModal,
    closeJoinTableModal
  }}
>
  {children}
</ModalContext.Provider>

  );
};

// Hook personnalisé
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
