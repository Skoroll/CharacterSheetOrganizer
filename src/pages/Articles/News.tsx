import news from "../../assets/Article/WhatsNew.json";

export default function NewsDisplay() {
  return (
    <div className="news">
      <h2>Nouveautés</h2>
      {news.map((article, index) => (
        <div 
          className="news__article"
          key={index}>
        <h3>{article.title}</h3>
        <h4>{article.subtitle}</h4>
        <p dangerouslySetInnerHTML={{__html: article.content}}></p>
        </div>
      ))}
    </div>
  );
}
