// The news as an Atom feed, newest first.

import type { APIRoute } from 'astro';

import { site } from '../../../site.config.mjs';
import { posts } from '../../lib/content.ts';

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
	const all = posts();
	// A feed with no post still needs an updated date: the day the site started.
	const updated = `${all[0]?.date ?? '2026-10-12'}T00:00:00Z`;
	const entries = all.map(
		(post) => `	<entry>
		<title>${escape(post.title)}</title>
		<link href="${site}${post.path}"/>
		<id>${site}${post.path}</id>
		<updated>${post.date}T00:00:00Z</updated>
		<summary>${escape(post.description)}</summary>
	</entry>`,
	);
	const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
	<title>Itinera news</title>
	<subtitle>Releases, specification versions and new languages.</subtitle>
	<link href="${site}/news/feed.xml" rel="self"/>
	<link href="${site}/news/"/>
	<id>${site}/news/</id>
	<updated>${updated}</updated>
	<author><name>Itinera</name></author>
${entries.join('\n')}
</feed>
`;
	return new Response(feed, { headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' } });
};
