import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, children, onClose }: ModalProps): JSX.Element {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const modalContent = (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-overlay__inside" onMouseDown={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal__close-btn">X</button>
        <h2>{title}</h2>
        <div className="modal__inside--content">{children}</div>
      </div>
    </div>
  );

  const rootElement = document.getElementById("modal-root");
  return rootElement ? ReactDOM.createPortal(modalContent, rootElement) : modalContent;
}
