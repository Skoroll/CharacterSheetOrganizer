import Articles from "../../components/Articles/Articles";
import AuthForm from "../../components/AuthForm/AuthForm";
import "./Landing.scss";



export default function Landing () {
    return (
        <div className="landing">
            <AuthForm />
            <Articles
                contentWidth="100%"
                flexDir="row"/>
        </div>
    )
}