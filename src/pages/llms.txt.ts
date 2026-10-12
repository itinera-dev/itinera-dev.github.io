// /llms.txt: what Itinera is, in a few lines, and where an agent finds the rest,
// following the llms.txt convention. Every page is listed by its Markdown copy.

import type { APIRoute } from 'astro';

import { book, facts, site } from '../../site.config.mjs';
import { pages } from '../lib/content.ts';
import { LANGUAGES } from '../lib/includes.ts';
import { DESCRIPTION, MISSION, SLOGAN, VISION } from '../lib/message.ts';

const link = (title: string, url: string, about: string) => `- [${title}](${url}): ${about}`;

export const GET: APIRoute = () => {
	const spec = `${facts.spec}/blob/${facts['spec-ref']}`;
	const released = LANGUAGES.filter((language) => language.state !== 'planned');
	const lines = [
		'# Itinera',
		'',
		`> ${DESCRIPTION} ${SLOGAN}`,
		'',
		`Vision: ${VISION}`,
		'',
		`Mission: ${MISSION}`,
		'',
		'Code on this site is pseudo-Rust, an illustration. Real, compiled code is in the book, and what Itinera does is defined only by the specification.',
		'',
		'## The site',
		'',
		...pages().map((page) => link(page.title, `${site}${page.markdownPath}`, page.description)),
		'',
		'## The book',
		'',
		...released.map((language) =>
			link(`The ${language.name} book`, `${site}${language.book}`, `Itinera taught in ${language.name}, every example a complete program that compiles and runs.`),
		),
		'',
		'## Specification and conformance',
		'',
		link('Concepts', `${spec}/spec/01-concepts.md`, 'The vocabulary: steps, workflows, policies, hooks, lifecycles, executors, journeys. Read it first.'),
		link('The specification', `${spec}/spec/README.md`, 'What every implementation must do, in observable terms.'),
		link('VISION.md', `${spec}/VISION.md`, 'Why Itinera exists, its principles and what it is not.'),
		link('PROCESS.md', `${spec}/PROCESS.md`, 'How features are proposed, specified, implemented and released.'),
		link('The conformance suite', `${facts.conformance}/tree/${facts['conformance-ref']}`, 'The cases every implementation runs, as data.'),
		'',
		'## Languages',
		'',
		...released.map((language) =>
			link(language.name, language.repository ?? '', `The ${language.name} implementation. API reference: ${language.api}${language.state === 'released' ? '' : ', once published'}.`),
		),
		...LANGUAGES.filter((language) => language.state === 'planned').map((language) => `- ${language.name}: planned.`),
		'',
		'## Optional',
		'',
		link('News feed', `${site}/news/feed.xml`, 'Releases and specification versions, as an Atom feed.'),
		link('Book index', `${site}${book}`, 'Every edition of the book.'),
		'',
	];
	return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
