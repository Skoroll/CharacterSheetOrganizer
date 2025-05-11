import { useState } from "react";
import { useUser } from "../../Context/UserContext";
import CreateSheetAria from "./SheetByGame/CreateSheetAria";
import CreateSheetVtm from "./SheetByGame/CreateSheetVtm";

export default function CreateSheet() {
  const [selectedGame, setSelectedGame] = useState("");

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
      </div>

      {selectedGame === "Aria" && user && <CreateSheetAria game="Aria" user={user} />}
      {selectedGame === "VTM" && <CreateSheetVtm />}
    </div>
  );
}
