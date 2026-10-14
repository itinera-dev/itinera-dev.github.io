// The sharing image of every page: 1200 by 630 pixels, made at build time,
// carrying the logo, the slogan and the page's title, so a shared link shows
// what it points at. The same words are its alternative text.
//
// Satori lays the text out and turns it into shapes with the bundled Atkinson
// Hyperlegible font, so the image does not depend on the fonts of the machine
// that builds it; resvg then draws those shapes as a PNG.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

import { schemes } from './colour.mjs';
import { markSvg } from './logo.mjs';
import { SLOGAN } from './message.ts';

// Resolved from the project's root, not from this file: a build bundles this
// module somewhere else, where a relative path would point nowhere.
const font = (name: string) => readFileSync(join(process.cwd(), 'src/assets/fonts', name));
const regular = font('atkinson-regular.woff');
const bold = font('atkinson-bold.woff');

const { light } = schemes;
const mark = `data:image/svg+xml;base64,${Buffer.from(markSvg(light.accent)).toString('base64')}`;

type Node = { type: string; props: Record<string, unknown> };
const box = (style: Record<string, unknown>, children: unknown): Node => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

/**
 * The sharing image of a page.
 *
 * @param title The page's title; the home page passes the slogan.
 */
export async function sharingImage(title: string): Promise<Uint8Array<ArrayBuffer>> {
	// Satori does not clamp lines, so a long title is cut before it can overflow.
	const heading = title.length > 80 ? `${title.slice(0, 79).trimEnd()}…` : title;
	const svg = await satori(
		box(
			{
				width: '1200px',
				height: '630px',
				padding: '72px 88px',
				gap: '72px',
				alignItems: 'center',
				backgroundColor: light.paper,
				fontFamily: 'Atkinson',
			},
			[
				{ type: 'img', props: { src: mark, width: 150, height: 300 } },
				box({ flexDirection: 'column', gap: '28px', flex: 1 }, [
					box({ fontSize: '40px', fontWeight: 700, color: light.accent }, 'Itinera'),
					box({ fontSize: heading.length > 40 ? '64px' : '80px', fontWeight: 700, lineHeight: 1.1, color: light.ink }, heading),
					box({ fontSize: '30px', color: light['ink-muted'] }, heading === SLOGAN ? 'itinera-dev.org' : SLOGAN),
				]),
			],
		) as Parameters<typeof satori>[0],
		{
			width: 1200,
			height: 630,
			fonts: [
				{ name: 'Atkinson', data: regular, weight: 400, style: 'normal' },
				{ name: 'Atkinson', data: bold, weight: 700, style: 'normal' },
			],
		},
	);
	return new Uint8Array(new Resvg(svg).render().asPng());
}
