import { Navigate } from "react-router-dom";
import { useUser } from "../../../Context/UserContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useUser();

  if (!user.isAuthenticated) {
    // Pas connecté → redirige vers la page d'accueil ou login
    return <Navigate to="/" replace />;
  }

  if (!user.isAdmin) {
    // Connecté mais pas admin → redirige vers accueil (ou page interdite si tu veux)
    return <Navigate to="/" replace />;
  }

  // Autorisé → affiche la page
  return <>{children}</>;
}
