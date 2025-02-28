import { useState } from "react";
import Nav from "./Nav";
import SelectTheme from "../SelectTheme/SelectTheme";
import { useNavigate } from "react-router-dom";
import "./Header.scss";

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <h1 onClick={() => navigate("/")}>Character sheet <br/> Organizer</h1>
      <SelectTheme/>
      <button className="menu-toggle" onClick={toggleNav} aria-label="Toggle navigation">
        <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
      </button>

      {isOpen && <Nav className="main-menu" toggleNav={toggleNav} />}
    </header>
  );
  
}
