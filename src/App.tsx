import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateSheet from "./components/CreateSheet/CreateSheet";
import CharacterDetails from "./pages/CharacterDetails/CharacterDetails";
import Header from './components/Header/Header'
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Footer from './components/Footer/Footer'
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
        </Routes>
          </main>
        <Footer />
    </BrowserRouter>
    </>
  )
}

export default App
