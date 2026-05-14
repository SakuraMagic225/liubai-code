import type { IArticleHeading } from '../types';

export function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[`~!@#$%^&*()+=\\[\]{}|;:'",.<>/?]/g, '')
    .replace(/\s+/g, '-');
}

export function extractHeadings(content: string): IArticleHeading[] {
  return content
    .split('\n')
    .map((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());

      if (!match) {
        return null;
      }

      const text = match[2].replace(/`/g, '').trim();

      return {
        id: slugifyHeading(text),
        text,
        level: match[1].length as 2 | 3,
      };
    })
    .filter((heading): heading is IArticleHeading => Boolean(heading));
}
