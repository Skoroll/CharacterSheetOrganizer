import React from "react";
import "./ToolTip.scss";

interface ToolTipProps {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
  classTooltip?: string
}

const ToolTip: React.FC<ToolTipProps> = ({ text, position = "top", children, classTooltip }) => {
  return (
    <div className={`tooltip-wrapper tooltip-${position} ${classTooltip}`}>
      {children}
      <span className="tooltip-text">{text}</span>
    </div>
  );
};

export default ToolTip;
