import { useState, ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CharacterList from "../ModalContent/Character/CharacterList";
import ManageAccount from "../ModalContent/Account/ManageAccount";
import Modal from "../Modal/Modal";
import Settings from "../ModalContent/Account/Settings";
import TableTopBrowse from "../ModalContent/ModalTabletop/TableTopBrowse/TableTopBrowse";
import TabletopCreation from "../ModalContent/ModalTabletop/TabletopCreation/TabletopCreation";
import "./Nav.scss";

interface NavProps {
  className: string;
  toggleNav: () => void;
  component?: never;
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
    localStorage.removeItem("token");
    navigate("/");
  };

  const goCreateSheet = () => {
    navigate("/creation-de-personnage");
  };

  const userOptions: Option[] = [
    { label: "Gérer le compte", component: <ManageAccount /> },
    { label: "Préférences", component: <Settings /> },
    { label: "Se déconnecter", action: handleLogout },
  ];

  const characterOptions: Option[] = [
    { label: "Créer un personnage", action: goCreateSheet },
    { label: "Gérer les personnages", component: <CharacterList /> },
  ];

  const tableOptions: Option[] = [
    { label: "Créer une table de jeu", component: <TabletopCreation /> },
    { label: "Rejoindre une table", component: <TableTopBrowse /> },
  ];

  const menuSections = [
    { title: "Votre compte", options: userOptions },
    { title: "Les personnages", options: characterOptions },
    { title: "Les tables de jeux", options: tableOptions },
  ];

  // Ouvrir la modale avec un composant spécifique
  const handleOptionClick = (title: string, content: ReactNode) => {
    setModalTitle(title);
    setSelectedContent(content);
    setModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        toggleNav(); // Ferme la navigation si on clique en dehors
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav ref={navRef} className={`main-menu ${className}`}>
        {menuSections.map(({ title, options }, index) => (
          <section key={index}>
            <h2>{title}</h2>
            <ul>
              {options.map((option, idx) => (
                <li
                  key={idx}
                  onClick={() =>
                    option.action?.() ||
                    handleOptionClick(option.label, option.component!)
                  }
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>

      {isModalOpen && modalTitle && selectedContent && (
        <Modal
          title={modalTitle}
          content={selectedContent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
