import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface IMarkdown {
  content: string;
}

export default function MarkdownViewerComponent(props: IMarkdown) {
  return (
    <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      <div 
        className="custom-scrollbar"
        style={{ 
          width: '100%', 
          overflowX: 'auto', 
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '1rem' 
        }}
      >
        <div 
          className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
          style={{ minWidth: 'max-content', width: '100%' }}
        >
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {props.content || "No content available."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}