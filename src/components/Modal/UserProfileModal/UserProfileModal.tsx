import { useEffect, useState } from "react";
import Modal from "../Modal";
import { AppUser } from "../../../types/AppUser";
import { Character } from "../../../types/Character";
import "./UserProfileModal.scss";

interface UserProfileModalProps {
  user: AppUser;
  isOwner?: boolean;
  onClose: () => void;
  characters?: Character[];
}

export default function UserProfileModal({
  user,
  isOwner = false,
  onClose,
  characters: initialCharacters = [],
}: UserProfileModalProps) {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [featuredCharacterId, setFeaturedCharacterId] = useState<string | null>(
    user.selectedCharacter || null
  );
  const [isSaving, setIsSaving] = useState(false);

  const resolveImageUrl = (img?: string | File): string => {
    if (!img) return "/assets/default-user.png";
    return typeof img === "string" ? img : URL.createObjectURL(img);
  };

  const getProfileImage = () => {
    const custom =
      isOwner && featuredCharacterId
        ? characters.find((c) => c._id === featuredCharacterId)?.image
        : user.profilePicture;

    if (custom) return resolveImageUrl(custom);

    const charactersWithImage = characters.filter((c) => c.image);
    const random =
      charactersWithImage[
        Math.floor(Math.random() * charactersWithImage.length)
      ];
    return resolveImageUrl(random?.image);
  };

  const fetchCharacters = async () => {
    try {
      const res = await fetch(`/api/characters/by-user/${user._id}`);
      const data = await res.json();
      setCharacters(data);
    } catch (error) {
      console.error("Erreur lors du chargement des personnages :", error);
    }
  };

  const handleCharacterSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = event.target.value;
    setFeaturedCharacterId(selectedId);
    setIsSaving(true);

    try {
      const res = await fetch(`/api/users/${user._id}/selected-character`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ characterId: selectedId }),
      });

      if (!res.ok)
        throw new Error("Échec de la mise à jour du personnage mis en avant");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (characters.length === 0) {
      fetchCharacters();
    }
  }, []);

  return (
    <Modal title="" onClose={onClose}>
      <div className="profile">
        <div className="profile__main">
          <img
            src={getProfileImage()}
            alt={user.name}
            className="profile--picture"
          />
          <div className="profile__main--content">
            <h2 className=""> {user.isPremium && <span className="">👑</span>}{user.name}</h2>
            <p>
              Crée le :<span>Test</span>
            </p>
            <p className="on-column">
              Personnage principal : <span>Test</span>
            </p>
          </div>
        </div>
        <hr/>
        <div className="profile__stats">
          <p className="on-column">Quêtes crée : <span>Test</span></p>
          <p className="on-column">Table en cours : <span>Test</span></p>
          <p className="on-column">Amis : <span>Test</span></p>
        </div>
        <hr/>
        <div className="profile__tables-joined">
          Tables de jeu :
            <div className="profile__tables-joined--list">
              <ul>
                <li><img className="table--img" src={""} alt="Table" /> <span className="table-title">Titre table</span> <span className="table-status">MJ</span> </li>
                <li><img className="table--img" src={""} alt="Table" /> <span className="table-title">Titre table</span> <span className="table-status">Joueur</span> </li>
              </ul>
            </div>
        </div>
        <hr/>
        {!isOwner && <button>Ajouter en ami</button>}
        {isOwner && (
          <div className="">
            <label className="">Personnage mis en avant</label>
            <select
              value={featuredCharacterId || ""}
              onChange={handleCharacterSelect}
              className=""
              disabled={isSaving}
            >
              <option value="">-- Aucun --</option>
              {characters.map((char) => (
                <option key={char._id} value={char._id}>
                  {char.name}
                </option>
              ))}
            </select>
            {isSaving && <p className="">Sauvegarde en cours...</p>}
          </div>
        )}
      </div>
    </Modal>
  );
}
