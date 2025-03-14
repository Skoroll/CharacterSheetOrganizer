import { useParams } from "react-router-dom";
import { useEffect } from "react";
import EditableSheet from "../../components/EditableSheet/EditableSheet";

export default function CharacterPage() {
      useEffect(() => {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }, []);
  

  const { id } = useParams<{ id: string }>();

  if (!id) return <p>Aucun personnage trouvé.</p>;

  return (
    <div>
      <h1>Fiche du personnage</h1>
      <EditableSheet id={id} />
    </div>
  );
}
