import articles from "../assets/Article/Blog.json";

export const tutorialSections = articles.map((article) => ({
  label: article.title,
  anchor: article.title.toLowerCase().replace(/\s+/g, "-"),
}));
