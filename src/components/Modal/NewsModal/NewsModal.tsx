import { useEffect, useState } from "react";
import Modal from "../Modal";
//newsPopups utilisé provisoirement pour les articles du pop up 
import { newsPopups } from "./newsData";

export default function NewsModal() {
  const [visibleNews, setVisibleNews] = useState<typeof newsPopups[0] | null>(null);

  useEffect(() => {
    const unseenNews = newsPopups.find(
      (n) => localStorage.getItem(n.variableName) !== "true"
    );
    if (unseenNews) setVisibleNews(unseenNews);
  }, []);

  const handleClose = () => {
    if (visibleNews) {
      localStorage.setItem(visibleNews.variableName, "true");
      setVisibleNews(null);
    }
  };

  if (!visibleNews) return null;

  return (
    <Modal title={visibleNews.name} onClose={handleClose}>
      <div dangerouslySetInnerHTML={{ __html: visibleNews.content }} />
      <button onClick={handleClose} className="btn-primary mt-4">OK</button>
    </Modal>
  );
}
