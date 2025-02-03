

import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-6 text-center">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} Skorol Web - Tous droits réservés.</p>
        <div className="mt-2">
          <Link to="/mentions-legales" className="text-blue-400 hover:underline mx-2">
            Mentions Légales
          </Link>
          <Link to="/contact" className="text-blue-400 hover:underline mx-2">
            Contact
          </Link>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="text-gray-400 hover:text-blue-400">
            
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400">
            
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400">
            
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
