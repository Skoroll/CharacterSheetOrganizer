import { useState, useEffect } from "react";
import { useUser } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Welcome.scss";
import { BeatLoader } from "react-spinners";

type Table = {
  _id: string;
  name: string;
  players?: { playerId: string }[];
};

const Welcome = () => {
  const { user } = useUser() ;
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user.isAuthenticated) return;
  
    const fetchUserTables = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
  
        if (!response.ok) throw new Error("Erreur lors de la récupération du profil.");
  
        const userData = await response.json();
  
        const tableIds: string[] = userData.user.tablesJoined || [];
        if (tableIds.length === 0) {
          setTables([]);
          setLoading(false);
          return;
        }
  
        const tableRequests = tableIds.map(async (id: string) => {
          try {
            const res = await fetch(`${API_URL}/api/tabletop/tables/${id}`);
  
            if (!res.ok) {
              if (res.status === 404) {
                console.warn(`⚠️ Table ${id} supprimée, suppression de la liste.`);
                return null; // ⚠️ Ne garde pas les tables supprimées
              }
              if (res.status === 401 || res.status === 403) {
                console.warn(`🚫 Accès refusé à la table ${id}, suppression de la liste.`);
                return null; // ⚠️ Ne garde pas les tables où le joueur est banni
              }
              throw new Error(`Erreur pour la table ${id}`);
            }
  
            return await res.json();
          } catch (error) {
            if (error instanceof Error && error.message.includes("404")) {
              return null; // 🔥 Ignore silencieusement les erreurs 404
            }
            console.error(`❌ Impossible de récupérer la table ${id}`, error);
            return null;
          }
        });
  
        const tableData = await Promise.all(tableRequests);
        const filteredTables = tableData.filter((table): table is Table => table !== null);
  
        setTables(filteredTables);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des tables :", err);
        setError("Impossible de récupérer les tables.");
      } finally {
        console.clear(); // 🔥 Nettoie la console pour éviter les spams d'erreurs
        setLoading(false);
      }
    };
  
    fetchUserTables();
  }, [API_URL, user]);
  
  

  if (!user.isAuthenticated) {
    return <div>Vous devez vous connecter pour accéder à cette page.</div>;
  }

  return (
    <div className="welcome">
      <h2>Bienvenue, {user.userPseudo}!</h2>
      {tables.length > 0 && <p>Retourner sur une table :</p>}

      {loading && <p><BeatLoader/></p>}
      {error && <p className="error">{error}</p>}
      {!loading && tables.length > 0 && (
        <ul>
          {tables.map((table) => (
            <li 
              key={table._id}
              onClick={() => navigate(`/table/${table._id}`)}
            >
              <i className="fa-solid fa-chevron-right"/>
              <div className="table__recap">
                <p>
                  <i className="fa-solid fa-dice"/>
                  <span>{table.name}</span>
                </p>
                <p>
                  <i className="fa-regular fa-user"></i>{" "}
                  {table.players?.length || 0}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Welcome;
