import { useState } from "react";
import { useUser } from "../../Context/UserContext";
import CreateSheetAria from "./SheetByGame/CreateSheetAria";
import CreateSheetVtm from "./SheetByGame/CreateSheetVtm";
import ChooseBannerFrame from "../Premium/ChooseBannerFrame/ChooseBannerFrame";

export default function CreateSheet() {
  const [selectedGame, setSelectedGame] = useState("");

  // Imaginons que tu récupères ça de ton contexte utilisateur ou ailleurs :
  const { user } = useUser(); 

  return (
    <div className="create-sheet-container">
      <h2>Création de personnage</h2>
      <div className="create-sheet-container__options">
        <div className="game-selector">
          <label>
            Choisir un jeu :
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
            >
              <option value="">-- Sélectionnez un jeu --</option>
              <option value="Aria">Aria</option>
              {/*<option value="VTM">Vampire: The Massquerade</option>*/}
            </select>
          </label>
        </div>

        {user?.isPremium === true && <ChooseBannerFrame />}

      </div>

      {selectedGame === "Aria" && <CreateSheetAria game="Aria" />}
      {selectedGame === "VTM" && <CreateSheetVtm />}
    </div>
  );
}

