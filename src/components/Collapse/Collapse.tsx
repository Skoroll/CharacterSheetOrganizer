import { useState, useRef, useEffect } from "react";
import { useCollapseGroup } from "../../Context/CollapseGroup";
import "./Collapse.scss";

interface CollapseProps {
  title: string;
  content: React.ReactNode;
  id: string;
}

export default function Collapse({ title, content, id }: CollapseProps) {
  const { openKey, setOpenKey } = useCollapseGroup();
  const isOpen = openKey === id;

  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setMaxHeight("0px");
      }
    }
  }, [isOpen]);

  return (
    <div className="collapse">
      <div
        className="collapse__header"
        onClick={() => setOpenKey(isOpen ? null : id)}
      >
        <span>{title}</span>
        <i
          className={`fa-solid fa-chevron-${isOpen ? "up" : "down"} ${
            isOpen ? "rotated" : ""
          }`}
        ></i>
      </div>
      <div
        className="collapse__content"
        style={{
          maxHeight,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
        ref={contentRef}
      >
        {content}
      </div>
    </div>
  );
}

