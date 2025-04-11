import { useEffect } from "react";
import articles from "../../assets/Article/Blog.json";
import "./Articles.scss"



export default function Blog () {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

    return (
        <div className="news">
          <h2>Articles</h2>
          {articles.map((article, index) => (
  <div
    className="news__article"
    key={index}
    id={article.title.toLowerCase().replace(/\s+/g, "-")}
  >
    <h3>{article.title}</h3>
    <h4>{article.subtitle}</h4>
    <p dangerouslySetInnerHTML={{ __html: article.content }}></p>
  </div>
))}

        </div>
      );
}



