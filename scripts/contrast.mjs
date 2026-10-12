// Checks every pair of colours the pages use against WCAG 2.1 AA, in both
// colour schemes, reading the colours from src/styles/tokens.css so the check
// and the site cannot drift apart. Contrast is arithmetic: it is asserted here,
// not judged by eye.
//
// The highlighted code is not in this list: its colours come from the
// highlighter's themes, and the axe sweep checks them on the built pages.

import { readFileSync } from 'node:fs';

import { AA_NON_TEXT, AA_TEXT, ratio, schemes } from '../src/lib/colour.mjs';

const layout = readFileSync(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8');

// [what, foreground, background, threshold]
const CHECKS = [
	['body text on the page', 'ink-body', 'paper', AA_TEXT],
	['headings on the page', 'ink', 'paper', AA_TEXT],
	['muted text (captions, labels) on the page', 'ink-muted', 'paper', AA_TEXT],
	['muted text on a raised panel', 'ink-muted', 'paper-raised', AA_TEXT],
	['body text on a raised panel', 'ink-body', 'paper-raised', AA_TEXT],
	['links on the page', 'accent', 'paper', AA_TEXT],
	['links on a raised panel', 'accent', 'paper-raised', AA_TEXT],
	['link hover on the page', 'accent-strong', 'paper', AA_TEXT],
	['inline code', 'ink-body', 'paper-raised', AA_TEXT],
	['the main call to action (page colour on the accent)', 'paper', 'accent-strong', AA_TEXT],
	['the "planned" and "pseudo-Rust" markers', 'caution-ink', 'caution-paper', AA_TEXT],
	['skip link', 'accent-strong', 'paper', AA_TEXT],
	['focus ring against the page', 'accent-strong', 'paper', AA_NON_TEXT],
	['focus ring against a code block', 'accent-strong', 'code-paper', AA_NON_TEXT],
	['the logo against the page', 'accent', 'paper', AA_NON_TEXT],
	['outlined links against the page', 'rule-strong', 'paper', AA_NON_TEXT],
];

let failures = 0;
for (const [scheme, colours] of Object.entries(schemes)) {
	console.log(`\n${scheme} scheme`);
	for (const [what, fg, bg, threshold] of CHECKS) {
		if (!colours[fg] || !colours[bg]) {
			failures += 1;
			console.log(`  FAIL  --${colours[fg] ? bg : fg} is not defined  ${what}`);
			continue;
		}
		const value = ratio(colours[fg], colours[bg]);
		const ok = value >= threshold;
		if (!ok) failures += 1;
		console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${value.toFixed(2)}:1 (needs ${threshold}:1)  ${what}`);
	}
}

// The browser's own furniture is painted in the page colour each scheme names
// in the layout's theme-color, which must be the page colour of tokens.css.
console.log('\ntheme-color');
for (const [scheme, colours] of Object.entries(schemes)) {
	const declared = new RegExp(`name="theme-color" content="(#[0-9a-f]{6})" media="\\(prefers-color-scheme: ${scheme}\\)"`, 'i').exec(layout)?.[1];
	const ok = declared?.toLowerCase() === colours.paper?.toLowerCase();
	if (!ok) failures += 1;
	console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${scheme}: Base.astro says ${declared ?? 'nothing'}, tokens.css says ${colours.paper}`);
}

console.log(failures === 0 ? '\nAll contrast checks passed.' : `\n${failures} contrast check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
