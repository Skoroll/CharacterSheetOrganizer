import { useNavigate } from "react-router-dom";
import "./GoPremiumBtn.scss";
import type { AppUser } from "../../../types/AppUser"; 

interface GoPremiumBtnProps {
  user: AppUser;
}

export default function GoPremiumBtn({ user }: GoPremiumBtnProps) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/premium")} className={` ${user.isPremium ? "premium-badge" : "go-premium"}`} >
      
      {user?.isPremium ? (
        <span className="" title="Membre Premium">
          <i className="fa-solid fa-crown" /> Premium
        </span>
      ) : (
        <>
        <i className="fa-solid fa-crown" />
        "Passez premium"
        </>
      )}
    </button>
  );
}
