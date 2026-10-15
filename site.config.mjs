// @ts-check
// What the site says about the world outside it, read in one place.
//
// The pages never type a version, a tag or an address of another repository
// into their prose. They name a fact as {{name}} and the build puts its value
// in, from here or from src/data/languages.json, so a release changes one line
// instead of every page that mentions it.

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

/** The site's origin. GitHub serves this repository at the root of it. */
export const site = 'https://itinera-dev.org';

/** This repository on GitHub. */
export const repository = 'https://github.com/itinera-dev/itinera-dev.github.io';

/** The organisation on GitHub. */
export const organisation = 'https://github.com/itinera-dev';

/** Who maintains Itinera, named in every page's footer and in llms.txt, each linked to their own site. */
export const maintainers = [{ name: 'Marlon Sousa', url: 'https://marlon-sousa.com/' }];

/**
 * The address the book is served under. The book is its own site, built and
 * published by itinera-dev/book, so the checks of this one never look inside it.
 */
export const book = '/book/';

/** The directory holding every page's Markdown. */
export const contentDirectory = resolve(process.cwd(), 'content');

/**
 * The facts a page may name as {{name}}.
 *
 * `spec-version` is the version the specification's chapters declare.
 * `spec-ref` is the git ref links into the specification point at. The
 * specification has no release tag yet, so it is `main`; once it is tagged,
 * the tag goes here and every link follows.
 */
export const facts = {
	'spec-version': '0.1.0',
	'spec-ref': 'main',
	'conformance-ref': 'v0.1.0-rc.15',
	spec: 'https://github.com/itinera-dev/spec',
	conformance: 'https://github.com/itinera-dev/conformance',
	actions: 'https://github.com/itinera-dev/actions',
	contributing: 'https://github.com/itinera-dev/.github/blob/main/CONTRIBUTING.md',
	manifesto: 'https://marlon-sousa.com/blog/manifesto/',
	'propose': 'https://github.com/itinera-dev/spec/issues/new/choose',
	'report-site': 'https://github.com/itinera-dev/itinera-dev.github.io/issues/new',
	'report-book': 'https://github.com/itinera-dev/book/issues/new',
	repository,
	organisation,
};

/** The commit this build is made from, and the day it was made, for the footer. */
function provenance() {
	const fromGit = () => {
		try {
			return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
		} catch {
			return '';
		}
	};
	const commit = process.env.GITHUB_SHA || fromGit();
	return { commit, date: new Date().toISOString().slice(0, 10) };
}

export const built = provenance();
