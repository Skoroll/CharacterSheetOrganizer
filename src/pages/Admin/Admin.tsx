import AdminArticles from "../../components/Admin/AdminArticles/AdminArticles";
import AdminLogs from "../../components/Admin/AdminLogs/AdminLogs";
import AdminTodo from "../../components/Admin/AdminTodo/AdminToDo";
import "./Admin.scss";
export default function Admin() {
  return (
    <div className="admin">
      <AdminLogs />
      <div className="admin__split">
        {<AdminTodo />}
        <AdminArticles />
      </div>
    </div>
  );
}
