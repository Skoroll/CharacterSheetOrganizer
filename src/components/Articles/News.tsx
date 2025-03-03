import news from "../../assets/Article/WhatsNew.json";

export default function NewsDisplay() {
  return (
    <div className="news">
      {news.map((article, index) => (
        <div 
          className="news__article"
          key={index}>
        <h2>{article.title}</h2>
        <h3>{article.subtitle}</h3>
        <p dangerouslySetInnerHTML={{__html: article.content}}></p>
        </div>
      ))}
    </div>
  );
}
