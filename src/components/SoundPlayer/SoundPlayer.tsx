import "./SoundPlayer.scss";


export default function SoundPlayer () {
    return (
        <div className="sound-player">
            <div className="sound-player__music">
            <i className="fa-solid fa-music"></i>
            </div>

            <div className="sound-weather">
            <i className="fa-solid fa-cloud-bolt"></i>
            </div>

            <div className="sound-player__effects">
            <i className="fa-solid fa-volume-high"></i>
            </div>

            <div className="sound-player__soundscape">
            <i className="fa-solid fa-ear-listen"></i>
            </div>
        </div>
    )
}