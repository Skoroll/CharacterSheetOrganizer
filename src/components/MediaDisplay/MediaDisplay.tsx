import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "./MediaDisplay.scss";
interface MediaDisplayProps {
  tableId: string;
  API_URL: string;
}

export default function MediaDisplay({ tableId, API_URL }: MediaDisplayProps) {
  const [media, setMedia] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState<string | null>(null);

  const socketRef = useRef(io(API_URL, { autoConnect: false }));

  useEffect(() => {
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinTable", tableId);
    });

    // Réception d'un nouveau média (image)
    socketRef.current.on("newMedia", (mediaUrl: string) => {
      setDisplayedText(null); // Supprime le texte si une image est affichée
      setMedia(mediaUrl);
    });

    // Réception d'un nouveau texte
    socketRef.current.on("newText", (textData: { textContent: string }) => {
      setMedia(null); // Supprime l'image si un texte est affiché
      setDisplayedText(textData.textContent);
    });

    // Suppression du média affiché
    socketRef.current.on("removeMedia", () => {
      setMedia(null);
      setDisplayedText(null);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [tableId]);

  // ✅ Fonction pour envoyer la suppression du média
  const removeDisplayedMedia = () => {
    if (!socketRef.current.connected) return;
    socketRef.current.emit("removeMedia", { tableId });
  };

  return (
    <div className="media-container">
      {media ? (
        <img src={media} alt="Contenu média" style={{ maxWidth: "100%", height: "auto" }} />
      ) : displayedText ? (
        <p className="displayed-text">{displayedText}</p>
      ) : (
        <p></p>
      )}

      {/* 🔴 Bouton pour retirer le média affiché */}
      {(media || displayedText) && (
        <button className="remove-btn" onClick={removeDisplayedMedia}>
          
          <i className="fa-solid fa-x"/>
        </button>
      )}
    </div>
  );
}
