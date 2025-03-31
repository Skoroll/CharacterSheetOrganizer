import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.scss";

export default function ResetPassword() {
  const { token } = useParams(); // 🔄 Récupère le token dans l'URL
  const navigate = useNavigate(); // 🔄 Pour rediriger après la réinitialisation
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("⚠️ Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/users/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        alert(`❌ Erreur : ${data.message}`);
        return;
      }

      alert("✅ Mot de passe réinitialisé avec succès !");
      navigate("/"); // 🔄 Redirige vers la page de connexion
    } catch (error) {
      console.error("❌ Erreur :", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="reset-container">
      <h2>Réinitialisation du mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nouveau mot de passe
          <input
            type="password"
            placeholder=""
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmer le mot de passe
          <input
            type="password"
            placeholder=""
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Réinitialiser</button>
      </form>
    </div>
  );
}
