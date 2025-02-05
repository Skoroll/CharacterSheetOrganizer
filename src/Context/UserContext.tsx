import { createContext, useContext, useState, ReactNode } from "react";

type UserContextType = {
  userPseudo: string;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType>({ userPseudo: "", isAuthenticated: false });

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userPseudo, setUserPseudo] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <UserContext.Provider value={{ userPseudo, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
