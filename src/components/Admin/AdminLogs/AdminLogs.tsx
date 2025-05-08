import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./AdminLogs.scss"

const socket = io(import.meta.env.VITE_API_URL);

export default function AdminLogs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Demander l'historique dès que le socket est prêt
    socket.emit("requestLogsHistory");

    socket.on("logsHistory", (historyLogs: string[]) => {
      setLogs(historyLogs);
    });

    socket.on("log", (log: string) => {
      setLogs((prevLogs) => [...prevLogs.slice(-499), log]);
    });

    return () => {
      socket.off("logsHistory");
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
