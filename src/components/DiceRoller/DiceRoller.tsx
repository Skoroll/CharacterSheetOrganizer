import { useState } from "react";
import "./DiceRoller.scss";

// Liste des types de dés
const diceTypes = {
  d2: 2,
  d3: 3,
  d4: 4,
  d6: 6,
  d8: 8,
  d12: 12,
  d20: 20,
  d100: 100,
};

interface DiceRollerProps {
  tableId: string;
  userCharacterName: string;
  userPseudo: string;
  socket: any;
}

function DiceRoller({ tableId, userCharacterName, userPseudo, socket }: DiceRollerProps) {
  const [diceType, setDiceType] = useState("d6"); // Valeur initiale du type de dé
  const [numDice, setNumDice] = useState(1); // Nombre de dés

  const rollDice = () => {
    const sides = diceTypes[diceType as keyof typeof diceTypes];
    const rolls: number[] = [];
    let totalResult = 0;
  
    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      rolls.push(roll);
      totalResult += roll;
    }
  
    {/*Message a afficher*/}
    const messageContent = `${numDice} x ${diceType} : ${rolls.join(", ")} (Total : ${totalResult})`;
    const newMessage = {
      message: messageContent,
      characterName: userCharacterName,
      senderName: userPseudo,
      tableId: tableId,
      messageType: "diceRoll",
    };
  
    if (socket) {
      socket.emit("newMessage", newMessage);
    } else {
      console.error("L'instance socket est undefined.");
    }
  };
  

  return (
    <div className="dice-roller">
              <button 
                onClick={rollDice}
                aria-label="Jet de dès"
              >
                  <i className="fa-solid fa-dice"/></button>
      <div className="roller-panel">
        <div>
          <label htmlFor="diceType">Type de dé :</label>
          <select
            id="diceType"
            value={diceType}
            onChange={(e) => setDiceType(e.target.value)}
          >
            {Object.keys(diceTypes).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="numDice">Nombre de dés :</label>
          <input
            type="number"
            id="numDice"
            min="1"
            max="6"
            value={numDice}
            onChange={(e) => setNumDice(Number(e.target.value))}
          />
        </div>


      </div>
    </div>
  );
}

export default DiceRoller;
