import { ReactNode } from "react";
import "./UnfoldingMenu.scss";

interface UnfoldingMenuProps {
  content: ReactNode;
}

export default function UnfoldingMenu({ content }: UnfoldingMenuProps) {
  return <div className="unfold-menu">
    {content}
    </div>;
}
