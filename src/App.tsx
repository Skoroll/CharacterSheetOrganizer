import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components"; // Importer ThemeProvider
import useStyleStore from "./utils/useStyleStore"; // Importer ton store Zustand
import CharacterDetails from "./pages/CharacterDetails/CharacterDetails";
import CreateSheet from "./components/CreateSheet/CreateSheet";
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from "./pages/Home/Home";
import Tabletop from "./pages/Tabletop/Tabletop";
import './App.scss';

import Settings from "./components/ModalContent/Account/Settings";
import GlobalStyle from './style/GlobalStyle'; // Importer les styles globaux

function App() {
  // Récupérer le thème depuis le store
  const theme = useStyleStore(state => state.theme);

  return (
    <>
      {/* Envelopper ton application avec ThemeProvider pour appliquer le thème */}
      <ThemeProvider theme={theme}>
        {/* Appliquer les styles globaux */}
        <GlobalStyle />
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/creation-de-personnage" element={<CreateSheet />} />
              <Route path="/personnage/:id" element={<CharacterDetails />} />
              <Route path="/table/:id" element={<Tabletop />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
