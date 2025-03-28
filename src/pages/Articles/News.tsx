import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import news from "../../assets/Article/WhatsNew.json";

export default function NewsDisplay() {
  const location = useLocation();
  const articleIndex = new URLSearchParams(location.search).get("article");

  const articleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (articleIndex && articleRefs.current[+articleIndex]) {
      articleRefs.current[+articleIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  }, [articleIndex]);

  return (
    <div className="news">
      <h2>Nouveautés</h2>
      {news.map((article, index) => (
        <div
          className="news__article"
          key={index}
          ref={(el) => (articleRefs.current[index] = el)}
        >
          <h3>{article.title}</h3>
          <h4>{article.subtitle}</h4>
          <p dangerouslySetInnerHTML={{ __html: article.content }}></p>
        </div>
      ))}
    </div>
  );
}
