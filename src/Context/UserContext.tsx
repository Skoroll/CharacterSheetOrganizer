import React, { useState, useEffect, createContext, useContext } from "react";
import { loginUser } from "../utils/authService";

// ✅ Interface utilisateur
interface User {
  _id?: string;
  userPseudo: string;
  isAuthenticated: boolean;
  token?: string;
  selectedCharacterName?: string;
  isAdmin?: boolean;
}

// ✅ Interface du contexte
interface UserContextProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  login: (name: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// ✅ Création du contexte
const UserContext = createContext<UserContextProps | null>(null);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    userPseudo: "",
    isAuthenticated: false,
    token: undefined,
    selectedCharacterName: "",
    isAdmin: false,
  });

  // ✅ Vérifier si un utilisateur est déjà connecté
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        _id: parsedUser.id || parsedUser._id,
        userPseudo: parsedUser.userPseudo || parsedUser.name,
        isAuthenticated: true,
        token,
        isAdmin: parsedUser.isAdmin === true,
        selectedCharacterName: parsedUser.selectedCharacterName || "",
      });
    }
  }, []);

  // ✅ Fonction de connexion
  const login = async (name: string, password: string): Promise<boolean> => {
    const data = await loginUser(name, password);

    if (data) {
      setUser({
        _id: data.user.id,
        userPseudo: data.user.name,
        isAuthenticated: true,
        token: data.accessToken,
        isAdmin: data.user.isAdmin,
        selectedCharacterName: data.user.selectedCharacterName || "",
      });

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      return true;
    }

    return false;
  };

  // ✅ Fonction de déconnexion améliorée (sans `useNavigate()`)
  const logout = () => {  
    // ✅ Supprimer les tokens AVANT la mise à jour de l'état
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  
    setUser({
      userPseudo: "",
      isAuthenticated: false,
      token: undefined,
      selectedCharacterName: "",
      isAdmin: false,
    });
  };
  

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Hook personnalisé pour utiliser le contexte
const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserContext, UserProvider, useUser };
