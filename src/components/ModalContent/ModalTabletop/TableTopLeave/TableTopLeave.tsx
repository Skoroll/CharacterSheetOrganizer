import PlaceHolderTableImg from "../../../../assets/dice-solid.svg";
import { BeatLoader } from "react-spinners";
import defaultTableImg from "../../../../assets/dice-solid.svg";
import { Table } from "../../../../types/Table";

interface TableTopLeaveProps {
  tables?: Table[];
  loading?: boolean;
  error?: string | null;
  API_URL?: string;
  onLeave: (tableId: string) => void;
}

export default function TableTopLeave({
  tables = [],
  loading,
  error,
  API_URL,
  onLeave,
}: TableTopLeaveProps) {


  return (
    <div className="leave-tables">
      {error && <p className="error">Erreur : {error}</p>}
      {loading && <BeatLoader />}

      {tables.length === 0 && !loading && !error && (
        <p>Vous n'avez rejoint aucune table.</p>
      )}

      {tables.length > 0 && !loading && (
        <>
          <p>Quitter une table :</p>
          <ul>
            {tables.map((table) => (
              <li className="leave-tables--item" key={table._id}>
                <div className="table__banner">
                  {table.bannerImage ? (
                    <img
                      style={{
                        backgroundImage: table.bannerImage ? `url(${table.bannerImage})` : "none",
                        border: table.bannerImage ? `${table.borderWidth} solid ${table.borderColor}` : "none",
                        borderRadius: table.bannerStyle === "rounded" ? "20px" : "0px",
                        boxShadow:
                          table.bannerStyle === "shadow"
                            ? "5px 5px 10px rgba(0,0,0,0.3)"
                            : "none",
                        transition: "height 0.3s ease-in-out",
                      }}
                      src={
                        table.bannerImage?.startsWith("http")
                          ? table.bannerImage
                          : `${API_URL}${table.bannerImage}`
                      }
                      alt={`Bannière de ${table.name}`}
                      onError={(e) => {
                        e.currentTarget.src = defaultTableImg;
                      }}
                    />
                  ) : (
                    <img src={PlaceHolderTableImg} alt={`${table.name}`} />
                  )}
                </div>

                <div className="table__recap">
                  <p>
                    <span className={`table__recap--name font-${table?.selectedFont || ""}`}>{table.name}</span>
                    <span>MJ : {table.gameMasterName}</span>
                    <span>
                      <i className="fa-regular fa-user"></i> {table.players?.length || 0}
                    </span>
                    <span>Jeu : {table.game}</span>
                  </p>
                  <button
                    className="leave-btn"
                    onClick={() => onLeave(table._id)}
                  >
                    Quitter la table
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
