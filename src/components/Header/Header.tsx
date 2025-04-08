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
  const [isUnfoldOpen, setIsUnfoldOpen] = useState(false);
  const { user } = useUser();
  const toggleNav = () => setIsOpen((prev) => !prev);
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
            onMouseEnter={() => setIsUnfoldOpen(true)}
            onMouseLeave={() => setIsUnfoldOpen(false)}
          >
            <button>
              Parties <i className="fa-solid fa-caret-down"></i>
            </button>

            {/* Affichage du menu déroulant uniquement si isUnfoldOpen est true */}
            {isUnfoldOpen && (
              <UnfoldingMenu
                content={<UnfoldingMenu content={<NewGame />} />}
              />
            )}
          </div>
          <button onClick={() => navigate("/news")}>Nouveautés</button>
          <button onClick={() => navigate("/tutorial")}>
            Tutoriel <i className="fa-solid fa-caret-down"></i>
          </button>
          <a
            href="https://elder-craft.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button>Obtenir Aria</button>
          </a>
        </nav>
      </div>
      {/* Bouton pour le menu utilisateur (si connecté) */}
      {user?.isAuthenticated && (
        <button
          className="menu-toggle"
          onClick={toggleNav}
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
