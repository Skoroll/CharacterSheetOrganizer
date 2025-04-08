import { useEffect } from "react";
import "./Landing.scss";
import News from "../Articles/News";
import Welcome from "../../components/Welcome/Welcome";


export default function Landing () {
    useEffect(() => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }, []);


    return (
        <div className="landing">
            <Welcome />
            <News />
        </div>
    )
}