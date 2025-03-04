import { useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";
import Nav from "./Nav";
import "./Header.scss";

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useUser();
  const toggleNav = () => setIsOpen((prev) => !prev);
  const toggleAuth = () => setIsAuthOpen((prev) => !prev);
  return (
    <header className="header">
      <h1 onClick={() => navigate("/")} role="button" tabIndex={0}>
        Character sheet <br /> Organizer
      </h1>
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
      {!user?.isAuthenticated && 
        <button 
          className="auth-btn"
          aria-label="Formulaire d'authentification"
          aria-expanded={isAuthOpen}
          onClick={toggleAuth}>
            Se connecter
        </button>
      }
      {isOpen && <Nav className="main-menu" toggleNav={toggleNav} role="navigation" />}
      {isAuthOpen && <AuthForm/>}
    </header>
  );
}
