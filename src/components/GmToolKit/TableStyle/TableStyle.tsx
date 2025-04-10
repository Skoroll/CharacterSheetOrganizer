import { useState } from "react";
import "./TableStyle.scss";
import { useEffect } from "react";
import desertBg from "../../../assets/backgrounds/desert.webp";
import forestBg from "../../../assets/backgrounds/forest.webp";
import woodBg from "../../../assets/backgrounds/wood.webp";
import stoneBg from "../../../assets/backgrounds/stone.webp";
import ivyStoneBg from "../../../assets/backgrounds/ivy-stone.webp";
import scrollBg from "../../../assets/backgrounds/scroll.webp";
import { io } from "socket.io-client";

interface TableStyleProps {
  tableId: string;
  API_URL: string;
  onStyleUpdate: () => void;
}

const TableStyle: React.FC<TableStyleProps> = ({
  tableId,
  API_URL,
  onStyleUpdate,
}) => {
  const socket = io(import.meta.env.VITE_API_URL);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [borderWidth, setBorderWidth] = useState("0px");
  const [borderColor, setBorderColor] = useState("#000000");
  const [bannerStyle, setBannerStyle] = useState("normal");
  const [tableName, setTableName] = useState("");
  const [selectedFont, setSelectedFont] = useState("");
  const [tableBG, setTableBG] = useState<string>(""); // Nouvelle variable d'état pour le background

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tabletop/tables/${tableId}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération de la table");
        const data = await response.json();
        setTableName(data.name); // 🟢 Récupération du nom
      } catch (error) {
        console.error("❌ Impossible de charger la table :", error);
      }
    };

    fetchTable();
  }, [API_URL, tableId]);

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
    if (bannerImage) formData.append("bannerImage", bannerImage);//Image de la bannière
    formData.append("borderWidth", borderWidth); //Largeur de la bordure
    formData.append("borderColor", borderColor); //Couleur du contour de la bannière
    formData.append("bannerStyle", bannerStyle); //Style de la bannière
    formData.append("selectedFont", selectedFont); //Correspond à la police d'écriture choisie
    formData.append("tableBG", tableBG); //Pour le fond de table sélectionné dans le formulaire

    console.log("📤 Données envoyées :", {
      bannerImage: bannerImage?.name,
      borderWidth,
      borderColor,
      bannerStyle,
      tableBG, // Affichage de la sélection du background
    });

    try {
      const response = await fetch(
        `${API_URL}/api/tabletop/tables/${tableId}/style`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour du style"
        );
      }

      console.log("✅ Style mis à jour !");
      onStyleUpdate(); // Rafraîchir la bannière
      socket.emit("tableStyleUpdated", { tableId });

      setBannerImage(null);
      setBannerPreview(null);
    } catch (error) {
      console.error("❌ Erreur lors de l'upload :", error);
      alert("Impossible de mettre à jour le style.");
    }
  };

  return (
    <div className="table-style gm-tool ">
      <h2>Style de la table</h2>
      <h3 className={`table-style--name font-${selectedFont}`}>{tableName}</h3>
      <form onSubmit={handleSubmit}>
        {/* 📌 Upload de l'image */}
        <div className="table-style__img-prev">
          <label>
            Bannière
            <input className="input-file" type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          {/* 📌 Prévisualisation de l'image */}
          {bannerPreview ? (
            <div
              className={`banner-preview ${bannerStyle}`}
              style={{
                backgroundImage: `url(${bannerPreview})`,
                borderWidth: borderWidth,
                borderColor: borderColor,
                borderStyle: "solid",
              }}
            />
          ) : (
            <p className="no-img">
              <i className="fa-solid fa-image" />
              <br />
              Ajouter votre image
            </p>
          )}
        </div>

        {/* 📌 Choix du contour */}
        <label>
          Contour de la bannière
          <select
            value={borderWidth}
            onChange={(e) => setBorderWidth(e.target.value)}
          >
            <option value="0px">Aucune</option>
            <option value="1px">Petit (1px)</option>
            <option value="3px">Moyen (3px)</option>
            <option value="5px">Grand (5px)</option>
          </select>
        </label>

        {/* 📌 Couleur du contour */}
        <label>
          Couleur du contour
          <input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
          />
        </label>

        {/* 📌 Style de la bannière */}
        <label>
          Style de la bannière
          <select
            value={bannerStyle}
            onChange={(e) => setBannerStyle(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="rounded">Arrondi</option>
            <option value="shadow">Ombré</option>
          </select>
        </label>

        {/* 📌 Choix du background de la table */}
        <label>
          Fond de la table
          <select
            value={tableBG}
            onChange={(e) => setTableBG(e.target.value)}
          >
            <option value="">Choisir un fond</option>
            <option value={desertBg}>Désert</option>
            <option value={forestBg}>Forêt</option>
            <option value={woodBg}>Bois</option>
            <option value={stoneBg}>Pierre</option>
            <option value={ivyStoneBg}>Pierre avec lierre</option>
            <option value={scrollBg}>Parchemin</option>
          </select>
        </label>

        <label>
          Police du nom :
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
          >
            <option>-Sélectionnez une police-</option>
            <option value="uncial">Uncial Antiqua</option>
            <option value="medieval">MedievalSharp</option>
            <option value="pirata">Pirata One</option>
            <option value="cinzel">Cinzel Decorative</option>
            <option value="imfell">IM Fell English</option>
            <option value="almendra">Almendra SC</option>
          </select>
        </label>

        {/* 📌 Bouton de soumission */}
        <button type="submit">Définir</button>
      </form>
    </div>
  );
};

export default TableStyle;
