import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Gallery from "../Galery";
import "./SendDocs.scss";

export default function SendDocs() {
  const { id: tableId } = useParams();
  const [activeTab, setActiveTab] = useState<"doc" | "text" | "galery">("doc");
  const [files, setFiles] = useState<
    {
      _id: string;
      filename: string;
      path?: string;
      type: "image" | "text";
      content?: string;
    }[]
  >([]);

  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [textContent, setTextContent] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [isBG, setIsBG] = useState(true);
  const [title, setTitle] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [textFont, setTextFont] = useState("Almendra SC");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setLocalFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setLocalFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file._id !== fileId));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tableId) {
      alert("Erreur : ID de table introuvable.");
      return;
    }

    const formData = new FormData();
    formData.append("tableId", tableId);
    formData.append("title", title);

    if (activeTab === "doc" && localFiles.length > 0) {
      localFiles.forEach((file) => formData.append("files", file));
    } else if (activeTab === "text") {
      formData.append("text", textContent);
      formData.append("textFont", textFont);
      formData.append("textColor", textColor);
      formData.append("isBG", String(isBG));
    }

    try {
      const res = await fetch(`${API_URL}/api/gmfiles/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Échec de l'upload");

      setLocalFiles([]);
      setPreviewImages([]);
      setTextContent("");
      setTitle("");
      fetchFiles();
    } catch (error) {
      console.error("❌ Erreur lors de l'upload :", error);
    }
  };

  const fetchFiles = async () => {
    if (!tableId) return;

    try {
      const res = await fetch(
        `${API_URL}/api/gmfiles/files?tableId=${tableId}`
      );
      if (!res.ok)
        throw new Error("Erreur lors de la récupération des fichiers");

      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des fichiers :", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [tableId]);

  return (
    <div className="gm-tool share-pannel">
      <h2>Partager</h2>
      <div className="share-pannel--wrapper">
        <div className="share-pannel__buttons">
          <button onClick={() => setActiveTab("doc")}>Doc</button>
          <button onClick={() => setActiveTab("text")}>Texte</button>
          <button onClick={() => setActiveTab("galery")}>
            <i className="fa-solid fa-folder"></i> Galerie
          </button>
        </div>

        <div className="share-pannel__container">
          {activeTab === "doc" && (
            <form onSubmit={handleUpload} encType="multipart/form-data">
              <div className="share-pannel__container--box">
                <label>Nom du fichier :</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />


              <label>Envoyez un document :</label>
              <div className="share-pannel--preview">
                <input type="file" multiple onChange={handleFileChange} />

                {previewImages.length > 0 && (
                  <div className="preview-container">
                    <div className="preview-grid">
                      {previewImages.map((src, index) => (
                        <div key={index} className="preview-item">
                          <img src={src} alt={`preview-${index}`} />
                          <div className="preview-item__buttons">
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                            >
                              Annuler
                            </button>
                            <button type="submit">Envoyer</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </div>
            </form>
          )}

          {activeTab === "text" && (
            <form onSubmit={handleUpload}>
              <div className="share-pannel__container--box">
                <label>Nom du texte :</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <label>Police :</label>
                <select
                  value={textFont}
                  onChange={(e) => setTextFont(e.target.value)}
                >
                  <option value="">-Sélectionner une police-</option>
                  <option value="Almendra SC">Almendra SC</option>
                  <option value="Cinzel Decorative">Cinzel Decorative</option>
                  <option value="IM Fell English">IM Fell English</option>
                  <option value="MedievalSharp">MedievalSharp</option>
                  <option value="Pirata One">Pirata One</option>
                  <option value="Uncial Antiqua">Uncial Antiqua</option>
                </select>

                <label>Couleur du texte :</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
                <label>
                  Fond parchemin :
                  <input
                    type="checkbox"
                    checked={isBG}
                    onChange={() => setIsBG((prev) => !prev)}
                  />
                </label>
              </div>

              <div className="share-pannel__container--box">
                <label>Texte :</label>
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  style={{ fontFamily: textFont }}
                />

                <button type="submit">Envoyer</button>
              </div>
            </form>
          )}
        </div>

        {activeTab === "galery" && (
          <Gallery
            files={files}
            API_URL={API_URL}
            onDeleteFile={handleFileDeleted}
          />
        )}
      </div>
    </div>
  );
}
