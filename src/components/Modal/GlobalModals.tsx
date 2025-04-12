import Modal from "../Modal/Modal";
import TabletopCreation from "../ModalContent/ModalTabletop/TabletopCreation/TabletopCreation";
import TableTopLeave from "../ModalContent/ModalTabletop/TableTopLeave/TableTopLeave";
import { useModal } from "../../Context/ModalContext";
import { useUser } from "../../Context/UserContext";

export default function GlobalModals() {
  const { showLeaveModal, closeLeaveModal, showCreateTableModal, closeCreateTableModal } = useModal();
  const { user } = useUser();
  const API_URL = import.meta.env.VITE_API_URL;

  return (
    <>
      {showLeaveModal && (
        <Modal title="Quitter une table" onClose={closeLeaveModal}>
<TableTopLeave
  API_URL={API_URL}
  userId={user._id!}
  onLeave={(tableId) => {
    fetch(`${API_URL}/api/tabletop/tables/${tableId}/removePlayer/${user._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    }).then(() => {
      closeLeaveModal();
    });
  }}
  onLeaveSuccess={closeLeaveModal}
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
