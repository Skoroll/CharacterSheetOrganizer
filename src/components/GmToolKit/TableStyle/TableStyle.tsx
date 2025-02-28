import { useState } from "react";
import "./TableStyle.scss";

interface TableStyleProps {
  tableId: string;
  API_URL: string;
  onStyleUpdate: () => void;
}

const TableStyle: React.FC<TableStyleProps> = ({ tableId, API_URL, onStyleUpdate }) => {
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [borderWidth, setBorderWidth] = useState("0px");
  const [borderColor, setBorderColor] = useState("#000000");
  const [bannerStyle, setBannerStyle] = useState("normal");

  // 📌 Gestion de l'upload d'image avec prévisualisation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file)); // ✅ Création d'une URL temporaire pour prévisualisation
    }
  };

  // 📌 Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (bannerImage) formData.append("bannerImage", bannerImage);
    formData.append("borderWidth", borderWidth);
    formData.append("borderColor", borderColor);
    formData.append("bannerStyle", bannerStyle);

    console.log("📤 Données envoyées :", {
      bannerImage: bannerImage?.name,
      borderWidth,
      borderColor,
      bannerStyle,
    });

    try {
      const response = await fetch(`${API_URL}/api/tabletop/tables/${tableId}/style`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du style");
      }

      console.log("✅ Style mis à jour !");
      onStyleUpdate(); // ✅ Rafraîchir la bannière
    } catch (error) {
      console.error("❌ Erreur lors de l'upload :", error);
      alert("Impossible de mettre à jour le style.");
    }
  };

  return (
    <div className="gm-tool table-style">
      <h2>Style de la table</h2>
      <form onSubmit={handleSubmit}>
        {/* 📌 Upload de l'image */}
        <div className="table-style__img-prev">
        <label>
          Bannière
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>

        {/* 📌 Prévisualisation de l'image */}
        {!bannerPreview && (
          <div
            className={`banner-preview ${bannerStyle}`}
            style={{
              backgroundImage: `url(${bannerPreview})`,
              borderWidth: borderWidth,
              borderColor: borderColor,
              borderStyle: "solid",
            }}
            
            >
          </div>
          
        )}

        {!bannerPreview && (
          
          <p 
            className="no-img">
              <i className="fa-solid fa-image"/>
              <br/>
            Ajouter votre image</p>
        )}
        </div>

        {/* 📌 Choix du contour */}
        <label>
          Contour de la bannière
          <select value={borderWidth} onChange={(e) => setBorderWidth(e.target.value)}>
            <option value="0px">Aucune</option>
            <option value="1px">Petit (1px)</option>
            <option value="3px">Moyen (3px)</option>
            <option value="5px">Grand (5px)</option>
          </select>
        </label>

        {/* 📌 Couleur du contour */}
        <label>
          Couleur du contour
          <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} />
        </label>

        {/* 📌 Style de la bannière */}
        <label>
          Style de la bannière
          <select value={bannerStyle} onChange={(e) => setBannerStyle(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="rounded">Arrondi</option>
            <option value="shadow">Ombré</option>
          </select>
        </label>

        {/* 📌 Bouton de soumission */}
        <button type="submit">Définir</button>
      </form>
    </div>
  );
};

export default TableStyle;
