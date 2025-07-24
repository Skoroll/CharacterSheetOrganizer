import { BeatLoader } from "react-spinners";
import "./LoadingComp.scss"

export default function LoadingComp() {
    return (
        <div className="loading-component">
            <div className="loading-component__inside">
                <div className="loading-component__inside--beatloader">
                    <BeatLoader/>
                </div>
            </div>
        </div>
    )
}