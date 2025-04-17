import { useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholderImage from "../../../assets/placeholder-image.webp";

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateSheetVtm() {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [clan, setClan] = useState("");
  const [generation, setGeneration] = useState<number>(13);
  const [willpower, setWillpower] = useState<number>(0);
  const [bloodPool, setBloodPool] = useState<number>(0);
  const [humanity, setHumanity] = useState<number>(0);
  const [disciplines, setDisciplines] = useState<string[]>([""]);
  const [background, setBackground] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleAddDiscipline = () => {
    setDisciplines([...disciplines, ""]);
  };

  const handleDisciplineChange = (index: number, value: string) => {
    const updated = [...disciplines];
    updated[index] = value;
    setDisciplines(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("name", name);
    formData.append("clan", clan);
    formData.append("generation", generation.toString());
    formData.append("willpower", willpower.toString());
    formData.append("bloodPool", bloodPool.toString());
    formData.append("humanity", humanity.toString());
    formData.append("disciplines", JSON.stringify(disciplines));
    formData.append("background", background);
    formData.append("game", "vtm");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/characters/vtm`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate("/");
      } else {
        const data = await response.json();
        alert(data.message || "Erreur lors de la création.");
      }
    } catch (error) {
      console.error("Erreur lors de la création VTM :", error);
      alert("Erreur serveur.");
    }
  };

  return (
    <div className="sheet">
      <h2>Créer un personnage VTM</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Image :
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <div className="img-preview">
          {image ? (
            <img src={URL.createObjectURL(image)} alt="Preview" />
          ) : (
            <img src={placeholderImage} alt="placeholder" />
          )}
        </div>

        <label>
          Nom :
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Clan :
          <input type="text" value={clan} onChange={(e) => setClan(e.target.value)} />
        </label>

        <label>
          Génération :
          <input type="number" value={generation} onChange={(e) => setGeneration(Number(e.target.value))} />
        </label>

        <label>
          Volonté :
          <input type="number" value={willpower} onChange={(e) => setWillpower(Number(e.target.value))} />
        </label>

        <label>
          Réserve de sang :
          <input type="number" value={bloodPool} onChange={(e) => setBloodPool(Number(e.target.value))} />
        </label>

        <label>
          Humanité :
          <input type="number" value={humanity} onChange={(e) => setHumanity(Number(e.target.value))} />
        </label>

        <label>
          Disciplines :
          {disciplines.map((d, i) => (
            <input
              key={i}
              type="text"
              value={d}
              onChange={(e) => handleDisciplineChange(i, e.target.value)}
            />
          ))}
          <button type="button" onClick={handleAddDiscipline}>Ajouter une discipline</button>
        </label>

        <label>
          Background :
          <textarea value={background} onChange={(e) => setBackground(e.target.value)} />
        </label>

        <button type="submit">Créer le personnage</button>
      </form>
    </div>
  );
}
