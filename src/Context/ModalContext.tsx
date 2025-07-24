import React, { createContext, useContext, useState } from "react";

import type { UserProfile } from "../components/Modal/UserProfileModal/UserProfileModal";

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

  showAuthModal: boolean;
  isSignUpMode: boolean;
  openAuthModal: (isSignUp: boolean) => void;
  closeAuthModal: () => void;

  showUserProfileModal: boolean;
  userProfileData: UserProfile | null;
  openUserProfileModal: (data: UserProfile) => void;
  closeUserProfileModal: () => void;
  handleOpenUserProfile: (userId: string) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const openAuthModal = (isSignUp: boolean) => {
    setIsSignUpMode(isSignUp);
    setShowAuthModal(true);
  };
  const closeAuthModal = () => setShowAuthModal(false);

  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [userProfileData, setUserProfileData] = useState<UserProfile | null>(null);

  const openUserProfileModal = (data: UserProfile) => {
    setUserProfileData(data);
    setShowUserProfileModal(true);
  };

  const closeUserProfileModal = () => {
    setUserProfileData(null);
    setShowUserProfileModal(false);
  };

  const handleOpenUserProfile = async (userId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/${userId}`);
      if (!res.ok) throw new Error("Impossible de récupérer le profil");
      const data: UserProfile = await res.json();
      openUserProfileModal(data);
    } catch (error) {
      console.error("Erreur récupération profil :", error);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        showLeaveModal,
        showCreateTableModal,
        showJoinTableModal,
        joinTableData,
        openJoinTableModal,
        closeJoinTableModal,
        openLeaveModal,
        closeLeaveModal,
        openCreateTableModal,
        closeCreateTableModal,
        showAuthModal,
        isSignUpMode,
        openAuthModal,
        closeAuthModal,
        showUserProfileModal,
        userProfileData,
        openUserProfileModal,
        closeUserProfileModal,
        handleOpenUserProfile,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
