import { useEffect, useState } from "react";
import Modal from "../Modal";
import { Character } from "../../../types/Character";
import defaultPicture from "../../../assets/person-placeholder-5.webp";
import "./UserProfileModal.scss";
import { Table } from "../../../types/Table";


interface UserProfileModalProps {
  user: UserProfile;
  isOwner?: boolean;
  onClose: () => void;
  characters?: Character[];
}

export type UserProfile = {

  _id: string;
  name?: string;
  profilePicture?: string;
  createdAt?: string;
  isPremium?: boolean;
  questsCreated?: number;
  tablesJoined?: { _id: string; name: string; banner?: string; gameMaster?: string }[];
  friendList?: string;
  selectedCharacter?: string;
  characters: Character[];
};


export default function UserProfileModal({
  user,
  isOwner = false,
  onClose,
  characters: initialCharacters = [],
}: UserProfileModalProps) {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [featuredCharacterId] = useState<string | null>(
    user.selectedCharacter || null
  );
  const [tables, setTables] = useState<Table[]>([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const resolveImageUrl = (img?: string | File): string => {
    if (!img) return defaultPicture;
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
    if (random?.image) return resolveImageUrl(random.image);

    return "/assets/default-user.png";
  };

useEffect(() => {
  const fetchTables = async () => {
    if (!user._id || !API_URL) return;
    setTablesLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}/tables-detailed`);
      if (!res.ok) throw new Error("Erreur lors du chargement des tables");
      const data: Table[] = await res.json();
      setTables(data);
    } catch (error) {
      console.error("❌ Erreur chargement tables :", error);
    } finally {
      setTablesLoading(false);
    }
  };

  fetchTables();
}, [user._id, API_URL]);


  const fetchCharacters = async () => {
    try {
      const res = await fetch(`/api/characters/by-user/${user._id}`);
      const data = await res.json();
      setCharacters(data);
    } catch (error) {
      console.error("Erreur lors du chargement des personnages :", error);
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
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultPicture;
            }}
          />

          <div className="profile__main--content">
            <h2>
              {user.isPremium && <span>👑</span>} {user.name}
            </h2>
            <p>
              Création :&nbsp;
              <span>
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Pionnier"}
              </span>
            </p>

            <p className="on-column">
              Personnage principal :{" "}
              <span>
                {characters.find((c) => c._id === featuredCharacterId)?.name ||
                  "Aucun"}
              </span>
            </p>
          </div>
        </div>
        <hr />
        <div className="profile__stats">

            <p className="on-column">
              Quêtes créées<span>{user.questsCreated ?? 0}</span>
            </p>
            <p className="on-column">
              Tables en cours<span>{user.tablesJoined?.length ?? 0}</span>
            </p>
            <p className="on-column">
              Amis<span>{user.friendList?.length ?? 0}</span>
            </p>

        </div>
        <hr />
        <div className="profile__tables-joined">
          Tables de jeu :
          <div className="profile__tables-joined--list">
<ul>
  {tablesLoading && <li>Chargement...</li>}
  {!tablesLoading && tables.length === 0 && <li>Aucune table</li>}
  {!tablesLoading && tables.map((table) => (
    <li key={table._id}>
      <img
        className="table--img"
        src={
          table.bannerImage
            ? table.bannerImage.startsWith("http")
              ? table.bannerImage
              : `${API_URL}${table.bannerImage}`
            : "/assets/default-table.png"
        }
        alt={table.name}
        onError={(e) => {
          e.currentTarget.src = "/assets/default-table.png";
        }}
      />
      <span className="table-title">{table.name}</span>
      <span className="table-status">
        {table.gameMaster === user._id ? "MJ" : "Joueur"}
      </span>
    </li>
  ))}
</ul>

          </div>
        </div>
        <hr />
        {!isOwner && (
          <div className="profile__actions">
            <button>
              <i className="fa-solid fa-user-plus"></i>
            </button>
            <button>
              <i className="fa-solid fa-user-minus"></i>
            </button>
            <button>
              <i className="fa-solid fa-triangle-exclamation"></i>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
