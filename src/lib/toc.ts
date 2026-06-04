import GithubSlugger from 'github-slugger';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

const HEADING_RE = /^(#{1,6})\s+(.+?)\s*#*$/;
const FENCE_RE = /^(```|~~~)/;

/** Strips inline markdown so the text matches the heading's rendered content. */
function stripInline(input: string): string {
  return input
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~]+/g, '')
    .trim();
}

/**
 * Extracts a table of contents from markdown. Every heading is fed to the
 * slugger (not just the collected levels) so the duplicate-suffix counter
 * stays identical to rehype-slug, guaranteeing the anchors line up.
 */
export function extractToc(markdown: string, minLevel = 2, maxLevel = 3): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim();

    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = HEADING_RE.exec(line);
    if (!match) continue;

    const level = match[1].length;
    const text = stripInline(match[2]);
    const id = slugger.slug(text);

    if (level >= minLevel && level <= maxLevel && text) {
      items.push({ id, text, level });
    }
  }

  return items;
}
