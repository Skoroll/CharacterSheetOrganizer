import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../Context/UserContext"; // Assure-toi que le UserContext est bien importé
import "./AuthForm.scss";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserContext); // Accède à la fonction setUser pour mettre à jour le contexte

  const API_URL = import.meta.env.VITE_API_URL; // Récupère l'URL du backend

  useEffect(() => {
    // Vérifie si un token est déjà présent dans le localStorage lors du chargement du composant
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
  
    if (token && user) {
      const parsedUser = JSON.parse(user);
      setUser({ userPseudo: parsedUser.name, isAuthenticated: true });
    }
  }, [setUser]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const endpoint = isSignUp ? `${API_URL}/api/users/register` : `${API_URL}/api/users/login`;
    const payload = isSignUp ? { name, email, password } : { email, password };
    console.log(email, password);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data); // Log la réponse de l'API pour vérifier les données retournées
  
        // Sauvegarde du token et des informations utilisateur dans le localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ id: data.user.id, name: data.user.name }));
  
        // Mise à jour du contexte utilisateur
        setUser({ userPseudo: data.user.name, isAuthenticated: true });
  
        // Rafraîchissement de la page pour refléter les données mises à jour
        window.location.reload();
      } else {
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Créer un compte" : "Se connecter"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignUp ? "S'inscrire" : "Se connecter"}</button>
      </form>
      <button className="toggle-btn" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Déjà un compte ? Connectez-vous" : "Pas encore de compte ? Inscrivez-vous"}
      </button>
    </div>
  );
}
