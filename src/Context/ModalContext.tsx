import React, { createContext, useContext, useState } from "react";

// Déclare les modales que tu veux contrôler globalement
interface ModalContextProps {
  showLeaveModal: boolean;
  showCreateTableModal: boolean;
  showJoinTableModal: boolean;
  joinTableData: { tableId: string; gameMasterId: string; game: string } | null;

  openJoinTableModal: (data: { tableId: string; gameMasterId: string; game: string }) => void;
  closeJoinTableModal: () => void;
  openLeaveModal: () => void;
  closeLeaveModal: () => void;
  openCreateTableModal: () => void;
  closeCreateTableModal: () => void;

  // Auth modal
  showAuthModal: boolean;
  isSignUpMode: boolean;
  openAuthModal: (isSignUp: boolean) => void;
  closeAuthModal: () => void;
}

// Création du contexte
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

// Provider
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // === Modales existantes ===
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [showJoinTableModal, setShowJoinTableModal] = useState(false);
  const [joinTableData, setJoinTableData] = useState<ModalContextProps["joinTableData"]>(null);

  const openLeaveModal = () => setShowLeaveModal(true);
  const closeLeaveModal = () => setShowLeaveModal(false);

  const openCreateTableModal = () => setShowCreateTableModal(true);
  const closeCreateTableModal = () => setShowCreateTableModal(false);

  const openJoinTableModal = (data: { tableId: string; gameMasterId: string; game: string }) => {
    setJoinTableData(data);
    setShowJoinTableModal(true);
  };
  const closeJoinTableModal = () => {
    setJoinTableData(null);
    setShowJoinTableModal(false);
  };

  // === Nouvelle modale d'authentification ===
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const openAuthModal = (isSignUp: boolean) => {
    setIsSignUpMode(isSignUp);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
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
        closeJoinTableModal,
        showAuthModal,
        isSignUpMode,
        openAuthModal,
        closeAuthModal,
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
