// The site's pages, read from content/: one Markdown file per page, and one per
// post under content/news/. Each file starts with a front matter block naming
// its title and description. A page's Markdown is its single source: the HTML
// page and its Markdown copy for agents are both made from it.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { contentDirectory, facts, site } from '../../site.config.mjs';
import { includes } from './includes.ts';

export interface Page {
	/** The file name without `.md`: `why`, or `index` for the home page. */
	slug: string;
	/** The page's address on the site: `/why/`, `/news/a-post/`, or `/` for the home page. */
	path: string;
	/** The address of its Markdown copy: `/why.md`, `/news/a-post.md`, or `/index.md`. */
	markdownPath: string;
	/** The file, relative to content/. */
	file: string;
	title: string;
	description: string;
	/** For a post, the day it was published, as `YYYY-MM-DD`. */
	date?: string;
	/** For a post, when it was published, in UTC: its date, at the time its front matter gives or at midnight. */
	published?: string;
}

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n/;

/** The front matter's `key: value` lines. Values are plain text, one line each. */
function frontMatter(source: string, file: string): Record<string, string> {
	const block = FRONT_MATTER.exec(source)?.[1];
	if (block === undefined) throw new Error(`content/${file}: it has no front matter.`);
	return Object.fromEntries(
		block.split('\n').map((line) => {
			const separator = line.indexOf(':');
			if (separator === -1) throw new Error(`content/${file}: the front matter line "${line}" is not "key: value".`);
			return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
		}),
	);
}

function read(file: string): string {
	return readFileSync(join(contentDirectory, file), 'utf8').replace(/\r\n/g, '\n');
}

function pageOf(file: string, path: string, markdownPath: string): Page {
	const fields = frontMatter(read(file), file);
	for (const required of ['title', 'description']) {
		if (!fields[required]) throw new Error(`content/${file}: the front matter has no ${required}.`);
	}
	const slug = file.replace(/^news\//, '').replace(/\.md$/, '');
	const date = fields.date;
	if (file.startsWith('news/') && !/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
		throw new Error(`content/${file}: a post needs a date, written YYYY-MM-DD.`);
	}
	const time = fields.time ?? '00:00';
	if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error(`content/${file}: a post's time is written HH:MM, in UTC.`);
	const published = date === undefined ? undefined : `${date}T${time}:00Z`;
	return { slug, path, markdownPath, file, title: fields.title, description: fields.description, date, published };
}

// content/news/ may not exist before the first post: git keeps no empty directory.
const markdownFiles = (directory: string) =>
	(existsSync(join(contentDirectory, directory)) ? readdirSync(join(contentDirectory, directory)) : [])
		.filter((name) => name.endsWith('.md'))
		.sort();

/** The order pages are listed in, in llms.txt; a page not named here follows them. */
const ORDER = ['index', 'why', 'languages', 'specification', 'releases', 'roadmap', 'contribute', 'news', 'brand', 'accessibility'];
const rank = (page: Page) => (ORDER.includes(page.slug) ? ORDER.indexOf(page.slug) : ORDER.length);

/** Every page but the posts, in the order of `ORDER`. */
export function pages(): Page[] {
	return markdownFiles('')
		.map((name) => {
			const slug = name.replace(/\.md$/, '');
			return slug === 'index' ? pageOf(name, '/', '/index.md') : pageOf(name, `/${slug}/`, `/${slug}.md`);
		})
		.sort((a, b) => rank(a) - rank(b));
}

/** Every post, the newest first; posts of one day are ordered by their time. */
export function posts(): Page[] {
	return markdownFiles('news')
		.map((name) => {
			const slug = name.replace(/\.md$/, '');
			return pageOf(`news/${name}`, `/news/${slug}/`, `/news/${slug}.md`);
		})
		.sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''));
}

/** The page whose file name is `slug`. */
export function page(slug: string): Page {
	const found = pages().find((candidate) => candidate.slug === slug);
	if (!found) throw new Error(`There is no page content/${slug}.md.`);
	return found;
}

/**
 * A page's Markdown, without its front matter, with every {{fact}} and
 * `<!-- include: name -->` replaced. A name that is not known fails the build.
 */
export function markdown(page: Page): string {
	const body = read(page.file).replace(FRONT_MATTER, '');
	const known: Record<string, string> = facts;
	return body
		.replace(/\{\{([a-z-]+)\}\}/g, (_, name: string) => {
			if (!(name in known)) throw new Error(`content/${page.file}: there is no fact {{${name}}}.`);
			return known[name];
		})
		.replace(/<!-- include: ([a-z-]+) -->/g, (_, name: string) => {
			const include = includes[name];
			if (!include) throw new Error(`content/${page.file}: there is nothing to include named "${name}".`);
			return include();
		});
}

/**
 * The Markdown copy of a page, for agents: its Markdown with every link made
 * absolute, so the copy reads the same wherever it is fetched from, each
 * pseudo-Rust block labelled as on the page, and a last line naming the page
 * it copies.
 */
export function markdownCopy(page: Page): string {
	const absolute = markdown(page)
		.replace(/\]\(\//g, `](${site}/`)
		.replace(/^([ \t]*)((?:```|~~~)rust\b.*)$/gm, (_, indent: string, fence: string) =>
			`${indent}Pseudo-Rust: an illustration, not a program. Real, compiled code is in the book: ${site}/book/rust/\n\n${indent}${fence}`,
		);
	return `${absolute.trim()}\n\n---\n\nThis is the Markdown copy of ${site}${page.path}, made from the same source.\n`;
}
