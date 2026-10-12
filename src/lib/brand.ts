// Every form of the logo the Brand page offers to download.

import { schemes } from './colour.mjs';
import { iconSvg, logoSvg, markSvg } from './logo.mjs';

export interface BrandFile {
	/** The file's name without `.svg`. */
	name: string;
	/** What it is, and where it is for. */
	label: string;
	svg: () => string;
}

const { light, dark } = schemes;

export const BRAND_FILES: BrandFile[] = [
	{ name: 'itinera-logo', label: 'The full logo, the mark and the name, for light backgrounds', svg: () => logoSvg(light.accent, light.ink) },
	{ name: 'itinera-logo-dark', label: 'The full logo, for dark backgrounds', svg: () => logoSvg(dark.accent, dark.ink) },
	{ name: 'itinera-mark', label: 'The mark alone, for light backgrounds', svg: () => markSvg(light.accent) },
	{ name: 'itinera-mark-dark', label: 'The mark alone, for dark backgrounds', svg: () => markSvg(dark.accent) },
	{ name: 'itinera-mark-mono', label: 'The mark in black, for one-colour printing', svg: () => markSvg('#000000') },
	{ name: 'itinera-icon', label: 'The icon, the mark on a green square, as in a browser tab', svg: () => iconSvg(light.accent, light.paper) },
];
