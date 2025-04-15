import { useEffect, useRef, useState } from "react";
import NpcDetailsModal from "../GmToolKit/Npcs/NpcDetailsModal";
import { io } from "socket.io-client";
import "./MediaDisplay.scss";
import { Npc } from "../../types/Npc";
interface MediaDisplayProps {
  tableId: string;
  API_URL: string;
  isGameMaster: boolean;
}

export default function MediaDisplay({
  tableId,
  API_URL,
  isGameMaster,
}: MediaDisplayProps) {
  const [npcsToDisplay, setNpcsToDisplay] = useState<any[]>([]);
  const [media, setMedia] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState<string | null>(null);
  const [font, setFont] = useState("inherit");
  const [color, setColor] = useState("#000000");
  const [isBG, setIsBG] = useState(true);
  const [selectedNpc, setSelectedNpc] = useState<Npc | null>(null);
  const socketRef = useRef(io(API_URL, { autoConnect: false }));
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket.connected) socket.connect();

    socket.emit("joinTable", tableId);

    const handleNpc = (npc: any) => {
      setNpcsToDisplay((prev) =>
        prev.some((p) => p._id === npc._id) ? prev : [...prev, npc]
      );
    };

    socket.on("sendNpcToDisplay", handleNpc);

    socket.on("newMedia", (mediaUrl: string) => {
      setDisplayedText(null);
      setMedia(mediaUrl);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    });

    socket.on("newText", ({ textContent, textFont, textColor, isBG }) => {
      setMedia(null);
      setDisplayedText(textContent);
      setFont(textFont || "inherit");
      setColor(textColor || "#000000");
      setIsBG(isBG !== false);
    });

    socket.on("removeMedia", () => {
      setMedia(null);
      setDisplayedText(null);
    });

    return () => {
      socket.off("sendNpcToDisplay", handleNpc);
      socket.disconnect();
    };
  }, [tableId]);

  const removeDisplayedMedia = () => {
    if (!socketRef.current.connected) return;
    socketRef.current.emit("removeMedia", { tableId });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prevZoom) => Math.max(0.1, Math.min(prevZoom + delta, 5)));
    };

    container.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      container.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartDrag({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startDrag.x,
      y: e.clientY - startDrag.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="media-container">
      {media ? (
        <div
          className="zoom-wrapper"
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            overflow: "hidden",
            cursor: isDragging ? "grabbing" : "grab",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <img
            ref={imgRef}
            src={media}
            alt="Contenu média"
            style={{
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${
                offset.y / zoom
              }px)`,
              transformOrigin: "top left",
              transition: isDragging ? "none" : "transform 0.1s ease-out",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />

          <div className="zoom-controls">
            <button onClick={() => setZoom((z) => Math.min(z + 0.1, 5))}>
              +
            </button>
            <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.1))}>
              -
            </button>
          </div>
        </div>
      ) : displayedText ? (
        <p
          className={`displayed-text ${isBG ? "bg-scroll" : "bg-dark"}`}
          style={{ fontFamily: font, color }}
        >
          {displayedText}
        </p>
      ) : (
        <p></p>
      )}

      {npcsToDisplay.length > 0 && (
        <div className="npc-display-list">
          {npcsToDisplay.map((npc, index) => (
            <div
              key={index}
              className="npc-card"
              onClick={() => setSelectedNpc(npc)}
            >
              {npc.image && (
                <img src={npc.image} alt={npc.name} className="npc-img" />
              )}
              <p>{npc.name}</p>
            </div>
          ))}
        </div>
      )}

      <div className="remove-btn-wrapper">
        {(media || displayedText) && isGameMaster && (
          <button className="remove-doc-btn" onClick={removeDisplayedMedia}>
            <i className="fa-solid fa-x" />
          </button>
        )}
        {npcsToDisplay.length > 0 && isGameMaster && (
          <button
            className="remove-npc-btn"
            onClick={() => setNpcsToDisplay([])}
          >
            <i className="fa-solid fa-users-slash" />
          </button>
        )}
      </div>
      {selectedNpc && (
        <NpcDetailsModal
          npc={selectedNpc}
          onClose={() => setSelectedNpc(null)}
          
        />
      )}
    </div>
  );
}
