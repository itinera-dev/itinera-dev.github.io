// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import { contentDirectory, site } from './site.config.mjs';

/**
 * Reloads the dev server's pages when a page's Markdown changes.
 *
 * The pages read content/ with `fs` rather than importing it, so Vite would
 * never notice an edit. A file added or removed changes which pages exist,
 * which Astro works out once, so that restarts the server instead.
 *
 * @returns {import('vite').Plugin}
 */
function watchTheContent() {
	return {
		name: 'itinera-site:watch',
		apply: 'serve',
		configureServer(server) {
			server.watcher.add(contentDirectory);
			/** @param {string} file */
			const inTheContent = (file) => file.startsWith(contentDirectory);
			server.watcher.on('change', (file) => {
				if (inTheContent(file)) server.ws.send({ type: 'full-reload', path: '*' });
			});
			server.watcher.on('add', (file) => inTheContent(file) && server.restart());
			server.watcher.on('unlink', (file) => inTheContent(file) && server.restart());
		},
	};
}

export default defineConfig({
	site,
	trailingSlash: 'always',
	build: { format: 'directory' },
	integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
	vite: {
		plugins: [watchTheContent()],
		// Mermaid is large, and is fetched only by a page that has a diagram.
		build: { chunkSizeWarningLimit: 1000 },
	},
});
