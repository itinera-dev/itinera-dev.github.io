// The Markdown copy of every page, at its address with `.md` appended: /why.md
// for /why/, and /index.md for the home page. Agents read text, not markup.

import type { APIRoute, GetStaticPaths } from 'astro';

import { markdownCopy, pages, type Page } from '../lib/content.ts';

export const getStaticPaths = (() => pages().map((page) => ({ params: { slug: page.slug }, props: { page } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
	new Response(markdownCopy((props as { page: Page }).page), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
