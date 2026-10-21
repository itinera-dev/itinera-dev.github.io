// What the checks share: the built pages, served over HTTP as GitHub Pages
// serves them, and the list of every page that was built.
//
// The pages are served rather than opened from disk because they link their
// styles and each other by absolute path, which a file:// URL cannot resolve,
// and an unstyled page passes colour checks it would fail in a browser.

import { existsSync } from 'node:fs';
import { readFile, readdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, relative } from 'node:path';

import { references } from '../site.config.mjs';

export const DIST = join(process.cwd(), 'dist');

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json',
	'.md': 'text/markdown; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.woff2': 'font/woff2',
};

/** The directory of the API references, which TypeDoc writes rather than this site. */
const REFERENCES = join(DIST, 'api');

/** Every built page's path, such as `/why/`, in order, leaving out the API references. */
export async function findPages(dir = DIST) {
	const pages = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === '_astro' || full === REFERENCES) continue;
			pages.push(...(await findPages(full)));
		} else if (entry.name === 'index.html') {
			const path = relative(DIST, dir).split('\\').join('/');
			pages.push(path === '' ? '/' : `/${path}/`);
		}
	}
	return pages.sort();
}

/** The kinds of page TypeDoc writes, each in a directory of its own. */
const REFERENCE_KINDS = ['modules', 'classes', 'interfaces', 'functions', 'types', 'variables'];

/** The first page of a directory, by name, and its largest, which holds the most markup. */
async function samplesOf(directory) {
	const names = (await readdir(directory)).filter((name) => name.endsWith('.html')).sort();
	const sizes = await Promise.all(names.map(async (name) => (await stat(join(directory, name))).size));
	const largest = names[sizes.indexOf(Math.max(...sizes))];
	return [...new Set([names[0], largest])].filter((name) => name !== undefined);
}

/**
 * A sample of the API references' pages: for the newest release, at each
 * reference's path, and for `next/`, the front page and, of each kind of
 * page, the first and the largest. Checking every page of an edition takes
 * close to ten minutes, and the frozen editions of older releases are left
 * out, since they can never change to pass a newer check.
 */
export async function findReferencePages() {
	const pages = [];
	for (const reference of references) {
		for (const edition of ['', 'next/']) {
			const root = join(DIST, reference.path, edition);
			if (!existsSync(join(root, 'index.html'))) continue;
			pages.push(`${reference.path}${edition}`);
			for (const kind of REFERENCE_KINDS.filter((kind) => existsSync(join(root, kind)))) {
				for (const name of await samplesOf(join(root, kind))) pages.push(`${reference.path}${edition}${kind}/${name}`);
			}
		}
	}
	return pages;
}

/** The file a URL path names in the built site. */
export function fileFor(path) {
	const inside = decodeURIComponent(path);
	return inside.endsWith('/') ? join(DIST, inside, 'index.html') : join(DIST, inside);
}

/** Serves the built site until `close` is called. */
export async function serve() {
	const server = createServer(async (request, response) => {
		const file = fileFor((request.url ?? '/').split('?')[0]);
		try {
			const body = await readFile(file);
			response.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
			response.end(body);
		} catch {
			response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
			response.end(await readFile(join(DIST, '404.html')).catch(() => 'not found'));
		}
	});
	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
	const address = server.address();
	const origin = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`;
	return { origin, close: () => new Promise((resolve) => server.close(resolve)) };
}

/**
 * Waits until a page's diagrams, if it has any, are drawn in the given colour
 * scheme: `src/scripts/diagrams.ts` draws them in the browser after the page
 * has loaded, and again when the scheme changes. Fails when they could not be
 * drawn.
 */
export async function diagramsDrawn(page, scheme) {
	const state = await page.waitForFunction(
		(wanted) => {
			const state = document.documentElement.dataset.diagrams;
			return (state === undefined || state === wanted || state === 'failed') && (state ?? 'none');
		},
		scheme,
	);
	if ((await state.jsonValue()) === 'failed') throw new Error(`${page.url()}: the diagrams could not be drawn; the browser console says why.`);
}
