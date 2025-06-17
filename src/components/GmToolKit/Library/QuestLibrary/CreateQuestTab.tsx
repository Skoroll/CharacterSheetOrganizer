import { useState } from "react";
import QuestBranchBuilder from "./QuestBranchBuilder";

interface Choice {
  id: string;
  text: string;
  subChoices?: Choice[];
}

export default function CreateQuestTab() {
  const [questName, setQuestName] = useState("");
  const [questType, setQuestType] = useState("Combat");
  const [questDetails, setQuestDetails] = useState("");
  const [rewards, setRewards] = useState("");
  const [branches, setBranches] = useState<Choice[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuest = { questName, questType, questDetails, rewards, branches };
    console.log("Création de la quête :", newQuest);
  };

  return (
    <form className="quest-library__form" onSubmit={handleSubmit}>
      <label>
        Nom de la quête :
        <input
          type="text"
          value={questName}
          onChange={(e) => setQuestName(e.target.value)}
          required
        />
      </label>

      <label>
        Type :
        <select
          value={questType}
          onChange={(e) => setQuestType(e.target.value)}
          required
        >
          <option value="">--Choisir un type--</option>
          <option value="Combat">Combat</option>
          <option value="Enquête">Enquête</option>
          <option value="Exploration">Exploration</option>
          <option value="Transport">Transport</option>
          <option value="Protection">Protection</option>
          <option value="Collecte">Collecte</option>
          <option value="Espionnage">Espionnage</option>
          <option value="Vol">Vol</option>
          <option value="Meurtre">Meurtre</option>
          <option value="Autre">Autre</option>
        </select>
      </label>

      <label>
        Détails :
        <textarea
          value={questDetails}
          onChange={(e) => setQuestDetails(e.target.value)}
          rows={4}
          required
        />
      </label>

      <QuestBranchBuilder branches={branches} setBranches={setBranches} />

      <label>
        Récompenses :
        <input
          type="text"
          value={rewards}
          onChange={(e) => setRewards(e.target.value)}
        />
      </label>

      <button type="submit">
        <i className="fa-solid fa-plus" /> Ajouter la quête
      </button>
    </form>
  );
}
