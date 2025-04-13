import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // 👈
import articles from "../../assets/Article/Blog.json";
import "./Articles.scss";

export default function Blog() {
  const location = useLocation(); // 👈
  const [selectedCategory, setSelectedCategory] = useState("general");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["general", "player", "gm"].includes(hash)) {
        setSelectedCategory(hash);
      }
    };


  
    handleHashChange(); // pour l'initialisation
    window.addEventListener("hashchange", handleHashChange);
  
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (["general", "player", "gm"].includes(hash)) {
      setSelectedCategory(hash);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]); 
  const filteredArticles = articles.filter(
    (article) => article.category === selectedCategory
  );

  return (
    <div className="news">
      <h2>Besoin d'aide ?</h2>

      <div className="news__filters">
        <button
          className={selectedCategory === "general" ? "active" : ""}
          onClick={() => {
            setSelectedCategory("general");
            window.history.replaceState(null, "", "#general");
          }}
        >
          Le site
        </button>
        <button
          className={selectedCategory === "player" ? "active" : ""}
          onClick={() => {
            setSelectedCategory("player");
            window.history.replaceState(null, "", "#player");
          }}
        >
          Joueur
        </button>
        <button
          className={selectedCategory === "gm" ? "active" : ""}
          onClick={() => {
            setSelectedCategory("gm");
            window.history.replaceState(null, "", "#gm");
          }}
        >
          Maître de jeu
        </button>
      </div>

      {filteredArticles.map((article, index) => (
        <div className="news__article" key={index}>
          <h3>{article.title}</h3>
          {article.subtitle && <h4>{article.subtitle}</h4>}
          <p 
            className="news__article--text"
            dangerouslySetInnerHTML={{ __html: article.content }}></p>
        </div>
      ))}
    </div>
  );
}
