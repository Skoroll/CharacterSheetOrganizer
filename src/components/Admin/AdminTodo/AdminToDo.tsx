import { useEffect, useState } from "react";
import Collapse from "../../Collapse/Collapse";
import Modal from "../../Modal/Modal";
import "./AdminToDo.scss";

interface Todo {
  _id: string;
  category: string;
  title: string;
  description: string;
  isDone: boolean;
  dateDone: string;
}

export default function AdminTodo() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [deleteTodo, setDeleteTodo] = useState<Todo | null>(null);

  function slugify(str: string) {
    return str
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  }

  const fetchTodos = async () => {
    const res = await fetch(import.meta.env.VITE_API_URL + "/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!category || !title || !description)
      return alert("Tous les champs sont requis");

    const res = await fetch(import.meta.env.VITE_API_URL + "/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category, title, description }),
    });

    if (res.ok) {
      setCategory("");
      setTitle("");
      setDescription("");
      fetchTodos();
    } else {
      alert("Erreur lors de l'ajout");
    }
  };

  const handleValidateTodo = async (todo: Todo, isDone: boolean) => {
    const res = await fetch(
      import.meta.env.VITE_API_URL + `/api/todos/${todo._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isDone,
          dateDone: isDone ? new Date().toISOString() : null,
        }),
      }
    );

    if (res.ok) {
      setSelectedTodo(null);
      fetchTodos();
    } else {
      alert("Erreur lors de la modification");
    }
  };

  const confirmDeleteTodo = async () => {
    if (!deleteTodo) return;

    const res = await fetch(
      import.meta.env.VITE_API_URL + `/api/todos/${deleteTodo._id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      setDeleteTodo(null);
      fetchTodos();
    } else {
      alert("Erreur lors de la suppression");
    }
  };

  const handleEditTodo = async () => {
    if (!editTodo) return;

    const res = await fetch(
      import.meta.env.VITE_API_URL + `/api/todos/${editTodo._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTodo.title,
          description: editTodo.description,
          category: editTodo.category,
        }),
      }
    );

    if (res.ok) {
      setEditTodo(null);
      fetchTodos();
    } else {
      alert("Erreur lors de la modification");
    }
  };

  const todosNotDone = todos.filter((todo) => !todo.isDone);
  const todosDone = todos.filter((todo) => todo.isDone);

  const groupedTodosNotDone = todosNotDone.reduce((acc, todo) => {
    if (!acc[todo.category]) acc[todo.category] = [];
    acc[todo.category].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  const groupedTodosDone = todosDone.reduce((acc, todo) => {
    if (!acc[todo.category]) acc[todo.category] = [];
    acc[todo.category].push(todo);
    return acc;
  }, {} as Record<string, Todo[]>);

  return (
    <div className="admin-todo">
      <h2>Créer une nouvelle tâche</h2>
      <div className="admin-todo__form">
        <div className="admin-todo__form--onSide">
          <input
            type="text"
            placeholder="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button onClick={handleAddTodo}>Ajouter la tâche</button>
      </div>
      <h2>À faire</h2>
      {Object.entries(groupedTodosNotDone).map(([category, todos]) => (
        <Collapse
          key={category}
          id={`category-${slugify(category)}`}
          title={category}
          content={
            <ul>
              {todos.map((todo) => (
                <li key={todo._id}>
                  <div className="todo-list__header">
                    <div className="todo-list__header--options">
                      <button onClick={() => handleValidateTodo(todo, true)}>
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button onClick={() => setEditTodo(todo)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => setDeleteTodo(todo)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <span className="todo-list__header--title">
                      {todo.title}
                    </span>
                  </div>
                  <span className="todo-list__desc">{todo.description}</span>
                </li>
              ))}
            </ul>
          }
        />
      ))}

      <h2>Fait</h2>
      {Object.entries(groupedTodosDone).map(([category, todos]) => (
        <Collapse
          key={category}
          id={`done-category-${slugify(category)}`}
          title={category}
          content={
            <ul>
              {todos.map((todo) => (
                <li key={todo._id}>
                  <div className="todo-list__header">
                    <div className="todo-list__header--options">
                      <button onClick={() => handleValidateTodo(todo, false)}>
                        <i className="fa-solid fa-rotate-left"></i>
                      </button>
                      <button onClick={() => setEditTodo(todo)}>
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button onClick={() => setDeleteTodo(todo)}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <span className="todo-list__header--date-done">
                      {new Date(todo.dateDone).toLocaleDateString()}
                    </span>
                    <span className="todo-list__header--title">
                      {todo.title}
                    </span>
                  </div>
                  <span className="todo-list__desc">{todo.description}</span>
                </li>
              ))}
            </ul>
          }
        />
      ))}

      {selectedTodo && (
        <Modal
          title="Valider cette tâche"
          onClose={() => setSelectedTodo(null)}
        >
          <p>Valider cette tâche ?</p>
          <p>
            <strong>{selectedTodo.title}</strong> - {selectedTodo.description}
          </p>
          <div className="todo-edit--btns">
            <button onClick={() => setSelectedTodo(null)}>Annuler</button>
            <button onClick={() => handleValidateTodo(selectedTodo, true)}>
              Valider
            </button>
          </div>
        </Modal>
      )}

      {editTodo && (
        <Modal title="Modifier la tâche" onClose={() => setEditTodo(null)}>
          <div className="todo-edit">
            <input
              type="text"
              value={editTodo.title}
              onChange={(e) =>
                setEditTodo({ ...editTodo, title: e.target.value })
              }
            />
            <textarea
              value={editTodo.description}
              onChange={(e) =>
                setEditTodo({ ...editTodo, description: e.target.value })
              }
            ></textarea>
            <input
              type="text"
              value={editTodo.category}
              onChange={(e) =>
                setEditTodo({ ...editTodo, category: e.target.value })
              }
            />
            <div className="todo-edit--btns">
              <button onClick={() => setEditTodo(null)}>Annuler</button>
              <button onClick={handleEditTodo}>Enregistrer</button>
            </div>
          </div>
        </Modal>
      )}

      {deleteTodo && (
        <Modal
          title="Supprimer cette tâche"
          onClose={() => setDeleteTodo(null)}
        >
          <p>Voulez-vous vraiment supprimer cette tâche ?</p>
          <p>
            <strong>{deleteTodo.title}</strong> - {deleteTodo.description}
          </p>
          <div className="todo-edit--btns">
            <button onClick={() => setDeleteTodo(null)}>Annuler</button>
            <button onClick={confirmDeleteTodo}>Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
