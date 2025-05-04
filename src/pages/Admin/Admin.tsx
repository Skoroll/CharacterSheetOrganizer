import AdminTodo from "../../components/Admin/AdminTodo/AdminToDo"
import { CollapseGroup } from "../../Context/CollapseGroup"

export default function Admin () {
    return (
        <div className="admin">
            <CollapseGroup>
                <AdminTodo/>
            </CollapseGroup>


        </div>
    )
}