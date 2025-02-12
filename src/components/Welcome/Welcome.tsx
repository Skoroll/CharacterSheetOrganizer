import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

const Welcome = () => {
  const { user } = useContext(UserContext);

  if (!user.isAuthenticated) {
    return <div>Vous devez vous connecter pour accéder à cette page.</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user.userPseudo}!</h1>
      <p>Retourner sur une table</p>
    </div>
  );
};


export default Welcome