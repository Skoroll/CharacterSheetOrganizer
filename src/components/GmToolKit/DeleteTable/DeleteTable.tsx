import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../Modal/Modal";
import "./DeleteTable.scss";

interface DeleteTableProps {
  tableId: string;
  API_URL: string;
  onTableDeleted: () => void; // ✅ Callback pour mettre à jour l'UI après suppression
  closeModal: () => void; // ✅ Fonction pour fermer la modale
}

const DeleteTable: React.FC<DeleteTableProps> = ({ tableId, API_URL, onTableDeleted, closeModal }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
const navigate = useNavigate();
  // ✅ Fonction pour supprimer la table
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette table ?");
    if (!confirmDelete) return;
  
    setIsDeleting(true);
    setError(null);
  
    try {
      // 🔥 Récupère le token stocké dans localStorage
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("Aucun token d'authentification trouvé. Veuillez vous reconnecter.");
      }
  
      const response = await fetch(`${API_URL}/api/tabletop/tables/${tableId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Ajout du token
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression de la table.");
      }
  
      onTableDeleted(); // ✅ Met à jour l'UI après suppression
    } catch (err) {
      console.error("❌ Erreur lors de la suppression :", err);
      setError(err instanceof Error ? err.message : "Impossible de supprimer la table.");
    } finally {
      setIsDeleting(false);
        navigate("/")
    }
  };
  

  return (
    <Modal title="Supprimer la table" onClose={closeModal}>
      <p>Êtes-vous sûr de vouloir supprimer cette table ? Cette action est irréversible.</p>

      {error && <p className="error">{error}</p>}

      <div className="modal-actions">
        <button onClick={handleDelete} disabled={isDeleting} className="confirm-btn">
          {isDeleting ? "Suppression..." : `Oui, supprimer`}
        </button>
        <button onClick={closeModal} className="cancel-btn">Annuler</button>
      </div>
    </Modal>
  );
};

export default DeleteTable;
