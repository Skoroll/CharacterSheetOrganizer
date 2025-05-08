import { useUser } from "../../Context/UserContext";
/*import GoPremiumBtn from "../Premium/GoPremiumBtn/GoPremiumBtn";*/
import "./Welcome.scss";

const Welcome = () => {
  const { user } = useUser();

  if (!user.isAuthenticated) {
    return (
      <div className="welcome">
       <h1> Bienvenue sur Crit Roller, </h1>
       <h2>pour des sessions de jeu de rôle
        inoubliables !</h2>
        <br />✨ Que vous soyez Maître du Jeu ou joueur intrépide, Crit Roller
        vous permet de :
        <ul>
          <li>🎲 Créer des personnages uniques,</li>
          <li>🗺️ Rejoindre ou créer des tables de jeu en ligne,</li>
          <li>🧾 Gérer vos fiches, votre inventaire, vos compétences et vos équipements,</li>
          <li>📜 Plonger dans des récits personnalisés et suivre l'évolution de vos héros, </li>
          <li>🔔 Et bientôt… notifications, profils publics, système d'amis, soundboards et bien plus encore !</li>
        </ul>

      </div>
    );
  }

  return (
    <div className="welcome">
      <h1>Bienvenue, {user.userPseudo} !</h1>
      {user.isAdmin && <p className="admin-badge">Administrateur</p>}
      {/*<GoPremiumBtn/>*/}
    </div>
  );
};

export default Welcome;
