import { useEffect } from "react";
import News from "./News";
import Blog from "./Blog";

interface ArticlesProps {
  flexDir: "row" | "column";
  contentWidth: string;
}

export default function Articles({ flexDir, contentWidth }: ArticlesProps) {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  const styleComp = {
    flexDirection: flexDir,
    width: contentWidth,
  };

  return (
    <div style={styleComp} className="articles-container">
      <News />
      <Blog />
    </div>
  );
}
