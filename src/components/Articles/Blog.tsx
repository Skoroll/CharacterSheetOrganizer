import articles from "../../assets/Article/Blog.json";


export default function Blog () {
    return (
        <div className="news">
          <h2>Articles</h2>
          {articles.map((article, index) => (
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



