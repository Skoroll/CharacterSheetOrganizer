import { useState, useEffect } from "react";
import { useUser } from "../../Context/UserContext";
import Modal from "../Modal/Modal";
import "./AuthForm.scss";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState("");
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser(); // Accède à la fonction setUser pour mettre à jour le contexte
  const API_URL = import.meta.env.VITE_API_URL; // Récupère l'URL du backend

  const showModalMessage = (message: string) => {
    setAuthModalMessage(message);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    // Vérifie si un token est déjà présent dans le localStorage lors du chargement du composant
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      const parsedUser = JSON.parse(user);
      setUser({ userPseudo: parsedUser.name, isAuthenticated: true });
    }
  }, [setUser]);

  // Fonction pour soumettre le formulaire de connexion/inscription
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isSignUp
      ? `${API_URL.replace(/\/$/, "")}/api/users/register`
      : `${API_URL.replace(/\/$/, "")}/api/users/login`;

    const payload = isSignUp ? { name, email, password } : { name, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        showModalMessage(`Erreur : ${data.message}`);
        return;
      }

      if (isSignUp) {
        // ✅ Si c'était une inscription, afficher un message et rediriger vers la connexion
        showModalMessage(
          "✅ Inscription réussie ! Vous pouvez maintenant vous connecter."
        );
        setIsSignUp(false); // Retour au formulaire de connexion
        setName("");
        setEmail("");
        setPassword("");
        return;
      }

      // ✅ Si c'est une connexion, stocker les tokens et l'utilisateur
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          isAdmin: data.user.isAdmin,
        })
      );

      setUser({
        userPseudo: data.user.name,
        isAuthenticated: true,
        isAdmin: data.user.isAdmin,
      });

      console.log("✅ Connexion réussie ! Redirection...");
      window.location.reload(); // Recharge la page après connexion
    } catch (error) {
      console.error("Erreur de connexion :", error);
      showModalMessage("Une erreur est survenue. Vérifiez votre connexion.");
    }
  };

  // ✅ Fonction pour gérer la récupération de mot de passe
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showModalMessage("Veuillez entrer votre adresse e-mail.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        showModalMessage(`Erreur : ${data.message}`);
        return;
      }

      showModalMessage("📩 Un email de récupération a été envoyé !");
      setIsResetPassword(false); // Revenir à la connexion
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du mot de passe :",
        error
      );
      showModalMessage("Une erreur est survenue.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-container__btns">
        <button
          onClick={() => setIsSignUp(false)}
          className={`btn-log ${!isSignUp ? "selected" : ""}`}
        >
          Se connecter
        </button>
        /
        <button
          onClick={() => setIsSignUp(true)}
          className={`btn-log ${isSignUp ? "selected" : ""}`}
        >
          Créer un compte
        </button>
      </div>
      {isResetPassword ? (
        // ✅ Formulaire de récupération de mot de passe
        <>
          <h2> Réinitialiser le mot de passe</h2>
          <form className="form" onSubmit={handleResetPassword}>
            <div className="form__inputs-div">
              <input
                type="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Envoyer</button>
            </div>
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
      {authModalOpen && (
        <Modal title="" onClose={() => setAuthModalOpen(false)}>
          <p>{authModalMessage}</p>
          <div className="modal__buttons">
            <button
              className="modal__confirm-btn"
              onClick={() => setAuthModalOpen(false)}
            >
              OK
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
