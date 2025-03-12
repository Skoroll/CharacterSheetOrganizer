import { useEffect, useState } from "react";

import Landing from "../Landing/Landing";
import Menu from "../Menu/Menu";
import PreviousGame from "../../components/PreviousGame/PreviousGame";
import { useUser } from "../../Context/UserContext";
import { BeatLoader } from "react-spinners";
import "./Home.scss";

type Table = {
  _id: string;
  name: string;
  players?: { playerId: string }[];
  bannerImage?: string;
  gameMasterName: string;
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

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
              if (res.status === 404) return null; // Table supprimée
              if (res.status === 401 || res.status === 403) return null; // Accès refusé
              throw new Error(`Erreur pour la table ${id}`);
            }

            return await res.json();
          } catch (error) {
            return null;
          }
        });

        const tableData = await Promise.all(tableRequests);
        setTables(tableData.filter((table): table is Table => table !== null));
      } catch (err) {
        setError("Impossible de récupérer les tables.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTables();
  }, [API_URL, user]);

  if (isAuthenticated === null) {
    return (
      <div className="loader">
        <BeatLoader />
      </div>
    );
  }

  return (
    <div className="home">
      {isAuthenticated ? (
        <>
          <Menu />
          <div className="home-wrapper">
            <div className="home__tables-options">
              <div className="home-wrapper__container">
                <div className="home__tables-options--div">
                  <PreviousGame tables={tables} loading={loading} error={error} API_URL={API_URL} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Landing />
      )}
    </div>
  );
}
