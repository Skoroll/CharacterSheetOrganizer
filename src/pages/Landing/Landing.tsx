import { useEffect } from "react";
import "./Landing.scss";
import News from "../Articles/News";
import Welcome from "../../components/Welcome/Welcome";
import HomePromoSide from "../../components/HomePromo/HomePromoSide/HomePromoSide";


export default function Landing () {
    useEffect(() => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }, []);


    return (
        <div className="landing">
          <div className="landing__top">
            <Welcome />
            <HomePromoSide/>
          </div>
            <News />
        </div>
    )
}