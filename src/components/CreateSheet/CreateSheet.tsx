import { useState } from "react";
import CreateSheetAria from "./SheetByGame/CreateSheetAria";

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
            {/* Tu pourras ajouter d'autres options ici */}
          </select>
        </label>
      </div>

      {selectedGame === "Aria" && <CreateSheetAria game="Aria" />}

      {/* Plus tard : selectedGame === "Dragon" && <CreateSheetDragon /> */}
    </div>
  );
}
