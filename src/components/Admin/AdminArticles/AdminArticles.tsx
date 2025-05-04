import { useEffect, useState } from "react";
import "./AdminArticles.scss";

interface Article {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  category: string;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState<Omit<Article, "_id">>({
    title: "",
    subtitle: "",
    content: "",
    category: "news",
  });
  const [editId, setEditId] = useState<string | null>(null);

  const fetchArticles = async () => {
    const res = await fetch(import.meta.env.VITE_API_URL + "/api/articles");
    const data = await res.json();
    setArticles(data);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.subtitle || !form.content || !form.category) {
      alert("Tous les champs sont requis");
      return;
    }

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${import.meta.env.VITE_API_URL}/api/articles/${editId}`
      : `${import.meta.env.VITE_API_URL}/api/articles`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ title: "", subtitle: "", content: "", category: "news" });
      setEditId(null);
      fetchArticles();
    } else {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;

    const res = await fetch(
      import.meta.env.VITE_API_URL + `/api/articles/${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      fetchArticles();
    }
  };

  return (
    <div className="admin-articles">
      <h2>{editId ? "Modifier un article" : "Créer un article"}</h2>
    <div className="admin-articles__creation">
      <div className="admin-articles__creation--stack">
      <select
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value.toLowerCase() })
        }
      >
        <option value="news">News</option>
        <option value="tuto">Tutoriel</option>
      </select>

      <input
        type="text"
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Sous-titre"
        value={form.subtitle}
        onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
      />
      </div>
      <textarea
        placeholder="Contenu"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      ></textarea>

      <button onClick={handleSubmit}>{editId ? "Enregistrer" : "Créer"}</button>
      </div>


      <h2>Articles existants</h2>
      <ul>
        {articles.map((article) => (
          <li key={article._id}>
            <strong>
              [{article.category}] {article.title}
            </strong>{" "}
            - {article.subtitle}
            <br />
            <small>{article.content}</small>
            <br />
            <button
              onClick={() => {
                setForm({
                  title: article.title,
                  subtitle: article.subtitle,
                  content: article.content,
                  category: article.category,
                });
                setEditId(article._id);
              }}
            >
              <i className="fa-solid fa-pen" />
            </button>
            <button onClick={() => handleDelete(article._id)}>
              <i className="fa-solid fa-trash" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
