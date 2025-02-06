import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "../../components/Chat/Chat";
import DiceRoller from "../../components/DiceRoller/DiceRoller";
import "./Tabletop.scss";

interface Table {
  _id: string;
  name: string;
  gameMaster: string;
  gameMasterName: string;
  gameMasterNotes: {
    characters: string;
    quest: string;
    other: string;
    items: string;
  };
}

export default function TableComponent() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const [isSideOpen, setIsSideOpen] = useState(false);

  const [notes, setNotes] = useState({
    characters: "",
    quest: "",
    other: "",
    items: "",
  });

  const [isGameMaster, setIsGameMaster] = useState(false); // Pour savoir si l'utilisateur est MJ

  useEffect(() => {
    if (!id) return;

    async function fetchTable() {
      try {
        const response = await fetch(`${API_URL}/api/tabletop/tables/${id}`);

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la table.");
        }
        const data = await response.json();
        console.log("Table récupérée :", data); // 👈 Vérification des données récupérées

        setTable(data);

        // Récupère l'ID de l'utilisateur depuis le localStorage
        const user = JSON.parse(localStorage.getItem("user") || '{}'); // Parse l'objet JSON
        const userId = user?.id; // Accède à l'ID de l'utilisateur
                console.log("ID utilisateur récupéré du localStorage : ", userId); // 👈 Afficher l'ID utilisateur

        if (data.gameMaster === userId) {
          console.log("L'utilisateur est le Maître du Jeu !");
          setIsGameMaster(true); // Si l'utilisateur est MJ, on l'indique
        } else {
          console.log("L'utilisateur n'est pas le Maître du Jeu");
        }

        // Initialiser les notes si elles existent déjà
        setNotes(data.gameMasterNotes || {
          characters: "",
          quest: "",
          other: "",
          items: "",
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue.");
      } finally {
        setLoading(false);
      }
    }

    fetchTable();
  }, [id, API_URL]); // Ajout de API_URL dans les dépendances

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes({ ...notes, [e.target.name]: e.target.value });
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tabletop/tables/${id}/notes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notes),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour des notes");

      const data = await response.json();
      console.log("Notes mises à jour :", data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  // Vérification de la valeur de isGameMaster
  console.log("L'utilisateur est-il MJ ? ", isGameMaster);

  return (
    <div className="table">
      <div className="table__header">
        <h2>{table?.name}</h2>
        <p>Maître du Jeu : {table?.gameMasterName}</p>
      </div>

      {isGameMaster && (
        <div className="table__notes-pannel-GM">
          <div className="table__notes-pannel--inside">
            <p><i className="fa-solid fa-pen"></i></p>
            {isSideOpen && (
              <ul>
                <li>Personnages</li>
                <li>Quêtes</li>
                <li>Divers</li>
                <div className="notes-section">
                  <h3>Notes du MJ</h3>
                  <label>Personnages</label>
                  <textarea
                    name="characters"
                    value={notes.characters}
                    onChange={handleNotesChange}
                  ></textarea>

                  <label>Quêtes</label>
                  <textarea
                    name="quest"
                    value={notes.quest}
                    onChange={handleNotesChange}
                  ></textarea>

                  <label>Objets</label>
                  <textarea
                    name="items"
                    value={notes.items}
                    onChange={handleNotesChange}
                  ></textarea>

                  <label>Autres</label>
                  <textarea
                    name="other"
                    value={notes.other}
                    onChange={handleNotesChange}
                  ></textarea>

                  <button onClick={handleSaveNotes}>Sauvegarder</button>
                </div>
              </ul>
            )}
          </div>

          <div className="table__notes-pannel--slide-btn">
            <i
              onClick={() => setIsSideOpen((prev) => !prev)}
              className={`fa-solid ${isSideOpen ? "fa-chevron-left" : "fa-chevron-right"}`}
            ></i>
          </div>
        </div>
      )}

      <div className="table__main-container">
        <DiceRoller />
      </div>
      <div>
        <Chat />
      </div>
    </div>
  );
}
