import { useRef, useState, useEffect } from "react";
import "./Helper.scss";

interface HelperProp {
  content: { text: string }[];
  target?: string;
}

export default function Helper({ content }: HelperProp) {
  const [position, setPosition] = useState<"top" | "bottom" | "left" | "right">("top");
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = iconRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const spaceTop = rect.top;
      const spaceBottom = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.right;

      if (spaceBottom > 150) setPosition("bottom");
      else if (spaceTop > 150) setPosition("top");
      else if (spaceRight > 150) setPosition("right");
      else setPosition("left");
    }
  }, []);

  return (
    <div className="helper" ref={iconRef} tabIndex={0}>
      <i className="fa-solid fa-question" />
      <div className={`helper__tooltip helper__tooltip--${position}`}>
        {content.map((para, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: para.text }} />
        ))}
      </div>
    </div>
  );
}
