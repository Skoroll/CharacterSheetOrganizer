import { useState } from "react";
import CreateQuestTab from "./CreateQuestTab";
import "./QuestLibrary.scss";

type QuestType =
  | "Combat"
  | "Enquête"
  | "Exploration"
  | "Transport"
  | "Protection"
  | "Collecte"
  | "Espionnage"
  | "Vol"
  | "Meurtre"
  | "Autre";

export default function QuestLibrary() {
  const [activeTab, setActiveTab] = useState<"my" | "create" | "community">(
    "my"
  );
  const [newQuestType, setNewQuestType] = useState<QuestType>("Combat");
  const [filters, setFilters] = useState({
    game: "",
    type: "",
    creator: "",
    search: "",
  });

  return (
    <div className="gm-tool quest-library">
      {/* Onglets principaux */}
      <div className="quest-library__tabs">
        <button
          className={activeTab === "my" ? "active" : ""}
          onClick={() => setActiveTab("my")}
        >
          Mes quêtes
        </button>
        <button
          className={activeTab === "create" ? "active" : ""}
          onClick={() => setActiveTab("create")}
        >
          <i className="fa-solid fa-plus"/>
          Créer quête
        </button>
        <button
          className={activeTab === "community" ? "active" : ""}
          onClick={() => setActiveTab("community")}
        >
          Bibliothèque communautaire
        </button>
      </div>

      {/* Contenu de l’onglet Mes quêtes */}
      {activeTab === "my" && (
        <div className="quest-library__my">
          <div className="quest-library__filters">
            <select
              value={filters.game}
              onChange={(e) => setFilters({ ...filters, game: e.target.value })}
            >
              <option value="">Tous les jeux</option>
              <option value="Aria">Aria</option>
              <option value="VTM">Vampire: The Masquerade</option>
            </select>

            <select
              name="questType"
              value={newQuestType}
              onChange={(e) => setNewQuestType(e.target.value as QuestType)}
              required
            >
              <option value="">Tous types</option>
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
            <input
              type="text"
              placeholder="Rechercher une quête..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          <div className="quest-library__list">
            {/* Placeholder pour les quêtes filtrées */}
            <p>Aucune quête trouvée (fonctionnalité à implémenter)</p>
          </div>
        </div>
      )}

      {/* Contenu de l’onglet Créer quête */}
      {activeTab === "create" && (
<CreateQuestTab/>
      )}

      {/* Contenu de l’onglet Bibliothèque communautaire */}
      {activeTab === "community" && (
        <div className="quest-library__community">
          <p>Bibliothèque communautaire (bientôt disponible)</p>
          {/* Placeholder avec bouton d'import */}
          <button>
            <i className="fa-solid fa-download" /> Importer cette quête
          </button>
        </div>
      )}
    </div>
  );
}
