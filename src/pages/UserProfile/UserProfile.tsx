import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

type UserProfileType = {
  _id: string;
  name: string;
  createdAt: string;
};

export default function UserProfile() {
  const { id } = useParams();
  const { user } = useUser();
  const token = user.token;

  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = id
          ? `${import.meta.env.VITE_API_URL}/profile/${id}`
          : `${import.meta.env.VITE_API_URL}/profile`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erreur de récupération");

        setProfile(data.user);

        if (!id || (user && user._id === data.user._id)) {
          setIsOwner(true);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          setError(err.message);
        } else {
          setError("Une erreur inconnue est survenue");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token, user]);

  if (loading) return <p>Chargement du profil...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p>Aucun profil trouvé.</p>;

  return (
    <div className="profile">
      <h2>Profil de {profile.name}</h2>
      <p><strong>Nom :</strong> {profile.name}</p>
      <p><strong>Inscrit depuis :</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>

      {isOwner && <button onClick={() => alert("Mode édition à venir...")}>Modifier mon profil</button>}
    </div>
  );
}
