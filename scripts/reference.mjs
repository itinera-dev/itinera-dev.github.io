// Builds the API references into the built site, as GitHub Pages serves
// them. For each reference of site.config.mjs:
//
// - every release of its repository, at its path followed by the version,
//   such as /api/typescript/0.1.0-beta.1/, from the reference attached to
//   the release, so that a release's edition never changes;
// - the newest release again at its path, such as /api/typescript/;
// - the repository's `next` ref at its path followed by next/, built here
//   with the repository's own `npm run docs`.
//
// It runs after the site's own build, which empties dist/, and before the
// checks, which then check links into the references and a few of their
// pages. It needs the network: GitHub's API, the releases' files and a clone
// of the repository. A token in GITHUB_TOKEN, as the Pages workflow gives it,
// raises GitHub's limit on requests.

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import semver from 'semver';

import { references } from '../site.config.mjs';
import { fileFor } from './serve.mjs';

const headers = {
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28',
	'User-Agent': 'itinera-dev-site',
	...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

/** The answer to a request, or a failure saying what was asked. */
async function fetched(url, init) {
	const response = await fetch(url, init);
	if (!response.ok) throw new Error(`GET ${url} failed with ${response.status} ${response.statusText}.`);
	return response;
}

/** Every release of a repository on GitHub, drafts included, following GitHub's pages. */
async function releasesOf(repository) {
	const releases = [];
	let url = `https://api.github.com/repos/${repository}/releases?per_page=100`;
	while (url) {
		const response = await fetched(url, { headers });
		releases.push(...(await response.json()));
		url = /<([^>]+)>;\s*rel="next"/.exec(response.headers.get('link') ?? '')?.[1];
	}
	return releases;
}

/** The edition a release gives, or undefined, saying why, when it is a draft, names no version or has no reference attached. */
function editionOf(release, asset) {
	const version = release.tag_name.startsWith('v') ? semver.valid(release.tag_name.slice(1)) : null;
	const file = release.assets.find((attached) => attached.name === asset);
	if (release.draft || !version) return undefined;
	if (!file) {
		console.warn(`The release ${release.tag_name} has no ${asset} attached, so it has no edition.`);
		return undefined;
	}
	return { version, url: file.browser_download_url };
}

/** What the commands run in a repository's clone see: this build's environment, without its GitHub token. */
const { GITHUB_TOKEN: _token, ...cloneEnvironment } = process.env;

/** Runs a command, and stops everything when it fails. */
function run(command, args, cwd) {
	const result = spawnSync(command, args, { cwd, env: cloneEnvironment, stdio: 'inherit', shell: process.platform === 'win32' });
	if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed in ${cwd}.`);
}

/** Puts a release's edition in `directory`, from the reference attached to it. */
async function unpack(edition, directory, scratch) {
	const archive = join(scratch, `${edition.version}.tar.gz`);
	writeFileSync(archive, Buffer.from(await (await fetched(edition.url)).arrayBuffer()));
	mkdirSync(directory, { recursive: true });
	run('tar', ['-xzf', archive, '-C', directory], scratch);
}

/** Builds the reference of `reference.next` into `directory`, from a clone of the repository at that ref. */
function buildNext(reference, directory, scratch) {
	const checkout = join(scratch, 'next');
	run('git', ['clone', '--quiet', '--depth', '1', '--branch', reference.next, `https://github.com/${reference.repository}.git`, checkout], scratch);
	run('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], checkout);
	run('npm', ['run', 'docs', '--', '--out', directory, '--name', `${reference.name} next`], checkout);
}

const problems = [];
for (const reference of references) {
	const root = fileFor(reference.path).replace(/index\.html$/, '');
	const scratch = mkdtempSync(join(tmpdir(), 'itinera-reference-'));
	try {
		rmSync(root, { recursive: true, force: true });
		const editions = (await releasesOf(reference.repository))
			.map((release) => editionOf(release, reference.asset))
			.filter((edition) => edition !== undefined)
			.sort((one, other) => semver.rcompare(one.version, other.version));
		for (const edition of editions) await unpack(edition, join(root, edition.version), scratch);
		if (editions.length > 0) cpSync(join(root, editions[0].version), root, { recursive: true });
		buildNext(reference, join(root, 'next'), scratch);

		const built = [...(editions.length > 0 ? [''] : []), ...editions.map((edition) => `${edition.version}/`), 'next/'];
		for (const edition of built) {
			if (!existsSync(fileFor(`${reference.path}${edition}`))) problems.push(`${reference.path}${edition} has no front page.`);
		}
		console.log(
			`\nThe ${reference.language} reference: ${editions.length > 0 ? `latest ${editions[0].version}, ` : 'no release yet, '}${editions.length} release(s), and next from ${reference.next}.`,
		);
	} finally {
		rmSync(scratch, { recursive: true, force: true });
	}
}

if (problems.length > 0) {
	console.error(`\n${problems.length} problem(s) with the API references:\n`);
	for (const problem of problems) console.error(`  ${problem}`);
	process.exit(1);
}
