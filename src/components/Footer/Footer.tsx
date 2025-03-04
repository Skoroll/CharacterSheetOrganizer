import { Link } from "react-router-dom";
import "./Footer.scss";
import kofiLogo from "../../assets/kofi-logo.webp";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__cta">
        <div className="footer__cta--kofi">
          <a
            className="kofi-link"
            href="https://ko-fi.com/manage/index?method=externallogin#"
          >
            <img src={kofiLogo} alt="Logo Ko-fi" loading="lazy"/>
            <p>
              Vous voulez soutenir l'application ?
              <br />
              Vous pouvez faire un don sur Kofi.
            </p>
          </a>
        </div>
        <div className="footer-wrapper">
          <div className="footer__cta--social">
            <ul>
              <li>
                <a href="https://www.instagram.com/skoroll_/">
                  <i className="fa-brands fa-instagram"></i> Instagram
                </a>
              </li>
              <li>
                <a href="https://discord.gg/ypsABckuDt">
                  <i className="fa-brands fa-discord"></i> Discord
                </a>
              </li>
            </ul>
          </div>
          <div className="container">
            <div className="footer__important">
              <Link
                to="/mentions-legales"
                className="text-blue-400 hover:underline mx-2"
              >
                Mentions Légales
              </Link>
              <Link
                to="/contact"
                className="text-blue-400 hover:underline mx-2"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
        <p className="footer--CR">
          © {new Date().getFullYear()} Skorol Web - Tous droits réservés.
          <br />
          Ce site est un outil non officiel pour le jeu de rôle Aria, créé par FibreTigre et publié par <a className="credit-link" target="_blank" href="https://elder-craft.com/">ElderCraft.</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
