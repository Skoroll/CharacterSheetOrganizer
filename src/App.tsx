import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import useStyleStore from "./utils/useStyleStore";
import CharacterDetails from "./pages/CharacterDetails/CharacterDetails";
import CreateSheet from "./components/CreateSheet/CreateSheet";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Legal from "./pages/Legal/Legal.js";
import NotFound from "./pages/NotFound/NotFound.js";
import Tabletop from "./pages/Tabletop/Tabletop";
import ResetPassword from "./components/ResetPassword/ResetPassword.js";
import { UserProvider } from "./Context/UserContext";  // ✅ Import du UserProvider
import { refreshAccessToken } from "./utils/authService";
import Settings from "./components/ModalContent/Account/Settings";
import GlobalStyle from "./style/GlobalStyle.js";
import { BeatLoader } from "react-spinners";
import "./App.scss";

function App() {
  const theme = useStyleStore((state) => state.theme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      await refreshAccessToken();
      setLoading(false);
    };
    refreshToken();
  }, []);

  if (loading) return <BeatLoader/>; // ✅ Empêche un écran blanc au chargement

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>  {/* ✅ Router AVANT UserProvider */}
        <UserProvider>  {/* ✅ UserProvider DANS Router */}
          <div className="app-container">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/creation-de-personnage" element={<CreateSheet />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/personnage/:id" element={<CharacterDetails />} />
                <Route path="/table/:id" element={<Tabletop />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/mentions-legales" element={<Legal/>}/>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
