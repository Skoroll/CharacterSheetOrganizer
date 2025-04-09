import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableTopLeave from "../../ModalContent/ModalTabletop/TableTopLeave/TableTopLeave";
import Modal from "../../Modal/Modal";

export default function NewGame() {
  const navigate = useNavigate();
  const [showLeaveModal, setShowLeaveModal] = useState(false); // 👈 gestion modale

  const menuOptions = [
    {
      name: "Créer une partie",
      goTo: "/creer-partie",
      action: () => navigate("/creer-partie"),
    },
    {
      name: "Rejoindre une partie",
      goTo: "/rejoindre",
      action: () => navigate("/rejoindre"),
    },
    {
      name: "Quitter une table", // 👈 nouveau bouton
      goTo: null,
      action: () => setShowLeaveModal(true),
    },
  ];

  // ➕ callback fictif (remplace le joueur dans la table)
  const handleLeaveTable = (tableId: string) => {
    console.log("🔁 Table quittée :", tableId);
    // 👉 fais un fetch DELETE ou PATCH ici si besoin
  };

  return (
    <div className="new-game">
      <ul>
        {menuOptions.map(({ name, action }, index) => (
          <li key={index} onClick={action}>
            {name}
          </li>
        ))}
      </ul>

      {/* ✅ Affiche modale si showLeaveModal est true */}
      {showLeaveModal && (
        <Modal onClose={() => setShowLeaveModal(false)} title="Quitter une table">
          <TableTopLeave
            tables={[]} // 👉 injecte tes tables ici
            loading={false}
            API_URL={import.meta.env.VITE_API_URL}
            error={null}
            onLeave={handleLeaveTable}
          />
        </Modal>
      )}
    </div>
  );
}