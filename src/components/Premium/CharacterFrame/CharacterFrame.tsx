import "./CharacterFrame.scss";
import frame from "../../../assets/Border/b6c4d595-6162-4008-888b-615403828be4.png"

export default function CharacterFrame () {
    return (
        <img 
        src={frame} 
        alt="Cadre de pesonnage" 
        className="character-frame" />
    )
}