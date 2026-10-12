import type { APIRoute } from 'astro';

import { schemes } from '../lib/colour.mjs';
import { iconSvg } from '../lib/logo.mjs';

export const GET: APIRoute = () =>
	new Response(iconSvg(schemes.light.accent, schemes.light.paper), { headers: { 'Content-Type': 'image/svg+xml' } });
