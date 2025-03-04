import Articles from "../../components/Articles/Articles";
import "./Landing.scss";



export default function Landing () {
    return (
        <div className="landing">
            <Articles
                contentWidth="100%"
                flexDir="row"/>
        </div>
    )
}