import { Link } from "react-router-dom";
import "./NotFound.scss";

export default function NotFound() {
  return (
    <div className="page-404">
      <h1>404</h1>
      <h2>Oops ! Cette page est introuvable.</h2>
      <p>Ce que vous cherchez n'existe peut-être plus</p>
      <Link to="/" className="back-home">
        <i className="fa-solid fa-arrow-left"></i> Retour à l'accueil
      </Link>
    </div>
  );
}
