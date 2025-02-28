import React, { useState, useEffect, createContext, useContext } from "react";
import { loginUser } from "../utils/authService"; // ✅ Import de la fonction login

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
  login: (name: string, password: string) => Promise<boolean>; // 🔥 Ajout de la fonction `login`
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

  // ✅ Vérification et chargement du user au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
  
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        _id: parsedUser.id || parsedUser._id, // 🔥 Ajoute l'ID
        userPseudo: parsedUser.userPseudo || parsedUser.name,
        isAuthenticated: true,
        token,
        isAdmin: parsedUser.isAdmin || false,
        selectedCharacterName: parsedUser.selectedCharacterName || "",
      });
  
      console.log("✅ Utilisateur chargé depuis le localStorage :", {
        _id: parsedUser.id || parsedUser._id,
        userPseudo: parsedUser.userPseudo || parsedUser.name,
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
      return true; // ✅ Connexion réussie
    }

    return false; // ❌ Connexion échouée
  };

  // ✅ Fonction de déconnexion améliorée
  const logout = () => {
    console.log(
      "%c🔥 `logout()` a été appelé !",
      "background: blue; color: white; font-size: 20px; font-weight: bold; padding: 10px;"
    );
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser({ userPseudo: "", isAuthenticated: false, token: undefined });
    window.location.href = "/";
  };
  
  useEffect(() => {
    console.log("📌 État utilisateur mis à jour :", user);
  }, [user]);
  

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
  return context as UserContextProps; // ✅ Force TypeScript à comprendre que le contexte est valide
};

export { UserContext, UserProvider, useUser };
