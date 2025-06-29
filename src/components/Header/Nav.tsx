import { useState, ReactNode, useEffect, useRef } from "react";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import CharacterList from "../ModalContent/Character/CharacterList";
import ManageAccount from "../ModalContent/Account/ManageAccount";
import Modal from "../Modal/Modal";
import Settings from "../ModalContent/Account/Settings";
import UserProfileModal from "../Modal/UserProfileModal/UserProfileModal";
import TableTopBrowse from "../ModalContent/ModalTabletop/TableTopBrowse/TableTopBrowse";
import TabletopCreation from "../ModalContent/ModalTabletop/TabletopCreation/TabletopCreation";
import { BeatLoader } from "react-spinners";
import "./Nav.scss";

interface NavProps {
  className: string;
  toggleNav: () => void;
  component?: never;
  role?: string,
}

interface ActionOption {
  label: string;
  action: () => void;
  component?: never; // Empêche la coexistence de `action` et `component`
}

interface ComponentOption {
  label: string;
  component: ReactNode;
  action?: never; // Empêche la coexistence de `component` et `action`
}

type Option = ActionOption | ComponentOption;

export default function Nav({ className, toggleNav }: NavProps) {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ReactNode | null>(
    null
  );
  const navRef = useRef<HTMLDivElement | null>(null);

  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);



  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout(); 
    navigate("/"); 
    window.location.reload();
  };

  const userOptions: Option[] = [
    { label: "Gérer le compte", component: <ManageAccount /> },
    { label: "Mon profil", component: <UserProfileModal/> },
    { label: "Thèmes", component: <Settings isPremium={user?.isPremium === true} /> },
    { label: "Vos personnages", component: <CharacterList /> },
    { label: "Se déconnecter", action: handleLogout },
  ];


  const tableOptions: Option[] = [
    { label: "Créer une table de jeu", component: <TabletopCreation onCreated={() => {}} /> },
    { label: "Rejoindre une table", component: <TableTopBrowse /> },
  ];

  const menuSections = [
    { title: "Votre compte", options: userOptions },
    { title: "Jouer", options: tableOptions },
  ];

  // Ouvrir la modale avec un composant spécifique
  const handleOptionClick = (title: string, content: ReactNode) => {
    setModalTitle(title);
    setSelectedContent(content);
    setModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("#menu-toggle")) return;
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        toggleNav();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {user.isAuthenticated ? (
        <nav ref={navRef} className={`main-menu ${className}`}>
          {menuSections.map(({ title, options }, index) => (
            <section key={index}>
              <h2>{title}</h2>
              <ul>
                {options.map((option, idx) => (
                  <li key={idx} onClick={() => option.action?.() || handleOptionClick(option.label, option.component!)}>
                    {option.label}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      ) : (
        <p><BeatLoader/></p>
      )}

      {isModalOpen && modalTitle && selectedContent && (
        <Modal title={modalTitle} onClose={() => setModalOpen(false)}>
          {selectedContent}
        </Modal>
      )}
    </>
  );
}
