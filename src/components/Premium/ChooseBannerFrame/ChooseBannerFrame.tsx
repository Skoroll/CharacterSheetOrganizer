import runes from "../../../assets/Border/2231391c-17b0-4c79-8b12-8536c82980a4.png";
import lierre from "../../../assets/Border/50ac1bc9-3c05-4d56-bd25-292422c098ae.png";
import parchemin from "../../../assets/Border/5da0865d-de4e-464f-810a-28980ecf9039.png";
import planche from "../../../assets/Border/62b28667-6643-418f-b5c0-5b07380ab39f.png";
import pierre from "../../../assets/Border/b6c4d595-6162-4008-888b-615403828be4.png";
import mer from "../../../assets/Border/c653afab-792e-445d-a0f1-ddf0a192b950.png";

import "./ChooseBannerFrame.scss";

interface ChooseBannerFrameProps {
  selectedFrame: string;
  setSelectedFrame: (value: string) => void;
}

export const frameOptions: { [key: string]: string } = {
  runes,
  lierre,
  parchemin,
  planche,
  pierre,
  mer,
};

export default function ChooseBannerFrame({
  selectedFrame,
  setSelectedFrame,
}: ChooseBannerFrameProps) {
  return (
    <div className="choose-frame">
      <label className="choose-frame__form">
        Cadre
        <select
          value={selectedFrame || ""}
          onChange={(e) => setSelectedFrame(e.target.value)}
        >
          <option value="">-- Aucun cadre --</option>
          {Object.entries(frameOptions).map(([key, _]) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
