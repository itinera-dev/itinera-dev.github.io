// /robots.txt: everything here may be read, and the sitemap is at the site's
// own address, so it follows the domain in site.config.mjs.

import type { APIRoute } from 'astro';

import { site } from '../../site.config.mjs';

export const GET: APIRoute = () =>
	new Response(
		[
			'# Everything on this site is meant to be read, by people and by agents.',
			'# Agents may prefer /llms.txt, and the Markdown copy of every page.',
			'',
			'User-agent: *',
			'Allow: /',
			'',
			`Sitemap: ${site}/sitemap-index.xml`,
			'',
		].join('\n'),
		{ headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
	);
