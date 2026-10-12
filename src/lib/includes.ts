// What a page may include as `<!-- include: name -->`: Markdown made at build
// time from the site's data, so facts such as versions and colours are written
// in one place and every page that shows them agrees.

import languages from '../data/languages.json';
import { BRAND_FILES } from './brand.ts';
import { AA_NON_TEXT, AA_TEXT, ratio, schemes } from './colour.mjs';
import { posts } from './content.ts';
import { DESCRIPTION } from './logo.mjs';
import { MISSION, VISION } from './message.ts';

export interface Language {
	id: string;
	name: string;
	/** `planned`, `preparing` (a version is being prepared and is not published), or `released`. */
	state: 'planned' | 'preparing' | 'released';
	version?: string;
	tier?: number;
	/** The execution modes of its executors, its capabilities: `synchronous`, `asynchronous`. */
	executors?: string[];
	package?: string;
	install?: string;
	/** What else installing needs to say, such as how to get every capability. */
	installNote?: string;
	repository?: string;
	book?: string;
	api?: string;
	manifest?: string;
}

export const LANGUAGES = languages as Language[];

const list = (items: string[]) =>
	items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** A language's capabilities, in words: "synchronous and asynchronous executors". */
const capitalised = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const capabilities = (language: Language) =>
	`${list(language.executors ?? [])} ${(language.executors ?? []).length === 1 ? 'executor' : 'executors'}`;

function version(language: Language): string {
	if (language.state === 'planned') return 'Planned';
	if (language.state === 'preparing') return `${language.version}, in preparation, not published yet`;
	return language.version ?? '';
}

/** One row per language. */
function languagesTable(): string {
	const rows = LANGUAGES.map((language) =>
		language.state === 'planned'
			? `| ${language.name} | Planned | Not yet | Not yet | Not yet |`
			: `| [${language.name}](/languages/#${language.id}) | ${version(language)} | Tier ${language.tier} | ${capitalised(capabilities(language))} | [The ${language.name} book](${language.book}) |`,
	);
	return ['| Language | Version | Tier | Capabilities | Book |', '|---|---|---|---|---|', ...rows].join('\n');
}

/** A section per language that has a version. */
function languagesDetails(): string {
	return LANGUAGES.filter((language) => language.state !== 'planned')
		.map((language) => {
			const published = language.state === 'released';
			const lines = [
				`## ${language.name}`,
				'',
				published
					? `${language.name} ${language.version} claims tier ${language.tier}, with ${capabilities(language)}.`
					: `${language.name} ${language.version} is in preparation, and not on its package registry yet. It will claim tier ${language.tier}, with ${capabilities(language)}.`,
				'',
				`- **Install,** ${published ? '' : 'once it is published, '}with \`${language.install}\`${language.installNote ? `, ${language.installNote}` : ''}.`,
				`- **The book:** [the ${language.name} edition](${language.book}), starting at [Quick start](${language.book}quick-start/).`,
				`- **API reference:** [${language.api?.replace(/^https:\/\//, '')}](${language.api})${published ? '' : ', once the package is published'}.`,
				`- **Source:** [${language.repository?.replace(/^https:\/\/github\.com\//, '')}](${language.repository}).`,
				`- **What it claims:** its [conformance manifest](${language.manifest}) lists every proposal it implements and the conformance cases it runs. ${
					published ? 'Its release carries the conformance report that proves it.' : 'Its first release will carry the conformance report that proves it.'
				}`,
			];
			return lines.join('\n');
		})
		.join('\n\n');
}

/** The line under the home page's hero that says what can be used today. */
function status(): string {
	const lines = LANGUAGES.filter((language) => language.state !== 'planned').map((language) =>
		language.state === 'preparing'
			? `${language.name} ${language.version} is in preparation and not published yet.`
			: `Latest release: ${language.name} ${language.version}, tier ${language.tier}.`,
	);
	return `**Status:** ${lines.join(' ')}`;
}

/** Who implements tier 1, and where each stands, as a sentence. */
function implementations(): string {
	const parts = LANGUAGES.filter((language) => language.state !== 'planned').map((language) =>
		language.state === 'preparing'
			? `${language.name} ${language.version} implements it, and is in preparation`
			: `${language.name} ${language.version} implements it`,
	);
	return parts.length === 0 ? 'No language implements it yet.' : `${list(parts)}.`;
}

/** The posts, newest first, or a sentence saying there are none yet. */
function newsList(): string {
	const all = posts();
	if (all.length === 0) {
		return 'Nothing has been announced yet. The first post will be the first published release.';
	}
	return all.map((post) => `- ${post.date}: [${post.title}](${post.path}). ${post.description}`).join('\n');
}

const colourNames: Record<string, string> = {
	paper: 'Paper, the page',
	'paper-raised': 'Raised paper, panels and inline code',
	ink: 'Ink, headings',
	'ink-body': 'Body ink, the text',
	'ink-muted': 'Muted ink, captions and labels',
	accent: 'Green, the logo and links',
	'accent-strong': 'Deep green, focus and hover',
	'caution-ink': 'Amber, planned and pseudo-Rust',
};

/** Each colour of each scheme, with its contrast against that scheme's page. */
function brandColours(): string {
	const rows = Object.entries(colourNames).map(([token, name]) => {
		const cells = (['light', 'dark'] as const).map((scheme) => {
			const colour = schemes[scheme][token];
			if (token === 'paper') return `\`${colour}\``;
			return `\`${colour}\`, ${ratio(colour, schemes[scheme].paper).toFixed(2)} to 1`;
		});
		return `| ${name} | ${cells[0]} | ${cells[1]} |`;
	});
	return [
		'| Colour | Light scheme, against its page | Dark scheme, against its page |',
		'|---|---|---|',
		...rows,
	].join('\n') + `\n\nText needs at least ${AA_TEXT} to 1 against what it sits on, and other marks, such as the logo and the focus ring, at least ${AA_NON_TEXT} to 1.`;
}

export const includes: Record<string, () => string> = {
	'languages-table': languagesTable,
	'languages-details': languagesDetails,
	status,
	implementations,
	'logo-description': () => DESCRIPTION,
	'news-list': newsList,
	'brand-colours': brandColours,
	'brand-files': () => BRAND_FILES.map((file) => `- [${file.name}.svg](/brand/${file.name}.svg): ${file.label}.`).join('\n'),
	vision: () => `> ${VISION}`,
	mission: () => `> ${MISSION}`,
};
