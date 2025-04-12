import { useModal } from "../../../Context/ModalContext";

export default function NewGame() {
  const { openLeaveModal, openCreateTableModal } = useModal(); // ✅

  const menuOptions = [
    {
      name: "Créer une partie",
      action: openCreateTableModal, // ✅
    },
    {
      name: "Rejoindre une partie",
      action: () => window.location.href = "/rejoindre", // tu peux naviguer ou ouvrir une autre modale
    },
    {
      name: "Quitter une table",
      action: openLeaveModal,
    },
  ];

  return (
    <div className="new-game">
      <ul>
        {menuOptions.map(({ name, action }, index) => (
          <li key={index} onClick={action}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
