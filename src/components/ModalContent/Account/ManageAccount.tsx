import { useState } from "react";
import axios from "axios";
import "./Account.scss";

export default function ManageAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("oldPassword", oldPassword);

    try {
      const response = await axios.put("/api/users/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Compte mis à jour avec succès!");
      setError(null); // Réinitialiser les erreurs
    } catch (err) {
      setError("Une erreur est survenue lors de la mise à jour du compte.");
      setMessage(null); // Réinitialiser le message de succès
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
      </form>
    </div>
  );
}
