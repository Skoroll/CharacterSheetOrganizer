import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { useState } from "react";
import PlaceHolderTableImg from "../../assets/dice-solid.svg";
import { BeatLoader } from "react-spinners";
import defaultTableImg from "../../assets/dice-solid.svg";
import Modal from "../Modal/Modal";
import {Table} from "../../types/Table"
import SelectNextCharacter from "../SelectNextCharacter/SelectNextCharacter";



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
  const { user } = useUser();
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

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
                className="prev-tables--item"
                key={table._id}
                onClick={async () => {
                  const userId = user._id;
                  try {
                    const response = await fetch(
                      `${API_URL}/api/tabletop/tables/${table._id}/players`
                    );
                    if (!response.ok)
                      throw new Error(
                        "Erreur lors de la vérification du joueur"
                      );

                    const players = await response.json();
                    const currentPlayer = players.find(
                      (p: any) => p.userId === userId
                    );

                    if (currentPlayer?.selectedCharacter) {
                      navigate(`/table/${table._id}`);
                    } else {
                      setSelectedTable(table);
                      setIsJoinModalOpen(true);
                    }
                  } catch (error) {
                    console.error(
                      "❌ Erreur lors de la vérification du personnage :",
                      error
                    );
                  }
                }}
              >
                 <p className={`table__recap--name font-${table?.selectedFont || ""}`}>{table.name}</p>
                 <div className="divide">
                {table.bannerImage ? (
                  <img
                  style={{
                    backgroundImage: table.bannerImage ? `url(${table.bannerImage})` : "none",
                    border: table.bannerImage ? `${table.borderWidth} solid ${table.borderColor}` : "none",
                    borderRadius: table.bannerStyle === "rounded" ? "20px" : "0px",
                    boxShadow: table.bannerStyle === "shadow" ? "5px 5px 10px rgba(0,0,0,0.3)" : "none",

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
                <div className="table__recap">
                  <p>
                    <span>MJ : {table.gameMasterName}</span>

                    <span>
                      <i className="fa-regular fa-user"></i>{" "} {table.players?.length || 0}
                    </span>
                    <span>Jeu : {table.game}</span>
                  </p>
                </div>
                  </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {isJoinModalOpen && selectedTable && (
        <Modal
          title="Sélectionnez votre personnage"
          onClose={() => setIsJoinModalOpen(false)}
        >
          <SelectNextCharacter
            tableId={selectedTable._id}
            gameMasterId={selectedTable.gameMaster}
            onClose={() => setIsJoinModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
