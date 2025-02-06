import { useEffect, useState } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import NextSession from "../../components/NextSession/NextSession";
import TableTopBrowse from "../../components/ModalContent/ModalTabletop/TableTopBrowse/TableTopBrowse";
import TabletopCreation from "../../components/ModalContent/ModalTabletop/TabletopCreation/TabletopCreation";
import Menu from "../Menu/Menu";
import "./Home.scss";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="home">
      {isAuthenticated ? (
        <>
          <Menu />
          <div className="home-wrapper">
            <NextSession />
            <div className="home__tables-options">
              <h2>Les Tables de jeux </h2>

              <div className="home__tables-options--div">
                <div className="table-top-browse-div">
                  <TableTopBrowse />
                </div>
                <div className="table-creation-div">
                  <TabletopCreation />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}
