import React, { useState, useEffect, createContext, useContext } from "react";
import { loginUser, api } from "../utils/authService"; // <-- Assure toi que api est bien importé
import { AppUser } from "../types/AppUser";

interface UserContextProps {
  user: AppUser;
  setUser: React.Dispatch<React.SetStateAction<AppUser>>;
  login: (name: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | null>(null);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser>({
    userPseudo: "",
    isAuthenticated: false,
    token: undefined,
    selectedCharacterName: "",
    isAdmin: false,
    isPremium: false,
  });

  // ✅ A la montée du provider → Vérifie le token et récupère les infos sécurisées
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/api/users/me");
        const userData = res.data.user;

        setUser({
          _id: userData._id,
          userPseudo: userData.name,
          isAuthenticated: true,
          token,
          isAdmin: userData.isAdmin,
          isPremium: userData.isPremium,
          selectedCharacterName: userData.selectedCharacterName || "",
        });
      } catch {
        localStorage.removeItem("token");
      }
    };

    fetchUser();
  }, []);

  const login = async (name: string, password: string): Promise<boolean> => {
    const data = await loginUser(name, password);

    if (data) {
      setUser({
        _id: data.user.id,
        userPseudo: data.user.name,
        isAuthenticated: true,
        token: data.accessToken,
        isAdmin: data.user.isAdmin,
        isPremium: data.user.isPremium,
        selectedCharacterName: data.user.selectedCharacterName || "",
      });

      localStorage.setItem("token", data.accessToken);

      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    setUser({
      userPseudo: "",
      isAuthenticated: false,
      token: undefined,
      selectedCharacterName: "",
      isAdmin: false,
      isPremium: false,
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserContext, UserProvider, useUser };
