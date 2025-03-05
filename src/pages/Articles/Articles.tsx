import News from "./News";
import Blog from "./Blog";

interface ArticlesProps {
    flexDir: "row" | "column";
    contentWidth: string;
}


export default function Articles({ flexDir, contentWidth }: ArticlesProps) {
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
