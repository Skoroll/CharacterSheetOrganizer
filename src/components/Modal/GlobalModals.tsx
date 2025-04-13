import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import TableTopBrowse from "../ModalContent/ModalTabletop/TableTopBrowse/TableTopBrowse";
import TabletopCreation from "../ModalContent/ModalTabletop/TabletopCreation/TabletopCreation";
import TableTopLeave from "../ModalContent/ModalTabletop/TableTopLeave/TableTopLeave";
import { useModal } from "../../Context/ModalContext";
import { useUser } from "../../Context/UserContext";
import { Table } from "../../types/Table";

export default function GlobalModals() {
  const { 
    showLeaveModal, 
    closeLeaveModal, 
    showJoinTableModal, 
    joinTableData, 
    closeJoinTableModal,
    showCreateTableModal,      
    closeCreateTableModal  
  } = useModal();
  
  const { user } = useUser();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user.isAuthenticated) return;

    const fetchUserTables = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        const tableIds = data.user.tablesJoined || [];

        const tablesData: Table[] = [];
        for (const id of tableIds) {
          const tableRes = await fetch(`${API_URL}/api/tabletop/tables/${id}`);
          if (!tableRes.ok) continue;
          const tableData = await tableRes.json();
          tablesData.push(tableData);
        }

        setTables(tablesData);
      } catch (err) {
        setError("Erreur lors de la récupération des tables");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTables();
  }, [user, API_URL]);

  return (
    <>
      {showLeaveModal && (
        <Modal title="Quitter une table" onClose={closeLeaveModal}>
          <TableTopLeave
            tables={tables}
            loading={loading}
            error={error}
            API_URL={API_URL}
            userId={user._id!}
            onLeave={(tableId) => {
              fetch(`${API_URL}/api/tabletop/tables/${tableId}/removePlayer/${user._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user.token}` },
              }).then(() => {
                setTables((prev) => prev.filter((t) => t._id !== tableId));
                closeLeaveModal();
              });
            }}
            onLeaveSuccess={closeLeaveModal}
          />
        </Modal>
      )}
      {showJoinTableModal && joinTableData && (
  <Modal title="Rejoindre une partie" onClose={closeJoinTableModal}>
    <TableTopBrowse



    />
  </Modal>
)}
{showCreateTableModal && (
  <Modal title="Créer une table" onClose={closeCreateTableModal}>
    <TabletopCreation onCreated={closeCreateTableModal} />
  </Modal>
)}
    </>
  );
}
