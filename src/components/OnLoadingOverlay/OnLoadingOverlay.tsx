import { BeatLoader } from "react-spinners";
import "./OnLoadingOverlay.scss"

export default function OnLoadingOverlay({
  message = "",
  color = "#36d7b7",
}: {
  message?: string;
  color?: string;
}) {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <BeatLoader color={color} />
        <p>{message}</p>
      </div>
    </div>
  );
}
