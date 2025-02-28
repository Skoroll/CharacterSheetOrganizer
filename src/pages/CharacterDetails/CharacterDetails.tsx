import { useParams } from "react-router-dom";
import EditableSheet from "../../components/EditableSheet/EditableSheet";

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>(); // Récupérer l'ID de l'URL

  if (!id) return <p>Aucun personnage trouvé.</p>;

  return (
    <div>
      <h1>Fiche du personnage</h1>
      <EditableSheet id={id} />
    </div>
  );
}
