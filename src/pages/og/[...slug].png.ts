// The sharing image of every page and post: /og/why.png, /og/news/a-post.png,
// and /og/index.png for the home page, which carries the slogan.

import type { APIRoute, GetStaticPaths } from 'astro';

import { pages, posts } from '../../lib/content.ts';
import { SLOGAN } from '../../lib/message.ts';
import { sharingImage } from '../../lib/og.ts';

export const getStaticPaths = (() => [
	...pages().map((page) => ({ params: { slug: page.slug }, props: { title: page.slug === 'index' ? SLOGAN : page.title } })),
	...posts().map((post) => ({ params: { slug: `news/${post.slug}` }, props: { title: post.title } })),
]) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
	new Response(await sharingImage((props as { title: string }).title), { headers: { 'Content-Type': 'image/png' } });
