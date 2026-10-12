// The Markdown copy of every post, at its address with `.md` appended.

import type { APIRoute, GetStaticPaths } from 'astro';

import { markdownCopy, posts, type Page } from '../../lib/content.ts';

export const getStaticPaths = (() => posts().map((post) => ({ params: { post: post.slug }, props: { post } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
	new Response(markdownCopy((props as { post: Page }).post), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
