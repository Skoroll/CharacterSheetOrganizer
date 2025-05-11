import { useState } from "react";
import { useUser } from "../../Context/UserContext";
import CreateSheetAria from "./SheetByGame/CreateSheetAria";
import CreateSheetVtm from "./SheetByGame/CreateSheetVtm";
import ChooseBannerFrame from "../Premium/ChooseBannerFrame/ChooseBannerFrame";

export default function CreateSheet() {
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedFrame, setSelectedFrame] = useState<string>(""); 

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
              {/* <option value="VTM">Vampire: The Masquerade</option> */}
            </select>
          </label>
        </div>

        {user?.isPremium === true && (
          <ChooseBannerFrame
            selectedFrame={selectedFrame}
            setSelectedFrame={setSelectedFrame}
          />
        )}
      </div>

      {selectedGame === "Aria" && <CreateSheetAria game="Aria" />}
      {selectedGame === "VTM" && <CreateSheetVtm />}
    </div>
  );
}
