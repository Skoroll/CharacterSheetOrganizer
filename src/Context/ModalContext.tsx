import React, { createContext, useContext, useState } from "react";

// ➕ Déclare les modales que tu veux contrôler globalement
interface ModalContextProps {
  showLeaveModal: boolean;
  openLeaveModal: () => void;
  closeLeaveModal: () => void;
}

// Création du contexte
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

// Provider
export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const openLeaveModal = () => setShowLeaveModal(true);
  const closeLeaveModal = () => setShowLeaveModal(false);

  return (
    <ModalContext.Provider value={{ showLeaveModal, openLeaveModal, closeLeaveModal }}>
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
