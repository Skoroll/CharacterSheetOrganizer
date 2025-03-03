import { ReactNode, useState } from "react";
import { FC } from "react";

import "./Collapses.scss";

interface CollapsesProps {
  title: string;
  content: ReactNode;
}

const Collapses: FC<CollapsesProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`collapse ${isOpen ? "open " : ""}`}>
      <div className="collapse__heading" onClick={toggleCollapse}>
        <h3 className="collapse__heading--title">{title}</h3>
      </div>
      {isOpen && <div className="collapse__content">{content}</div>}
    </div>
  );
};

export default Collapses;
