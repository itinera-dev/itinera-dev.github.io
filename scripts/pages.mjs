// Checks the built site for what a reader, or an agent, would find missing: a
// page that was not built, a page with nothing in it, a page without its
// Markdown copy or sharing image, and a link or image that leads nowhere.
//
// The pages that must exist are worked out here from content/, not from the
// site's own code, so a page the code forgot is caught too.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { book, contentDirectory, facts, projectSites, site } from '../site.config.mjs';
import { DIST, fileFor, findPages } from './serve.mjs';

const problems = [];

const markdownFiles = (directory) =>
	(existsSync(join(contentDirectory, directory)) ? readdirSync(join(contentDirectory, directory)) : [])
		.filter((name) => name.endsWith('.md'))
		.map((name) => name.replace(/\.md$/, ''));

const sitePages = markdownFiles('').map((slug) =>
	slug === 'index'
		? { page: '/', copy: '/index.md', image: '/og/index.png' }
		: { page: `/${slug}/`, copy: `/${slug}.md`, image: `/og/${slug}.png` },
);
const postPages = markdownFiles('news').map((slug) => ({ page: `/news/${slug}/`, copy: `/news/${slug}.md`, image: `/og/news/${slug}.png` }));
const expected = [...sitePages, ...postPages];
const files = ['/404.html', '/llms.txt', '/news/feed.xml', '/sitemap-index.xml', '/robots.txt', '/favicon.svg', '/apple-touch-icon.png'];

const built = await findPages();
for (const { page, copy, image } of expected) {
	if (!built.includes(page)) problems.push(`${page} was not built.`);
	if (!existsSync(fileFor(copy))) problems.push(`${page} has no Markdown copy at ${copy}.`);
	if (!existsSync(fileFor(image))) problems.push(`${page} has no sharing image at ${image}.`);
}
for (const file of files) {
	if (!existsSync(fileFor(file))) problems.push(`${file} was not built.`);
}

// The book is published by itinera-dev/book, under /book/, and the
// specification lives on GitHub, so neither is in this build. Links into them
// are checked against src/data/linked.json, which lists their pages and files.
const linked = JSON.parse(readFileSync(new URL('../src/data/linked.json', import.meta.url), 'utf8'));
const bookPages = new Set(linked.book.pages);
const specFiles = new Set(linked.spec.files);
const inTheBook = (path) => path.startsWith(book);
const inAProjectSite = (path) => projectSites.some((prefix) => path.startsWith(prefix));
const specPrefix = `${facts.spec}/blob/${facts['spec-ref']}/`;

/** Checks a link into the specification, found on `page`. */
function checkSpecLink(page, url) {
	if (!url.startsWith(`${facts.spec}/blob/`)) return;
	links += 1;
	if (!url.startsWith(specPrefix)) {
		problems.push(`${page} links to ${url}, not at the specification's ref {{spec-ref}}.`);
		return;
	}
	const file = url.slice(specPrefix.length).split('#')[0];
	if (!specFiles.has(file)) problems.push(`${page} links to ${file} of the specification, which src/data/linked.json does not list.`);
}

const ids = new Map();
const idsOf = (file) => {
	if (!ids.has(file)) {
		const html = readFileSync(file, 'utf8');
		ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id)));
	}
	return ids.get(file);
};

let links = 0;

/** Checks one link to a path of this site, found on `page` (whose file is `file`). */
function checkLink(page, file, url) {
	const [path, fragment] = url.split('#');
	if (inAProjectSite(path)) return;
	links += 1;
	if (path === '' && fragment !== undefined) {
		if (!idsOf(file).has(fragment)) problems.push(`${page} links to #${fragment}, which is not on the page.`);
		return;
	}
	if (inTheBook(path)) {
		if (!bookPages.has(path)) problems.push(`${page} links to ${url}, which src/data/linked.json does not list as a page of the book.`);
		return;
	}
	const target = fileFor(path);
	if (!existsSync(target)) {
		problems.push(`${page} links to ${url}, which was not built.`);
	} else if (fragment && target.endsWith('.html') && !idsOf(target).has(fragment)) {
		problems.push(`${page} links to ${url}, and there is no "${fragment}" on that page.`);
	}
}

const htmlPages = [...built.map((page) => ({ page, file: fileFor(page) })), { page: '/404.html', file: join(DIST, '404.html') }];

for (const { page, file } of htmlPages) {
	const html = readFileSync(file, 'utf8');

	const headings = html.match(/<h1[\s>]/g)?.length ?? 0;
	if (headings !== 1) problems.push(`${page} has ${headings} level 1 headings; it must have one.`);

	const main = /<main[^>]*>([\s\S]*)<\/main>/.exec(html)?.[1] ?? '';
	if (main.replace(/<[^>]+>/g, '').trim().length < 40) problems.push(`${page} has nothing in its main landmark.`);

	for (const [, attribute, url] of html.matchAll(/\s(href|src|srcset)="([^"]*)"/g)) {
		if (url.startsWith('data:') || url.startsWith('//')) continue;
		if (url.startsWith(`${site}/`)) {
			checkLink(page, file, url.slice(site.length));
			continue;
		}
		if (/^[a-z][a-z0-9+.-]*:/i.test(url)) {
			checkSpecLink(page, url);
			continue;
		}
		if (!url.startsWith('/') && !url.startsWith('#')) {
			problems.push(`${page} has the relative ${attribute} "${url}"; links on the site are absolute.`);
			continue;
		}
		checkLink(page, file, url);
	}

	const image = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
	if (page !== '/404.html' && (!image?.startsWith(`${site}/`) || !existsSync(fileFor(image.slice(site.length))))) {
		problems.push(`${page} names the sharing image ${image ?? 'nothing'}, which was not built.`);
	}
}

// The Markdown copies and llms.txt link to the site by full address, for
// agents that fetch them on their own.
const textFiles = [...expected.map(({ copy }) => copy), '/llms.txt'];
for (const text of textFiles) {
	const content = readFileSync(fileFor(text), 'utf8');
	if (/\]\(\/(?!\/)/.test(content)) problems.push(`${text} has a link that is not a full address.`);
	for (const [, url] of content.matchAll(/\]\((https:\/\/itinera-dev\.github\.io[^)\s]*)\)/g)) {
		checkLink(text, fileFor(text), url.slice(site.length));
	}
	for (const [, url] of content.matchAll(/\]\((https:\/\/github\.com[^)\s]*)\)/g)) checkSpecLink(text, url);
}

if (problems.length > 0) {
	console.error(`\n${problems.length} problem(s) with the built site:\n`);
	for (const problem of problems) console.error(`  ${problem}`);
	process.exit(1);
}
console.log(
	`\nAll ${expected.length} expected pages were built, each with its Markdown copy and sharing image; each has one h1 and a body, and all ${links} links within the site, into the book and into the specification resolve.`,
);
