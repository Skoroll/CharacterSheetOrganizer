import { useUser } from "../../Context/UserContext";
import { useModal } from "../../Context/ModalContext";
import PricingTable from "../PricingTable/PrincingTable";
/*import GoPremiumBtn from "../Premium/GoPremiumBtn/GoPremiumBtn";*/
import "./Welcome.scss";
import WelcomeFeatures from "./WelcomeFeatures";

const Welcome = () => {
  const { openAuthModal } = useModal();
  const { user } = useUser();

  if (!user.isAuthenticated) {
    return (
      <div className="welcome welcome__unlogged">
        <div className="welcome__unlogged--bg">
          <h1>
            <span className="welcome__app-name">CRIT ROLLER</span>
            <br />
            Créez, jouez, partagez vos aventures de jeu de rôle en ligne
          </h1>
          <div className="welcome__unlogged--cta">
            <button onClick={() => openAuthModal(true)}>Créer un compte</button>
            <button onClick={() => openAuthModal(false)}>Se connecter</button>
          </div>
          <WelcomeFeatures/>
        </div>

        <div className="premium-free">
          <PricingTable />
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
