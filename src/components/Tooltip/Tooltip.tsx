import React, { useRef, useEffect, useState } from "react";
import "./ToolTip.scss";

interface ToolTipProps {
  text: string | { text: string }[];
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  classTooltip?: string;
}

const ToolTip: React.FC<ToolTipProps> = ({ text, position = "top", children, classTooltip }) => {
  const tooltipRef = useRef<HTMLSpanElement | null>(null);
  const [shouldFlip, setShouldFlip] = useState(false);

  useEffect(() => {
    const tooltipEl = tooltipRef.current;
    if (tooltipEl) {
      const { right } = tooltipEl.getBoundingClientRect();
      if (right > window.innerWidth - 10) {
        setShouldFlip(true);
      }
    }
  }, []);

  return (
    <div className={`tooltip-wrapper tooltip-${position} ${classTooltip}`}>
      {children}
      <span
        ref={tooltipRef}
        className={`tooltip-text ${shouldFlip ? "tooltip--flipped" : ""}`}
      >
        {Array.isArray(text) ? (
          text.map((entry, i) => (
            <span key={i}>
              <span dangerouslySetInnerHTML={{ __html: entry.text }} />
              <br />
            </span>
          ))
        ) : (
          text
        )}
      </span>
    </div>
  );
};

export default ToolTip;
