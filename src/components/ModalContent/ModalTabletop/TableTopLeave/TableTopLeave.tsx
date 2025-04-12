import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Table } from "../../../../types/Table";
import Modal from "../../../Modal/Modal";
import "./TableTopLeave.scss"

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
  onLeave,
}: TableTopLeaveProps) {
  const [tableToLeave, setTableToLeave] = useState<Table | null>(null);
  return (
    <div className="leave-tables">
      {error && <p className="error">Erreur : {error}</p>}
      {loading && <BeatLoader />}

      {tables.length === 0 && !loading && !error && (
        <p>Vous n'avez rejoint aucune table.</p>
      )}

      {tables.length > 0 && !loading && (
        <>
          <ul>
          {tables.map((table) => (
  <li key={table._id} className="leave-tables--item">
    <p>{table.name}</p>
    {/* ... Image et infos de la table comme tu le fais déjà */}
    <button onClick={() => setTableToLeave(table)}>Quitter la table</button>
  </li>
))}

{tableToLeave && (
  <Modal
    title="Confirmation"
    onClose={() => setTableToLeave(null)}
  >
    <p>Êtes-vous sûr de vouloir quitter la table "{tableToLeave.name}" ?</p>
    <div className="modal__actions">
      <button onClick={() => setTableToLeave(null)}>Annuler</button>
      <button onClick={() => {
        onLeave(tableToLeave._id);
        setTableToLeave(null);
      }}>Oui, quitter</button>
    </div>
  </Modal>
)}
          </ul>
        </>
      )}
    </div>
  );
}
