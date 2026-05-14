import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { slugifyHeading } from '../../utils/markdown';

interface MarkdownRendererProps {
  content: string;
}

function getPlainText(children: unknown): string {
  if (Array.isArray(children)) {
    return children.map(getPlainText).join('');
  }

  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  return '';
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <article className="article-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={{
          h2({ children }) {
            const text = getPlainText(children);

            return <h2 id={slugifyHeading(text)}>{children}</h2>;
          },
          h3({ children }) {
            const text = getPlainText(children);

            return <h3 id={slugifyHeading(text)}>{children}</h3>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
