import React, { createContext, useContext, useState } from "react";

// ➕ Déclare les modales que tu veux contrôler globalement
interface ModalContextProps {
  showLeaveModal: boolean;
  showCreateTableModal: boolean;
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
  
  const openCreateTableModal = () => setShowCreateTableModal(true); // ✅ AJOUT
  const closeCreateTableModal = () => setShowCreateTableModal(false); // ✅ AJOUT
  

  return (
    <ModalContext.Provider
  value={{
    showLeaveModal,
    showCreateTableModal, // ✅
    openLeaveModal,
    closeLeaveModal,
    openCreateTableModal, // ✅
    closeCreateTableModal // ✅
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
