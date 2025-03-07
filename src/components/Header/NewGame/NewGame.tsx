import { useNavigate } from "react-router-dom";


export default function NewGame () {
    const navigate = useNavigate();

    const menuOptions = 
    [
        {
            name: "Parties précédentes",
            goTo: "/partie-precedentes"
         }, 
         {
            name: "Créer une partie",
            goTo: "/creer-partie"
        }, 
        {
            name: "Rejoindre une partie",
            goTo: "/rejoindre"
        }
    ]

    return (
        <div className="new-game">
            <ul>
                {menuOptions.map(({name, goTo}, index) => (
                    <li key={index} onClick={() => navigate(`${goTo}`)}>
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
