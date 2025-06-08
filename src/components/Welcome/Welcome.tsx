import { useUser } from "../../Context/UserContext";
import PricingTable from "../PricingTable/PrincingTable";
/*import GoPremiumBtn from "../Premium/GoPremiumBtn/GoPremiumBtn";*/
import "./Welcome.scss";

const Welcome = () => {
  const { user } = useUser();

  if (!user.isAuthenticated) {
    return (
      <div className="welcome welcome__unlogged">
        <div className="welcome__unlogged--bg">
          <h1>
              <span className="welcome__app-name">CRIT ROLLER</span>
            <br/>
              Créez, jouez, partagez vos aventures de jeu de rôle en ligne
          </h1>
          <button>Créer un compte</button>
        </div>
        <ul className="welcome__features">
          <li>
            <div className="welcome__features--desc">
              <i className="fa-solid fa-user"></i>
              <h2>Créez vos propres personnages</h2>
            </div>
            <p>Créez et gérer vos personnages à souhait.</p>
          </li>
          <li>
            <div className="welcome__features--desc">
              <i className="fa-solid fa-dice-d20"></i>
              <h2>Table de jeu en ligne</h2>
            </div>
            <p>Rejoingez ou créez des campagnes en tant que MJ ou joueur.</p>
          </li>
          <li>
            <div className="welcome__features--desc">
              <i className="fa-solid fa-book"></i>
              <h2>Bibliothèque de quêtes</h2>
            </div>
            <p>
              En manque d'inspiration ? Consultez la bibliothèque de quête
              communautaire ou ajoutez les votres.
            </p>
          </li>
        </ul>

        <div className="premium-free">
          <PricingTable/>

        </div>
      </div>
    );
  }

  return (
    <div className="welcome welcome__logged">
      <h1>Bienvenue, {user.userPseudo} !</h1>
      {/*<GoPremiumBtn/>*/}
    </div>
  );
};

export default Welcome;
