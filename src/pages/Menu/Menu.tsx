import { useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CharacterList from "../../components/ModalContent/Character/CharacterList";
import ManageAccount from "../../components/ModalContent/Account/ManageAccount";
import Modal from "../../components/Modal/Modal";
import Settings from "../../components/ModalContent/Account/Settings";
import TableTopBrowse from "../../components/ModalContent/ModalTabletop/TableTopBrowse/TableTopBrowse";
import TabletopCreation from "../../components/ModalContent/ModalTabletop/TabletopCreation/TabletopCreation";
import TabletopJoin from "../../components/ModalContent/ModalTabletop/TabletopJoin/TabletopJoin";
import "./Menu.scss";

export default function Menu() {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ReactNode | null>(null);

  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token
    navigate("/"); // Redirige vers l'accueil
  };

  const goCreateSheet = () => {
    navigate("/creation-de-personnage");
  };

  const userOptions: { label: string; component?: ReactNode; action?: () => void }[] = [
    { label: "Gérer le compte", component: <ManageAccount /> },
    { label: "Préférences", component: <Settings /> },
    { label: "Se déconnecter", action: handleLogout }, // Appelle `handleLogout`
  ];

  const characterOptions: { label: string; component?: ReactNode; action?: () => void }[] = [
    { label: "Créer un personnage", action: goCreateSheet },
    { label: "Gérer les personnages", component: <CharacterList /> },
  ];

  const tableOptions: { label: string; component?: ReactNode; action?: () => void }[] = [
    { label: "Créer une table de jeu", component: <TabletopCreation /> },
    { label: "Rejoindre une table", component: <TableTopBrowse /> },
  ];

  const menuSections = [
    {
      title: "Votre compte",
      options: userOptions,
    },
    {
      title: "Les personnages",
      options: characterOptions,
    },
    {
      title: "Les tables de jeux",
      options: tableOptions,
    },
  ];

  // Ouvrir la modale avec un composant spécifique
  const handleOptionClick = (title: string, content: ReactNode) => {
    setModalTitle(title);
    setSelectedContent(content);
    setModalOpen(true);
  };

  return (
    <>
      <div className="main-menu">
        <h2>Que voulez-vous faire ?</h2>

        {menuSections.map(({ title, options }, index) => (
          <section key={index}>
            <h3>{title}</h3>
            <ul>
              {options.map(({ label, component, action }, idx) => (
                <li key={idx} onClick={() => (action ? action() : component && handleOptionClick(label, component))}>
                  {label}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Affichage de la modal */}
      {isModalOpen && modalTitle && selectedContent && (
        <Modal title={modalTitle} content={selectedContent} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
