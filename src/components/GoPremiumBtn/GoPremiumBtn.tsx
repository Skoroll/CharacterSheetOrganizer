import { useNavigate } from "react-router-dom";
import "./GoPremiumBtn.scss"

export default function GoPremiumBtn () {
    const navigate = useNavigate();

    return(
        <button 
            onClick={() => navigate("/premium")}
            className="go-premium"
        >
            <i className="fa-solid fa-crown"/>
            Passez premium


        </button>
    )
}