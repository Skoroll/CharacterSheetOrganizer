interface FrameOverlayProps {
  frameSrc: string;
  alt?: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function FrameOverlay({
  frameSrc,
  alt = "Cadre sélectionné",
  width = "260px",
  height = "260px",
  className = "",
}: FrameOverlayProps) {
  return (
    <img
      className={`frame-overlay ${className}`}
      src={frameSrc}
      alt={alt}
      style={{ width, height }}
    />
  );
}
