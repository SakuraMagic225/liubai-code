import type { IArticleHeading } from '../types';

export function slugifyHeading(text: string, index = 0) {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `heading-${index + 1}`;
}

export function extractMarkdownHeadings(content: string): IArticleHeading[] {
  const headings: IArticleHeading[] = [];
  const lines = content.split('\n');

  lines.forEach((line) => {
    const match = /^(##|###)\s+(.+)$/.exec(line.trim());
    if (!match) {
      return;
    }

    const text = match[2].replace(/[#*_`[\]()]/g, '').trim();
    if (!text) {
      return;
    }

    headings.push({
      id: slugifyHeading(text, headings.length),
      text,
      level: match[1].length as 2 | 3,
    });
  });

  return headings;
}

export const extractHeadings = extractMarkdownHeadings;
