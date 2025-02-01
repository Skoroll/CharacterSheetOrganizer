import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";


export default function Home(){
    const navigate = useNavigate();
    
    useEffect(() =>{
        const token = localStorage.getItem("token");
        if (token){
            navigate("/menu")
        }
    })
    
    return(
        <>
            <AuthForm />
        </>
    )
}