import { useState } from 'react';

// Liste des types de dés
const diceTypes = {
  d2: 2,
  d4: 4,
  d6: 6,
  d8: 8,
  d12: 12,
  d20: 20,
  d100: 100,
};

function DiceRoller() {
  const [diceType, setDiceType] = useState('d6');  // Valeur initiale du type de dé (par exemple d6)
  const [numDice, setNumDice] = useState(1); // Valeur initiale du nombre de dés
  const [results, setResults] = useState<number[]>([]);  // Typage explicite pour results
  const [total, setTotal] = useState(0);

  // Fonction pour générer un jet de dés
  const rollDice = () => {
    const sides = diceTypes[diceType as keyof typeof diceTypes];  // Ajout de l'assertion de type
    const rolls = [];
    let totalResult = 0;

    // Générer les résultats pour chaque dé
    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;  // Lancer le dé
      rolls.push(roll);
      totalResult += roll;
    }

    setResults(rolls);  // Mettre à jour les résultats des dés
    setTotal(totalResult);  // Mettre à jour le total du jet
  };

  return (
    <div className="dice-roller">
      <h2>Générateur de jet de dés</h2>

      <div>
        <label htmlFor="diceType">Choisissez le type de dé : </label>
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
        <label htmlFor="numDice">Nombre de dés à lancer : </label>
        <input
          type="number"
          id="numDice"
          min="1"
          max="6"
          value={numDice}
          onChange={(e) => setNumDice(Number(e.target.value))}
        />
      </div>

      <button onClick={rollDice}>Lancer les dés</button>

      {results.length > 0 && (
        <div>
           <p>Résultats : {total} {numDice > 1 ? `(${results.join(', ')})` : ""}</p>
          <p>Total du jet :</p>
        </div>
      )}
    </div>
  );
}

export default DiceRoller;
