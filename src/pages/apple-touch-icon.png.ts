// The icon a phone shows for the site on its home screen. The phone rounds the
// corners itself.

import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';

import { schemes } from '../lib/colour.mjs';
import { iconSvg } from '../lib/logo.mjs';

export const GET: APIRoute = () => {
	const svg = iconSvg(schemes.light.accent, schemes.light.paper, { square: true });
	const png = new Resvg(svg, { fitTo: { mode: 'width', value: 180 } }).render().asPng();
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
