import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import brokenImg from "../../assets/broken-image.png"

interface GalleryProps {
  files: Array<{
    _id: string;
    filename: string;
    path?: string;
    type: "image" | "text";
    content?: string;
  }>;
  API_URL: string;
  onDeleteFile: (fileId: string) => void; // ✅ Nouvelle prop
}

const Gallery: React.FC<GalleryProps> = ({ files, API_URL, onDeleteFile }) => {
  const tableId = window.location.pathname.split("/").pop() || "";
  const socketRef = useRef(io(API_URL, { autoConnect: false }));

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/gmfiles/files/${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      onDeleteFile(fileId); // ✅ Notifie le parent pour mettre à jour la liste
    } catch (error) {
      console.error("❌ Erreur suppression fichier :", error);
      alert("Impossible de supprimer le fichier.");
    }
  };

  useEffect(() => {
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }

    socketRef.current.on("connect", () =>
      console.log(
        `✅ [DEBUG] WebSocket connecté avec ID : ${socketRef.current.id}`
      )
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [API_URL]);

  // ✅ Fonction pour envoyer une image à MediaDisplay
  const sendToMediaDisplay = (filePath?: string) => {
    if (!filePath) {
      return;
    }
    if (!socketRef.current.connected) {
      return;
    }
    const mediaObject = { tableId, mediaUrl: filePath };
    socketRef.current.emit("sendMedia", mediaObject);
  };

  const sendTextToMediaDisplay = (text?: string) => {
    if (!text) {
      return;
    }
    if (!socketRef.current.connected) {
      return;
    }
    const textObject = { tableId, textContent: text };
    socketRef.current.emit("sendText", textObject);
  };

  // ✅ Fonction pour supprimer un média actuellement affiché
  const removeDisplayedMedia = () => {
    if (!socketRef.current.connected) return;
    socketRef.current.emit("removeMedia", { tableId });
  };

  return (
    <div className="gallery">
      {/* 🔴 Bouton pour retirer le média affiché */}
      <button className="remove-btn" onClick={removeDisplayedMedia}>
        Retirer l'affichage
      </button>
      <h3>📂 Fichiers enregistrés</h3>
      {files.length > 0 ? (
        <ul>
          {files.map((file, index) => (
            <li key={index} className="file-item">
              {file.type === "image" ? (
                <>
                  <button
                    onClick={() => handleDeleteFile(file._id)} // ✅ Passer l'ID du fichier
                    className="file-item--remove"
                  >
                    <i className="fa-solid fa-trash"></i> Supprimer
                  </button>

                  <img
                    src={`${API_URL}${file.path}`}
                    alt={file.filename}
                    onError={(e) => {
                      e.currentTarget.src = brokenImg;
                    }}
                  />
                  <button
                    className="show-btn"
                    onClick={() => sendToMediaDisplay(`${API_URL}${file.path}`)}
                  >
                    Afficher
                  </button>
                </>
              ) : file.type === "text" ? (
                <>
                  <p>{file.content || "📄 Aucun contenu disponible"}</p>
                  <button
                    className="show-btn"
                    onClick={() =>
                      sendTextToMediaDisplay(
                        file.content || "📄 Aucun contenu disponible"
                      )
                    }
                  >
                    Afficher le texte
                  </button>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun fichier enregistré.</p>
      )}
    </div>
  );
};

export default Gallery;
