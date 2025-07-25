import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import useStyleStore from "./utils/useStyleStore";
import Admin from "./pages/Admin/Admin.js";
import AdminRoute from "./components/Admin/AdminRoute/AdminRoute.js";
import Blog from "./pages/Articles/Blog";
import CharacterDetails from "./pages/CharacterDetails/CharacterDetails";
import CreateSheet from "./components/CreateSheet/CreateSheet";
import Footer from "./components/Footer/Footer";
import GlobalModals from "./components/Modal/GlobalModals.js";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Legal from "./pages/Legal/Legal.js";
import LoadingComp from "./components/LoadingComp/LoadingComp.js";
import NewsPage from "./pages/Articles/News";
import NotFound from "./pages/NotFound/NotFound.js";
import Premium from "./pages/Premium/Premium.js";
import PreviousGame from "./components/PreviousGame/PreviousGame.js";
import Tabletop from "./pages/Tabletop/Tabletop";
import ResetPassword from "./components/ResetPassword/ResetPassword.js";
import { UserProvider } from "./Context/UserContext";
import { ModalProvider } from "./Context/ModalContext.js";
import { refreshAccessToken } from "./utils/authService";
import GlobalStyle from "./style/GlobalStyle.js";
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

  if (loading) return <LoadingComp />; //  Empêche un écran blanc au chargement

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <UserProvider>
          <ModalProvider>
            <div className="app-container">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/creation-de-personnage" element={<CreateSheet />}/>
                  <Route path="/reset-password/:token" element={<ResetPassword />}/>
                  <Route path="/personnage/:id" element={<CharacterDetails />}/>
                  <Route path="/table/:id" element={<Tabletop />} />
                  <Route path="/mentions-legales" element={<Legal />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/tutoriel" element={<Blog />} />
                  <Route path="/partie-precedentes" element={<PreviousGame />}/>
                  <Route path="/premium" element={<Premium/>}/>
                  <Route path="/admin" element={<AdminRoute> <Admin/> </AdminRoute>}/>
                </Routes>
              <GlobalModals />
              </main>
              <Footer />
            </div>
          </ModalProvider>
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
