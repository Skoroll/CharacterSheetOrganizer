import { useState } from "react";
import Nav from "./Nav";
import "./Header.scss";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <h1>CSO</h1>
      <button className="menu-toggle" onClick={toggleNav} aria-label="Toggle navigation">
        <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
      </button>

      {isOpen && <Nav className="main-menu" toggleNav={toggleNav} />}
    </header>
  );
}
