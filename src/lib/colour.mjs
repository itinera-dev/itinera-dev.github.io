// @ts-check
// The site's colours, read from src/styles/tokens.css, and the WCAG contrast
// arithmetic. The contrast check and the Brand page both use it, so the ratios
// the Brand page states are the ones the check asserted.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const AA_TEXT = 4.5;
export const AA_NON_TEXT = 3;

// Resolved from the project's root, not from this file: a build bundles this
// module somewhere else, where a relative path would point nowhere.
const css = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8');

/**
 * The `--name: #hex;` declarations of one block of the file.
 *
 * @param {string} block
 * @returns {Record<string, string>}
 */
function tokens(block) {
	return Object.fromEntries([...block.matchAll(/--([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(([, name, value]) => [name, value]));
}

const dark = css.indexOf('@media (prefers-color-scheme: dark)');
if (dark === -1) throw new Error('tokens.css has no dark scheme.');

/** Each scheme's colours, by token name without the dashes. */
export const schemes = { light: tokens(css.slice(0, dark)), dark: tokens(css.slice(dark)) };

/** @param {number} value */
const channel = (value) => {
	const c = value / 255;
	return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** @param {string} hex */
const luminance = (hex) => {
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/**
 * The contrast ratio of two colours, from 1 to 21.
 *
 * @param {string} a
 * @param {string} b
 */
export const ratio = (a, b) => {
	const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (lighter + 0.05) / (darker + 0.05);
};
