import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./SoundBoard.scss";

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL);

// 🛠 Définition des types pour les objets musicThemes et soundScape
interface SoundLibrary {
    [key: string]: string[]; // Clé de type string, valeur un tableau de string (URLs des sons)
}

const musicThemes: SoundLibrary = {
    "Calme": ["/sounds/calm1.mp3", "/sounds/calm2.mp3"],
    "Combat": ["/sounds/combat1.mp3", "/sounds/combat2.mp3"],
    "Exploration": ["/sounds/explo1.mp3", "/sounds/explo2.mp3"]
};

const soundScape: SoundLibrary = {
    "Ville": ["/sounds/ville1.mp3", "/sounds/ville2.mp3"],
    "Forêt": ["/sounds/foret1.mp3", "/sounds/foret2.mp3"],
    "Montagne": ["/sounds/montagne1.mp3", "/sounds/montagne2.mp3"],
    "Grotte": ["/sounds/grotte1.mp3", "/sounds/grotte2.mp3"],
    "Mer": ["/sounds/mer1.mp3", "/sounds/mer2.mp3"]
};

export default function SoundBoard() {
    const [openTheme, setOpenTheme] = useState<string | null>(null);
    const [currentMusic, setCurrentMusic] = useState<string | null>(null);
    const [currentAmbience, setCurrentAmbience] = useState<string | null>(null);

    useEffect(() => {
        socket.on("playMusic", (track: string) => {
            setCurrentMusic(track);
        });

        socket.on("playAmbience", (track: string) => {
            setCurrentAmbience(track);
        });

        return () => {
            socket.off("playMusic");
            socket.off("playAmbience");
        };
    }, []);

    const handleThemeClick = (theme: string) => {
        setOpenTheme(openTheme === theme ? null : theme);
    };

    const playMusic = (track: string) => {
        setCurrentMusic(track);
        socket.emit("playMusic", track);
    };

    const playAmbience = (track: string) => {
        setCurrentAmbience(track);
        socket.emit("playAmbience", track);
    };

    return (
        <div className="gm-tool soundboard">
            <div className="soundboard__theme-bar">
                <h3>Musiques</h3>
                <ul>
                    {Object.keys(musicThemes).map((theme: string) => (
                        <li key={theme} onClick={() => handleThemeClick(theme)}>
                            {theme}
                            {openTheme === theme && (
                                <div className="soundboard__tracks">
                                    {musicThemes[theme]?.map((track: string, index: number) => (
                                        <button key={index} onClick={() => playMusic(track)}>
                                            🎵 {`Musique ${index + 1}`}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <h3>Ambiances</h3>
                <ul>
                    {Object.keys(soundScape).map((theme: string) => (
                        <li key={theme} onClick={() => handleThemeClick(theme)}>
                            {theme}
                            {openTheme === theme && (
                                <div className="soundboard__tracks">
                                    {soundScape[theme]?.map((track: string, index: number) => (
                                        <button key={index} onClick={() => playAmbience(track)}>
                                            🔊 {`Ambiance ${index + 1}`}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Player pour la musique */}
            {currentMusic && (
                <div className="player-container">
                    <h4>🎵 Musique</h4>
                    <H5AudioPlayer
                        src={currentMusic}
                        autoPlay
                        volume={0.8}
                        showJumpControls={false}
                        layout="horizontal"
                    />
                </div>
            )}

            {/* Player pour l'ambiance */}
            {currentAmbience && (
                <div className="player-container">
                    <h4>🔊 Ambiance</h4>
                    <H5AudioPlayer
                        src={currentAmbience}
                        autoPlay
                        volume={0.6}
                        showJumpControls={false}
                        layout="horizontal"
                    />
                </div>
            )}
        </div>
    );
}
