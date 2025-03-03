import { useEffect, useState } from "react";

import AuthForm from "../../components/AuthForm/AuthForm";
import TableTopBrowse from "../../components/ModalContent/ModalTabletop/TableTopBrowse/TableTopBrowse";
import TabletopCreation from "../../components/ModalContent/ModalTabletop/TabletopCreation/TabletopCreation";
import Welcome from "../../components/Welcome/Welcome";
import Menu from "../Menu/Menu";
import News from "../../components/Articles/News"
import { BeatLoader } from "react-spinners";
import "./Home.scss";
import "../../components/Articles/Articles.scss"

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
    return <div><BeatLoader/></div>;
  }

  return (
    <div className="home">
      {isAuthenticated ? (
        <>
          <Menu />
          <div className="home-wrapper">
            <Welcome/>
            {/*{user.isAdmin && <p>Admin</p>}*/}
            <div className="home__tables-options">
              <div className="home-wrapper__container">
                <News/>

              <div className="home__tables-options--div">
              <h2>Les Tables de jeux </h2>
              <div className="tables-choices">
                <div className="table-top-browse-div">
                  <TableTopBrowse />
                </div>
                <div className="table-creation-div">
                  <TabletopCreation />
                </div>
                </div>
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
