import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ✅ Créer une instance Axios avec l'URL de base
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Fonction pour récupérer le token du `localStorage`
export const getToken = () => localStorage.getItem("token");

// ✅ Ajouter un intercepteur pour inclure le token dans chaque requête
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Intercepteur de réponse pour rafraîchir le token automatiquement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.warn("📌 Axios a détecté une erreur :", error.response?.status);

    if (error.response?.status === 401) {
      console.error("🔥 Suppression des tokens dans 5 secondes à cause d'une erreur 401 !");
      
      setTimeout(() => {
        console.error("🔥 Suppression des tokens en cours...");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirection vers la connexion
      }, 5000); // 5 secondes de délai avant suppression

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const addLog = (message: string) => {
  const logs = JSON.parse(localStorage.getItem("debugLogs") || "[]");
  logs.push(message);
  localStorage.setItem("debugLogs", JSON.stringify(logs));
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    addLog(`📌 Axios a détecté une erreur : ${error.response?.status}`);

    if (error.response?.status === 401) {
      addLog("🔥 Suppression des tokens à cause d'une erreur 401 !");
      
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // Redirection vers la connexion

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// ✅ Fonction pour rafraîchir le token
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("Aucun refresh token disponible");
    const response = await axios.post(`${API_URL}/api/users/refresh-token`, {
      refreshToken,
    });

    const { accessToken, newRefreshToken } = response.data;
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  } catch (error) {
    console.error("❌ Erreur lors du rafraîchissement du token :", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

// ✅ Fonction pour connecter un utilisateur
export const loginUser = async (name: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, {
      name,
      password,
    });
    if (!response.data.accessToken || !response.data.user) {
      throw new Error("Réponse invalide du serveur (aucun token reçu).");
    }

    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("user", JSON.stringify({
      id: response.data.user.id, // 🔥 Stocke l'ID utilisateur correctement
      name: response.data.user.name,
      selectedCharacterName: response.data.user.selectedCharacterName || "",
      isAdmin: response.data.user.isAdmin,
    }));

    return response.data;
  } catch (error: any) {
    console.error("❌ Erreur lors de la connexion :", error.response?.data || error);
    return null;
  }
};

