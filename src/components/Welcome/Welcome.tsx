import { useUser } from "../../Context/UserContext";
import "./Welcome.scss";

const Welcome = () => {
  const { user } = useUser();

  if (!user.isAuthenticated) {
    return <div>Vous devez vous connecter pour accéder à cette page.</div>;
  }

  return (
    <div className="welcome">
      <h2>Bienvenue, {user.userPseudo}!</h2>
    </div>
  );
};

export default Welcome;
