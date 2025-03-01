import { useState } from "react";
import axios from "axios";
import "./Account.scss";

export default function ManageAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/user/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du compte");
      }
  
      setMessage("Compte supprimé avec succès !");
      setError(null);
  
      // Optionnel : Déconnexion après suppression
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirige l'utilisateur
    } catch (error) {
      console.error("Erreur :", error);
      setError("Impossible de supprimer ce compte.");
      setMessage(null);
    }
  };
  
  
  

  function areYouSure() {
    // Affiche un message de confirmation
    const confirmed = window.confirm("Vous êtes sûr de vouloir supprimer votre compte ?");
    if (confirmed) {
      // Appelle handleDelete() sans argument
      handleDelete(); 
    }
  }
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("oldPassword", oldPassword);
  
    try {
      await axios.put("/api/users/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setMessage("Compte mis à jour avec succès !");
      setError(null);
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour du compte.");
      setMessage(null);
    }
  };
  

  return (
    <div className="manage-account">
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label htmlFor="name">Pseudonyme  :</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="oldPassword">Ancien mot de passe :</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Nouveau mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="validate">Mettre à jour</button>
        
        {/* Changer l'onClick pour appeler la fonction de confirmation */}
        <button 
          type="button" // Le bouton ne doit pas soumettre le formulaire
          className="dangerous"
          onClick={areYouSure} // Passe la fonction sans les parenthèses
        >
          Supprimer le compte
        </button>
      </form>
    </div>
  );
}
