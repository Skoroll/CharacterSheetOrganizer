import { useEffect, useState } from "react";

const PlayerAtTable = ({ playerIds, API_URL }: { playerIds: string[]; API_URL: string }) => {
  const [playersDetails, setPlayersDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Pour indiquer le chargement des données
  const [error, setError] = useState<string | null>(null); // Pour gérer les erreurs

  useEffect(() => {
    async function fetchPlayerDetails() {
      setLoading(true); // Début du chargement
      setError(null); // Réinitialiser les erreurs

      try {
        const details = await Promise.all(
          playerIds.map(async (id) => {
            const response = await fetch(`${API_URL}/api/users/${id}`);
            if (!response.ok) throw new Error(`Erreur lors de la récupération du joueur ${id}`);
            return response.json();
          })
        );
        setPlayersDetails(details);
      } catch (error: any) {
        setError(error.message); // Capturer l'erreur
        console.error("Erreur lors de la récupération des détails des joueurs", error);
      } finally {
        setLoading(false); // Fin du chargement
      }
    }

    fetchPlayerDetails();
  }, [playerIds, API_URL]);

  if (loading) {
    return <p>Chargement des détails des joueurs...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Erreur: {error}</p>;
  }

  return (
    <div>
      {playersDetails.map((player) => (
        <div key={player._id}>
          <h3>{player.name}</h3>
          <p>{player.email}</p>
          {/* Afficher d'autres informations sur le joueur ici */}
        </div>
      ))}
    </div>
  );
};

export default PlayerAtTable;
