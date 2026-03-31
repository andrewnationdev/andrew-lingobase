import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface IMarkdown {
  content: string;
}

export default function MarkdownViewerComponent(props: IMarkdown) {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
      <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
        {props.content || "No content available."}
      </ReactMarkdown>
    </div>
  );
}
