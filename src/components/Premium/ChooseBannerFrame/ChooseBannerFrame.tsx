import { useState } from "react";
import frame1 from "../../../assets/Border/2231391c-17b0-4c79-8b12-8536c82980a4.png";
import frame2 from "../../../assets/Border/50ac1bc9-3c05-4d56-bd25-292422c098ae.png";
import "./ChooseBannerFrame.scss";

export default function ChooseBannerFrame() {
  const [selectedFrame, setSelectedFrame] = useState<string>(frame1);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFrame(e.target.value);
  };

  return (
    <div className="choose-frame">
      <label>
        Cadre
        <select value={selectedFrame} onChange={handleChange}>
          <option value={frame1}>Frame 1</option>
          <option value={frame2}>Frame 2</option>
        </select>
      </label>

      <div className="frame-preview">
        <img src={selectedFrame} alt="Cadre selectionné" />
      </div>
    </div>
  );
}
