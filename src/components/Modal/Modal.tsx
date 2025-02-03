import { ReactNode } from "react";
import "./Modal.scss";

interface ModalProps {
  title: string;
  content: ReactNode;
  onClose: () => void; 
}

export default function Modal({ title, content, onClose }: ModalProps): JSX.Element {
  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Bloque la propagation du clic pour éviter la fermeture */}
      <div className="modal__inside" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal__close-btn">X</button>
        <h2>{title}</h2>
        <div className="modal__inside--content">{content}</div>
      </div>
    </div>
  );
}
