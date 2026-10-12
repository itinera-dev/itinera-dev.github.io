// The logo's downloads on the Brand page: every form of it, as SVG.

import type { APIRoute, GetStaticPaths } from 'astro';

import { BRAND_FILES } from '../../lib/brand.ts';

export const getStaticPaths = (() => BRAND_FILES.map((file) => ({ params: { file: file.name }, props: { svg: file.svg() } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => new Response((props as { svg: string }).svg, { headers: { 'Content-Type': 'image/svg+xml' } });
