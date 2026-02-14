import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';

export type NoteSummary = {
  slug: string;
  title: string;
  topicPath: string;
  filePath: string;
};

export type Note = NoteSummary & {
  markdown: string;
};

function titleFromMarkdown(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? null;
}

function titleFromSlug(slug: string): string {
  const leaf = slug.split('/').at(-1) ?? slug;
  return leaf
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function listNotes(): Promise<NoteSummary[]> {
  const files = await fg('notes/**/*.md', { cwd: process.cwd() });
  const summaries = await Promise.all(
    files.map(async (filePath) => {
      const fullPath = path.join(process.cwd(), filePath);
      const raw = await fs.readFile(fullPath, 'utf8');
      const parsed = matter(raw);
      const slug = filePath.replace(/^notes\//, '').replace(/\.md$/, '');
      const title =
        (typeof parsed.data.title === 'string' && parsed.data.title.trim()) ||
        titleFromMarkdown(parsed.content) ||
        titleFromSlug(slug);

      return {
        slug,
        title,
        topicPath: slug.includes('/') ? slug.split('/').slice(0, -1).join(' / ') : 'general',
        filePath,
      } satisfies NoteSummary;
    }),
  );

  return summaries.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const filePath = path.join(process.cwd(), 'notes', `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = matter(raw);

    const title =
      (typeof parsed.data.title === 'string' && parsed.data.title.trim()) ||
      titleFromMarkdown(parsed.content) ||
      titleFromSlug(slug);

    return {
      slug,
      title,
      topicPath: slug.includes('/') ? slug.split('/').slice(0, -1).join(' / ') : 'general',
      filePath: path.relative(process.cwd(), filePath),
      markdown: parsed.content,
    };
  } catch {
    return null;
  }
}
