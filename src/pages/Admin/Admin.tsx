import AdminArticles from "../../components/Admin/AdminArticles/AdminArticles"
import AdminLogs from "../../components/Admin/AdminLogs/AdminLogs"
import AdminTodo from "../../components/Admin/AdminTodo/AdminToDo"
import Collapse from "../../components/Collapse/Collapse"
import { CollapseGroup } from "../../Context/CollapseGroup"

export default function Admin () {
    return (
        <div className="admin">
            <CollapseGroup>
                <Collapse
                    title="Todo"
                    content={<AdminTodo/>}
                    id="1"
                />
                                <Collapse
                    title="Articles"
                    content={<AdminArticles/>}
                    id="2"
                />
            </CollapseGroup>

            <AdminLogs/>


        </div>
    )
}