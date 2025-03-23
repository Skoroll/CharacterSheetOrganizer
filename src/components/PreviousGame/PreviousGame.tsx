import { useNavigate } from "react-router-dom";
import PlaceHolderTableImg from "../../assets/dice-solid.svg";
import { BeatLoader } from "react-spinners"; // Si tu veux l'utiliser
import defaultTableImg from "../../assets/dice-solid.svg";

type Table = {
  _id: string;
  name: string;
  players?: { playerId: string }[];
  bannerImage?: string;
  gameMasterName: string;
};

type PreviousGameProps = {
  tables?: Table[];
  loading?: boolean;
  error?: string | null;
  API_URL?: string;
};

export default function PreviousGame({
  tables = [],
  loading,
  error,
  API_URL,
}: PreviousGameProps) {
  const navigate = useNavigate();

  return (
    <div className="prev-tables">
      {error && <p className="error">Erreur : {error}</p>}
      {loading && <BeatLoader />} {/* Ajout d'un loader */}
      {/* Si l'utilisateur n'a jamais rejoint de table : */}
      {tables.length === 0 && !loading && !error && (
        <div className="prev-tables__no-game">
          <div className="prev-tables__no-game--join">
            <p>Vous pouvez rejoindre une partie ici</p>
            <button onClick={() => navigate("/rejoindre")}>
              Rejoindre une partie
            </button>
          </div>
          <div className="prev-tables__no-game--create">
            <p>ou, vous pouvez en créer une ici :</p>
            <button onClick={() => navigate("/creer-partie")}>
              Créer une partie
            </button>
          </div>
        </div>
      )}
      {/* Si l'utilisateur a déjà rejoint une table : */}
      {tables.length > 0 && !loading && (
        <>
          <p>Retourner sur une table :</p>
          <ul>
            {tables.map((table) => (
              <li
                key={table._id}
                onClick={() => navigate(`/table/${table._id}`)}
              >
                {table.bannerImage ? (
                  <img
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
                <div className="table__recap">
                  <p>{table.name}</p>
                  <span>MJ : {table.gameMasterName}</span>
                  <p>
                    <i className="fa-regular fa-user"></i>{" "}
                    {table.players?.length || 0}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
