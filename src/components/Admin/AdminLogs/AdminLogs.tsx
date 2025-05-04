// components/Admin/AdminLogs/AdminLogs.tsx
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

export default function AdminLogs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Récupérer l'historique au chargement
    fetch(import.meta.env.VITE_API_URL + "/api/admin/logs", {
      headers: {
        "x-admin": "true", // exemple sécurité (à améliorer selon ton auth)
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs);
      });

    // Ecouter les logs en live
    socket.on("log", (log: string) => {
      setLogs((prev) => [...prev.slice(-499), log]); // Limiter à 500
    });

    return () => {
      socket.off("log");
    };
  }, []);

  return (
    <div className="admin-logs">
      <h2>Logs serveur (Live)</h2>
      <div className="admin-logs__container">
        {logs.map((log, index) => (
          <div key={index} className="admin-logs__log">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
