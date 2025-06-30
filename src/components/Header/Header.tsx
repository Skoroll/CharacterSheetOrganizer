import { useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";

import NewGame from "./NewGame/NewGame";
import UnfoldingMenu from "./UnfoldingMenu/UnfoldingMenu";
import GoPremiumBtn from "../Premium/GoPremiumBtn/GoPremiumBtn";
import Nav from "./Nav";
import "./Header.scss";

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isPartyMenuOpen, setIsPartyMenuOpen] = useState(false);
  const [isTutorialMenuOpen, setIsTutorialMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useUser();
  const toggleNav = () => {
    setIsPartyMenuOpen(false);
    setIsTutorialMenuOpen(false);
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <a className="logo" href="/">
        <p>
          <span className="logo--main">
            <span className="bold">C</span>rit <span className="bold">R</span>
            oller
          </span>
          <span className="logo--subtitle">Plateforme de JDR</span>
        </p>
      </a>

      <div className="header__content">
        {/* Navigation principale avec Nouveautés et Tutoriel */}
        <nav className="main-nav">
          <button onClick={() => navigate("/")}>Accueil</button>
          {/* Conteneur du menu déroulant */}
          <div
            className="dropdown"
            onMouseEnter={() => {
              if (!isOpen) setIsPartyMenuOpen(true);
            }}
            onMouseLeave={() => {
              if (!isOpen) setIsPartyMenuOpen(false);
            }}
          >
            <button>
              Parties <i className="fa-solid fa-caret-down"></i>
            </button>

            {isPartyMenuOpen && <UnfoldingMenu content={<NewGame />} />}
          </div>

          <button onClick={() => navigate("/news")}>Nouveautés</button>
          <div
            className="dropdown"
            onMouseEnter={() => {
              if (!isOpen) setIsTutorialMenuOpen(true);
            }}
            onMouseLeave={() => {
              if (!isOpen) setIsTutorialMenuOpen(false);
            }}
          >
            <button onClick={() => navigate("/tutoriel")}>
              Tutoriel <i className="fa-solid fa-caret-down"></i>
            </button>

            {isTutorialMenuOpen && (
              <UnfoldingMenu
                content={
                  <ul className="tutorial-menu">
                    <li
                      onClick={() => {
                        navigate("/tutoriel#general"); // correspond à "L'application"
                        setIsTutorialMenuOpen(false);
                      }}
                    >
                      L'application
                    </li>
                    <li
                      onClick={() => {
                        navigate("/tutoriel#player"); // correspond à "Joueur"
                        setIsTutorialMenuOpen(false);
                      }}
                    >
                      Joueur
                    </li>
                    <li
                      onClick={() => {
                        navigate("/tutoriel#gm"); // correspond à "Maître de jeu"
                        setIsTutorialMenuOpen(false);
                      }}
                    >
                      Maître de jeu
                    </li>
                  </ul>
                }
              />
            )}
          </div>

          <a
            href="https://elder-craft.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Obtenir Aria</button>
          </a>
          <GoPremiumBtn user={user} />
        </nav>
      </div>
      <div className="menu-wrapper">
        {/* Panneau d'admin */}
        {user.isAdmin && (
          <button className="admin-btn" onClick={() => navigate("/admin")}>
            Administrateur
          </button>
        )}
        {/* Notifications */}
        <div className="notif">
<button onClick={() => setIsNotificationOpen(!isNotificationOpen)}>
  <i className={`fa-solid ${isNotificationOpen ? "fa-envelope-open" : "fa-envelope"}`}></i>
</button>

        <span className="notif--number">1</span>
</div>
        {/* Bouton pour le menu utilisateur (si connecté) */}
        {user?.isAuthenticated && (
          <button
            id="menu-toggle"
            className="menu-toggle"
            onClick={(e) => {
              e.stopPropagation();
              toggleNav();
            }}
            aria-label="Affiche la navigation"
            aria-expanded={isOpen}
          >
            <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        )}
      </div>
      {/* Navigation utilisateur (dans le menu déroulant) */}
      {isOpen && (
        <Nav className="main-menu" toggleNav={toggleNav} role="navigation" />
      )}
    </header>
  );
}
