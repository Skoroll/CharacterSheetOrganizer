import { useState } from "react";
import CreateSheetAria from "./SheetByGame/CreateSheetAria";
import CreateSheetVtm from "./SheetByGame/CreateSheetVtm";

export default function CreateSheet() {
  const [selectedGame, setSelectedGame] = useState("");

  return (
    <div className="create-sheet-container">
      <h2>Création de personnage</h2>
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

      {selectedGame === "Aria" && <CreateSheetAria game="Aria" />}
      {selectedGame === "VTM" && <CreateSheetVtm/>}
    </div>
  );
}
