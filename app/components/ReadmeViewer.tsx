'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import 'github-markdown-css/github-markdown.css';
import { useTheme } from 'next-themes';

interface ReadmeViewerProps {
  content: string;
}

export default function ReadmeViewer({ content }: ReadmeViewerProps) {
  const { theme } = useTheme();

  return (
    <div className={`repository-card overflow-hidden ${
      theme === 'dark' ? 'markdown-body-dark' : 'markdown-body'
    }`}>
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">README.md</span>
        </div>
      </div>
      <div className="p-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          className="markdown-body"
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
