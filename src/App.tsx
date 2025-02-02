import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharacterDetails from "./pages/CharacterDetails/CharacterDetails";
import CreateSheet from "./components/CreateSheet/CreateSheet";
import Footer from './components/Footer/Footer'
import Header from './components/Header/Header'
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Tabletop from "./pages/Tabletop/Tabletop";
import './App.scss'

function App() {


  return (
    <>
    <BrowserRouter>
        <Header/>
          <main>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu/>} />
          <Route path="/creation-de-personnage" element={<CreateSheet/>} />
          <Route path="/personnage/:id" element={<CharacterDetails />}/>
          <Route path="/table/:id" element={<Tabletop/>}/>
        </Routes>
          </main>
        <Footer />
    </BrowserRouter>
    </>
  )
}

export default App
