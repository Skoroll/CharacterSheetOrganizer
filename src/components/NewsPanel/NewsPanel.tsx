import { useNavigate } from "react-router-dom";
import "./NewsPanel.scss";
import WhatsNew from "../../assets/Article/WhatsNew.json";

export default function NewsPanel () {
    const navigate = useNavigate();
  
    const handleClick = (index: number) => {
      navigate(`/news?article=${index}`);
    };
  
    return (
      <div className="news-panel">
        <h2>Actualité</h2>
        <ul>
          {WhatsNew.map((what, index) => (
            <li key={index} onClick={() => handleClick(index)} style={{ cursor: "pointer" }}>
              <div>
              <p className="news-panel--title">{what.title}</p>
              <p className="news-panel--more"><i>En savoir +</i></p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  