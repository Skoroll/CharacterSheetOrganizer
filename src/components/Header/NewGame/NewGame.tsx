import { useNavigate } from "react-router-dom";
import { useModal } from "../../../Context/ModalContext";

export default function NewGame() {
  const navigate = useNavigate();
  const { openLeaveModal } = useModal();

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
      name: "Quitter une table",
      goTo: null,
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