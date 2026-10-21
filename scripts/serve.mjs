// What the checks share: the built pages, served over HTTP as GitHub Pages
// serves them, and the list of every page that was built.
//
// The pages are served rather than opened from disk because they link their
// styles and each other by absolute path, which a file:// URL cannot resolve,
// and an unstyled page passes colour checks it would fail in a browser.

import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
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

/**
 * A few pages of every edition of every API reference: its front page and
 * the first page of each kind it has. TypeDoc writes the same markup for
 * every page of a kind, so these stand for the hundreds of pages of each
 * edition, which would take too long to check one by one.
 */
export async function findReferencePages() {
	const pages = [];
	for (const reference of references) {
		const root = fileFor(reference.path).replace(/index\.html$/, '');
		if (!existsSync(root)) continue;
		const editions = ['', ...(await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => `${entry.name}/`)];
		for (const edition of editions.filter((edition) => existsSync(join(root, edition, 'index.html')))) {
			pages.push(`${reference.path}${edition}`);
			for (const kind of REFERENCE_KINDS) {
				const first = existsSync(join(root, edition, kind)) ? (await readdir(join(root, edition, kind))).filter((name) => name.endsWith('.html')).sort()[0] : undefined;
				if (first) pages.push(`${reference.path}${edition}${kind}/${first}`);
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
