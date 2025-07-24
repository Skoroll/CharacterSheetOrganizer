import { useEffect, useState } from "react";
import Landing from "../Landing/Landing";
import Menu from "../Menu/Menu";
import NewsPanel from "../../components/NewsPanel/NewsPanel";
import OnLoadingOverlay from "../../components/OnLoadingOverlay/OnLoadingOverlay";
import PremiumBanner from "../../assets/095c36e7-22d7-4101-a31e-a0edc28291d5.png";
import PreviousGame from "../../components/PreviousGame/PreviousGame";
import Welcome from "../../components/Welcome/Welcome";
import { useUser } from "../../Context/UserContext";
import { Table } from "../../types/Table";
import { BeatLoader } from "react-spinners";
import "./Home.scss";

export default function Home() {
  const { user, isLoggingOut } = useUser();
  const [transitioning, setTransitioning] = useState(true);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // scroll to top
  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 100);
  }, []);

  // Transition douce après login
  useEffect(() => {
    if (user.isAuthenticated) {
      const delay = setTimeout(() => setTransitioning(false), 1500);
      return () => clearTimeout(delay);
    }
  }, [user.isAuthenticated]);

  // Fetch des tables
  useEffect(() => {
    if (!user.isAuthenticated) return;

    const fetchUserTables = async () => {
      try {
        const response = await fetch(`${API_URL}/api/users/profile`, {
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

        const validTables: Table[] = [];

        for (const id of tableIds) {
          try {
            const res = await fetch(`${API_URL}/api/tabletop/tables/${id}`);
            if (res.status === 404) {
              await fetch(`${API_URL}/api/users/removeTable/${id}`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
              });
              continue;
            }
            if (!res.ok) throw new Error(`Erreur pour la table ${id}`);
            const tableData = await res.json();
            validTables.push(tableData);
          } catch (err) {
            console.warn(`❌ Impossible de charger la table ${id} :`, err);
          }
        }

        setTables(validTables);
      } catch {
        setError("Impossible de récupérer les tables.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTables();
  }, [API_URL, user]);

  // Loader pendant la déconnexion
  if (isLoggingOut) {
    return <OnLoadingOverlay message="Déconnexion..." />;
  }

  // Pas encore connecté/déconnecté → écran de chargement simple
  if (user.isAuthenticated === undefined || user.isAuthenticated === null) {
    return (
      <div className="loader">
        <BeatLoader />
      </div>
    );
  }

  return (
    <div className="home">
      {user.isAuthenticated ? (
        <>
          {(loading || transitioning) && <OnLoadingOverlay message="Chargement..." />}
          <Menu />
          <div className="home-wrapper">
            <div className="home__tables-options">
              <div className="home-wrapper__container">
                <Welcome />
                <div className="box">
                  <div className="home__tables-options--div">
                    <PreviousGame
                      tables={tables}
                      loading={loading}
                      error={error}
                      API_URL={API_URL}
                    />
                  </div>
                  <div className="premium-box">
                    Passez premium !
                    <img src={PremiumBanner} alt="premium-box" />
                    <p>
                      3€ par mois
                      <br />
                      <i>Sans engagement</i>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <NewsPanel />
          </div>
        </>
      ) : (
        <Landing />
      )}
    </div>
  );
}
