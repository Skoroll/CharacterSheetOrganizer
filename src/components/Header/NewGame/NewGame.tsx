import { useModal } from "../../../Context/ModalContext";

export default function NewGame() {
  const { openLeaveModal, openCreateTableModal, openJoinTableModal } = useModal(); 

  const menuOptions = [
    {
      name: "Créer une partie",
      action: openCreateTableModal, 
    },
    {
      name: "Rejoindre une partie",
      action: () => openJoinTableModal({
        tableId: "tableIdExemple",
        gameMasterId: "gmIdExemple",
        game: "Aria"
      }),
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
