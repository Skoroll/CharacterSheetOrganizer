import React, { useState, useEffect, useContext } from "react";

interface User {
  _id?: string;
  userPseudo: string;
  isAuthenticated: boolean;
  token?: string;
}

interface UserProviderProps {
  children: React.ReactNode;
}

const UserContext = React.createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}>({
  user: { userPseudo: "", isAuthenticated: false },
  setUser: () => {}, // Valeur par défaut
});

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>({
    _id: undefined,
    userPseudo: "",
    isAuthenticated: false,
    token: undefined,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
  
    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        _id: parsedUser._id,
        userPseudo: parsedUser.name,
        isAuthenticated: true,
        token, // Stocke le token
      });
    }
  }, []);
  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider, useUser };
