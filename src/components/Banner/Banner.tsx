import { useEffect, useState } from "react";
import "./Banner.scss";

interface BannerProps {
    tableId: string;
    API_URL: string;
    refreshTrigger: number;
}

const Banner = ({ tableId, API_URL, refreshTrigger }: BannerProps) => {
    const [bannerData, setBannerData] = useState({
        bannerImage: "",
        borderWidth: "0px",
        borderColor: "#000000",
        bannerStyle: "normal",
    });

    useEffect(() => {
        const fetchTableStyle = async () => {
            try {
                const response = await fetch(`${API_URL}/api/tabletop/tables/${tableId}`);
                if (!response.ok) throw new Error("Erreur lors du chargement des styles");

                const data = await response.json();
                console.log("📸 Image reçue :", data.bannerImage);

                setBannerData({
                    bannerImage: data.bannerImage ? `${API_URL}${data.bannerImage}` : "",
                    borderWidth: data.borderWidth,
                    borderColor: data.borderColor,
                    bannerStyle: data.bannerStyle,
                });

            } catch (error) {
                console.error("❌ Erreur chargement style :", error);
            }
        };

        fetchTableStyle();
    }, [tableId, API_URL, refreshTrigger]); // ✅ Re-render quand refreshTrigger change

    return (
        <div
            className="banner"
            style={{
                backgroundImage: bannerData.bannerImage ? `url(${bannerData.bannerImage})` : "none",
                border: bannerData.bannerImage ? `${bannerData.borderWidth} solid ${bannerData.borderColor}` : "none",
                borderRadius: bannerData.bannerStyle === "rounded" ? "20px" : "0px",
                boxShadow: bannerData.bannerStyle === "shadow" ? "5px 5px 10px rgba(0,0,0,0.3)" : "none",
                height: bannerData.bannerImage ? "450px" : "auto", // ✅ Applique la hauteur UNIQUEMENT si une image est présente
                transition: "height 0.3s ease-in-out",
            }}
        >
        </div>
    );
};

export default Banner;
