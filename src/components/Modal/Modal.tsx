import { ReactNode } from "react";
import "./Modal.scss";

interface ModalProps {
  title: string;
  content: ReactNode;
  onClose: () => void; // Ajout d'une prop pour fermer la modal
}

export default function Modal({ title, content, onClose }: ModalProps): JSX.Element {
  return (
    <div className="modal">
      <div className="modal__inside">
        <button onClick={onClose} className="modal__close-btn">X</button>
        <h2>{title}</h2>
        <div className="modal__inside--content">{content}</div>
      </div>
    </div>
  );
}
