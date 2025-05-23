import { useState, useEffect } from "react";
import "./Premium.scss";
import { useUser } from "../../Context/UserContext"

export default function Premium() {
  const { user } = useUser(); 
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: user._id }),
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-customer-portal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ customerId: user.stripeCustomerId }), 
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="premium-page">
      <h1>✨ Premium</h1>

      {user?.isPremium ? (
        <>
          <p>Merci pour votre soutien ! 🙏</p>
          <p>Vous bénéficiez de toutes les fonctionnalités Premium :</p>
          <ul>
            <li>✔️ Sauvegardes étendues</li>
            <li>✔️ Contenu exclusif</li>
            <li>✔️ Personnalisation complète</li>
          </ul>
          <button onClick={handleManageSubscription} className="subscribe-button" disabled={loading}>
            {loading ? "Chargement..." : "Gérer mon abonnement"}
          </button>
        </>
      ) : (
  <>
    <p>Passer en Premium débloque de nombreux avantages pour améliorer votre expérience :</p>
    <ul>
      <li>💾 <strong>Sauvegardes étendues</strong> : conservez plus de personnages, documents et PNJs sans limite.</li>
      <li>📜 <strong>Export PDF</strong> : téléchargez vos fiches de personnage en PDF avec un style personnalisé.</li>
      <li>🎨 <strong>Personnalisation visuelle</strong> : accédez à plus d’options de thèmes, cadres et polices.</li>
      <li>🧙‍♂️ <strong>Contenus exclusifs</strong> : accédez en avant-première à de nouveaux systèmes de jeu, outils MJ et effets audio.</li>
      <li>📅 <strong>Planification MJ</strong> : créez des événements avec rappels automatiques par e-mail pour vos joueurs.</li>
    </ul>
    <div className="premium-price-box">
      <p><strong>3€/mois</strong> – sans engagement</p>
      <p style={{ fontSize: "0.9em" }}>
        Ce soutien contribue directement au développement et à l’hébergement de l’application.
      </p>
      <button onClick={handleSubscribe} className="subscribe-button" disabled={loading}>
        {loading ? "Redirection vers Stripe..." : "S’abonner maintenant"}
      </button>
    </div>
  </>
      )}
    </div>
  );
}
