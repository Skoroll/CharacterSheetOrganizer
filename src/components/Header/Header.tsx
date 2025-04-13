import { useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";
import NewGame from "./NewGame/NewGame";
import UnfoldingMenu from "./UnfoldingMenu/UnfoldingMenu";
import logoCSO from "../../assets/logo_critroller.png";
import Nav from "./Nav";
import "./Header.scss";

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPartyMenuOpen, setIsPartyMenuOpen] = useState(false);
  const [isTutorialMenuOpen, setIsTutorialMenuOpen] = useState(false);

  const { user } = useUser();
  const toggleNav = () => {
    setIsPartyMenuOpen(false);
    setIsTutorialMenuOpen(false);
    setIsOpen((prev) => !prev);
  };
  const toggleAuth = () => setIsAuthOpen((prev) => !prev);

  return (
    <header className="header">
      <img
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
        src={logoCSO}
        alt="Crit Roller logo"
      />

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
            <button onClick= {() => navigate("/tutoriel")}>
              Tutoriel <i className="fa-solid fa-caret-down"></i>
            </button>

            {isTutorialMenuOpen && (
  <UnfoldingMenu
    content={
      <ul className="tutorial-menu">
        <li
          onClick={() => {
            navigate("/tutoriel#general"); // ✅ correspond à "L'application"
            setIsTutorialMenuOpen(false);
          }}
        >
          L'application
        </li>
        <li
          onClick={() => {
            navigate("/tutoriel#player"); // ✅ correspond à "Joueur"
            setIsTutorialMenuOpen(false);
          }}
        >
          Joueur
        </li>
        <li
          onClick={() => {
            navigate("/tutoriel#gm"); // ✅ correspond à "Maître de jeu"
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
        </nav>
      </div>
      {user?.isAdmin === true && (
        <p>Admin</p>
      )}
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
      {/* Navigation utilisateur (dans le menu déroulant) */}
      {isOpen && (
        <Nav className="main-menu" toggleNav={toggleNav} role="navigation" />
      )}
      {/* Bouton de connexion si l'utilisateur n'est pas connecté */}
      {!user?.isAuthenticated && (
        <button
          className="auth-btn"
          aria-label="Formulaire d'authentification"
          aria-expanded={isAuthOpen}
          onClick={toggleAuth}
        >
          Se connecter | S'inscrire
        </button>
      )}
      {/* Formulaire d'authentification */}
      {isAuthOpen && <AuthForm />}
    </header>
  );
}
