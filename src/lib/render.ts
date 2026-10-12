// Turns a page's Markdown into HTML.

import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { VFile } from 'vfile';

import { book } from '../../site.config.mjs';
import { BRAND_FILES } from './brand.ts';
import { markdown, type Page } from './content.ts';
import { rehypeDiagrams, rehypeLanding, rehypeListingNames, rehypeListings, rehypePlanned, rehypeSchemePictures, rehypeTables } from './rehype.ts';

/** The section of the home page holding the two answers to its question. */
const ANSWERS = 'one-question-two-answers';

function create(landing: boolean) {
	const processor = unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkRehype)
		// Before the highlighter, which would otherwise colour a diagram's source.
		.use(rehypeDiagrams)
		.use(rehypeListings, { book: `${book}rust/` })
		.use(rehypeShiki, {
			themes: { light: 'github-light-default', dark: 'github-dark-default' },
			defaultColor: 'light',
			langs: ['rust'],
		})
		.use(rehypeListingNames)
		.use(rehypeTables)
		.use(rehypePlanned)
		.use(rehypeSchemePictures, { dark: new Set(BRAND_FILES.map((file) => `/brand/${file.name}.svg`)) })
		.use(rehypeSlug);
	return (landing ? processor.use(rehypeLanding, { answers: ANSWERS }) : processor).use(rehypeStringify);
}

const processors = new Map<boolean, ReturnType<typeof create>>();

/**
 * Renders a page. The home page is laid out as a landing page: its hero in a
 * header, and each level 2 heading in a section of its own.
 */
export async function render(page: Page): Promise<string> {
	const landing = page.slug === 'index';
	if (!processors.has(landing)) processors.set(landing, create(landing));
	const processor = processors.get(landing)!;
	const file = new VFile({ value: markdown(page), data: { contentPath: page.file } });
	return String(await processor.process(file));
}
