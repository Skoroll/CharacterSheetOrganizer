import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "styled-components"; // Importer ThemeProvider
import useStyleStore from "./utils/useStyleStore"; // Importer ton store Zustand
import CharacterDetails from "./pages/CharacterDetails/CharacterDetails";
import CreateSheet from "./components/CreateSheet/CreateSheet";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Tabletop from "./pages/Tabletop/Tabletop";
import ResetPassword from "./components/ResetPassword/ResetPassword.js";
import { UserProvider } from "./Context/UserContext";
import { refreshAccessToken } from "./utils/authService";

import "./App.scss";

import Settings from "./components/ModalContent/Account/Settings";
import GlobalStyle from "./style/GlobalStyle.js"; // Importer les styles globaux

function App() {
  // Récupérer le thème depuis le store
  const theme = useStyleStore((state) => state.theme);
  useEffect(() => {
    const refreshToken = async () => {
      await refreshAccessToken(); // 🔥 Rafraîchit le token au chargement
    };
    refreshToken();
  }, []);
  return (
    <>
      {/* Envelopper ton application avec ThemeProvider pour appliquer le thème */}
      <ThemeProvider theme={theme}>
        {/* Appliquer les styles globaux */}
        <GlobalStyle />
        <UserProvider>
          <BrowserRouter>
            <div className="app-container">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/creation-de-personnage"
                    element={<CreateSheet />}
                  />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                  />
                  <Route
                    path="/personnage/:id"
                    element={<CharacterDetails />}
                  />
                  <Route path="/table/:id" element={<Tabletop />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
