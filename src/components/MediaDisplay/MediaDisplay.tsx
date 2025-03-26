import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./MediaDisplay.scss";

interface MediaDisplayProps {
  tableId: string;
  API_URL: string;
  isGameMaster: boolean;
}

export default function MediaDisplay({ tableId, API_URL, isGameMaster }: MediaDisplayProps) {
  const [media, setMedia] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState<string | null>(null);

  const socketRef = useRef(io(API_URL, { autoConnect: false }));
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!socketRef.current.connected) socketRef.current.connect();
    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinTable", tableId);
    });

    socketRef.current.on("newMedia", (mediaUrl: string) => {
      setDisplayedText(null);
      setMedia(mediaUrl);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    });

    socketRef.current.on("newText", ({ textContent }) => {
      setMedia(null);
      setDisplayedText(textContent);
    });

    socketRef.current.on("removeMedia", () => {
      setMedia(null);
      setDisplayedText(null);
    });

    return () => {
      socketRef.current.disconnect();
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
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
              transformOrigin: "top left",
              transition: isDragging ? "none" : "transform 0.1s ease-out",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />

          <div className="zoom-controls">
            <button onClick={() => setZoom((z) => Math.min(z + 0.1, 5))}>+</button>
            <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.1))}>-</button>
          </div>
        </div>
      ) : displayedText ? (
        <p className="displayed-text">{displayedText}</p>
      ) : (
        <p></p>
      )}

      {(media || displayedText) && isGameMaster && (

        <button className="remove-btn" onClick={removeDisplayedMedia}>
         <i className="fa-solid fa-x" />
        </button>
      )}
    </div>
  );
}
