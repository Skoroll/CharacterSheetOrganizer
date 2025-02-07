import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

const MyComponent = () => {
  const { user } = useContext(UserContext);

  if (!user.isAuthenticated) {
    return <div>Vous devez vous connecter pour accéder à cette page.</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user.userPseudo}!</h1>
      {/* Le reste de ton contenu */}
    </div>
  );
};


export default MyComponent