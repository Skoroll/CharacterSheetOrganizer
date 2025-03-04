import { useState } from "react";
import Nav from "./Nav";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Header.scss";

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const toggleNav = () => setIsOpen((prev) => !prev);

  return (
    <header className="header">
      <h1 onClick={() => navigate("/")} role="button" tabIndex={0}>
        Character sheet <br /> Organizer
      </h1>
      {user?.isAuthenticated && (
        <button
          className="menu-toggle"
          onClick={toggleNav}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      )}
      {isOpen && <Nav className="main-menu" toggleNav={toggleNav} role="navigation" />}
    </header>
  );
}
