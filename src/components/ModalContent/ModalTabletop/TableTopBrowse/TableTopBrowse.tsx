import { useState, useEffect } from "react";
import "./TableTopBrowse.scss";

export default function TableTopBrowse() {
  const [tables, setTables] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tabletop/getTables`);
        const data = await response.json();

        if (response.ok) {
          setTables(data.tables);
        } else {
          throw new Error(
            data.message || "Erreur lors de la récupération des tables"
          );
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Une erreur inconnue est survenue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  return (
    <div className="tabletop-browse">
      {loading && <p>Chargement des tables ...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && tables.length === 0 && <p>Aucune table</p>}

      {!loading && !error && tables.length > 0 && (
        <ul>
          {tables.map((table) => (
            <li key={table.id}>
              <div className="is-online" />
              <p>{table.name}</p>

              <div className="tabletop-browse__btn">
                <button>
                  <i className="fa-solid fa-trash" />
                </button>

                <button
                  className="tabletop-browse--join"
                  onClick={() => alert(`Rejoindre la table ${table.name}`)}
                >
                  <i className="fa-solid fa-right-to-bracket" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
