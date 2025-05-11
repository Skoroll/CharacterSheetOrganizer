import runicFrame from "../../../assets/Border/2231391c-17b0-4c79-8b12-8536c82980a4.png";
import plantFrame from "../../../assets/Border/50ac1bc9-3c05-4d56-bd25-292422c098ae.png";
import scrollFrame from "../../../assets/Border/5da0865d-de4e-464f-810a-28980ecf9039.png";
import plankFrame from "../../../assets/Border/62b28667-6643-418f-b5c0-5b07380ab39f.png";
import stoneFrame from "../../../assets/Border/b6c4d595-6162-4008-888b-615403828be4.png";
import seaFrame from "../../../assets/Border/c653afab-792e-445d-a0f1-ddf0a192b950.png";

import "./ChooseBannerFrame.scss";

interface ChooseBannerFrameProps {
  selectedFrame: string;
  setSelectedFrame: (value: string) => void;
}

export default function ChooseBannerFrame({
  selectedFrame,
  setSelectedFrame,
}: ChooseBannerFrameProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFrame(e.target.value);
  };

  return (
    <div className="choose-frame">
      <label className="choose-frame__form">
        Cadre
        <select value={selectedFrame || ""} onChange={handleChange}>
  <option value="">-- Aucun cadre --</option>
  <option value={runicFrame}>Runes</option>
  <option value={plantFrame}>Lierre</option>
  <option value={scrollFrame}>Parchemin</option>
  <option value={plankFrame}>Planche</option>
  <option value={stoneFrame}>Pierre</option>
  <option value={seaFrame}>Mer</option>
</select>

      </label>
    </div>
  );
}

