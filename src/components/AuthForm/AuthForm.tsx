import { useState, useEffect } from "react";
import { useUser } from "../../Context/UserContext";
import "./AuthForm.scss";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false); // ✅ Nouvel état
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } =  useUser(); // Accède à la fonction setUser pour mettre à jour le contexte

  const API_URL = import.meta.env.VITE_API_URL; // Récupère l'URL du backend

  useEffect(() => {
    // Vérifie si un token est déjà présent dans le localStorage lors du chargement du composant
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const parsedUser = JSON.parse(user);
      setUser({ userPseudo: parsedUser.name, isAuthenticated: true });
    }
  }, [setUser])

  // ✅ Fonction pour soumettre le formulaire de connexion/inscription
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const endpoint = isSignUp
      ? `${API_URL}/api/users/register`
      : `${API_URL}/api/users/login`;
  
    const payload = isSignUp ? { name, email, password } : { name, password };
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(`❌ Erreur : ${data.message}`);
        return;
      }
  
      // 🔥 Vérifie les bonnes clés retournées par l'API
      if (!data.accessToken || !data.refreshToken || !data.user) {
        console.error("❌ L'API ne retourne pas de token ou d'utilisateur !");
        return;
      }
  
      // ✅ Stocker les tokens et l'utilisateur
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: data.user.id, name: data.user.name, isAdmin: data })
      );
      
      console.log("✅ Token et Refresh Token stockés :");
      console.log("🔹 Token :", localStorage.getItem("token"));
      console.log("🔹 Refresh Token :", localStorage.getItem("refreshToken"));
      
      
  
      setUser({ userPseudo: data.user.name, isAuthenticated: true, isAdmin: data.user.isAdmin });
  
      setTimeout(() => {
        console.log("📌 Vérification après 1s :", {
          token: localStorage.getItem("token"),
          refreshToken: localStorage.getItem("refreshToken"),
          user: localStorage.getItem("user"),
        });
        window.location.reload();
      }, 1000);
      
      
    } catch (error) {
      console.error("❌ Erreur de connexion :", error);
      alert("Une erreur est survenue. Vérifiez votre connexion.");
    }
  };
  

  // ✅ Fonction pour gérer la récupération de mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Veuillez entrer votre adresse e-mail.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/forgot-password`, {
        // ✅ Correction ici
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ Erreur : ${data.message}`);
        return;
      }

      alert("📩 Un email de récupération a été envoyé !");
      setIsResetPassword(false); // Revenir à la connexion
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération du mot de passe :",
        error
      );
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-container__btns">
        <button 
          onClick={() => setIsSignUp(false)}
          className={!isSignUp ? "selected" : ""}
        >
            Se connecter
        </button>

        <button 
          onClick={() => setIsSignUp(true)}
          className={isSignUp ? "selected" : ""}
        >
          Créer un compte
        </button>
      </div>
      {isResetPassword ? (
        // ✅ Formulaire de récupération de mot de passe
        <>
          <h2>🔑 Réinitialiser le mot de passe</h2>
          <form onSubmit={handleResetPassword}>
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Envoyer</button>
          </form>
          <button
            className="toggle-btn"
            onClick={() => setIsResetPassword(false)}
          >
            ⬅ Retour
          </button>
        </>
      ) : (
        // ✅ Formulaire de connexion/inscription
        <>
          <h2>{isSignUp ? "Créer un compte" : "Se connecter"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {isSignUp && (
              <input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">
              {isSignUp ? "S'inscrire" : "Se connecter"}
            </button>
          </form>

          <button
            className="toggle-btn"
            onClick={() => setIsResetPassword(true)}
          >
            Mot de passe oublié ?
          </button>
        </>
      )}
    </div>
  );
}
