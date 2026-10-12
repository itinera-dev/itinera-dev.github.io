# AGENTS.md: working in itinera-dev/itinera-dev.github.io

The operating manual for anyone, human or agent, working in this repository. It is self-contained: reading only this file is enough to work here safely.

## What this repository is

Itinera's site, published at <https://itinera-dev.github.io/>. It tells Itinera's story and sends each visitor to the right place next: the book teaches, the specification defines, and the site tells the story and links. The book is a site of its own, [itinera-dev/book](https://github.com/itinera-dev/book), served under `/book/`.

The site owns Itinera's message, brand and design. The book takes its colours and framing from here, never the other way round.

## Where things are

- `content/` holds every page as Markdown, one file per page, with a front matter block giving its `title` and `description`. `content/index.md` is the home page; `content/news/` holds the posts, each with a `date`. A page's Markdown is its single source: the HTML page and the Markdown copy for agents, at the page's address with `.md` added, are both made from it.
- `site.config.mjs` holds the facts a page names as `{{name}}`, such as the specification's version and the git refs links point at. `src/data/languages.json` holds each language's version, tier and links. Pages include tables made from them as `<!-- include: name -->`; `src/lib/includes.ts` lists what can be included.
- `src/lib/message.ts` holds the slogan, the vision and the mission. `src/lib/logo.mjs` draws every form of the logo. `src/styles/tokens.css` holds the colours.
- `src/lib/render.ts` turns a page's Markdown into HTML; `src/pages/` makes the pages, the Markdown copies, `/llms.txt`, the news feed, the sharing images and the icons.
- `src/data/linked.json` lists the book's pages and the specification's files, so the link check can verify links into them. Refresh it when either moves.
- `scripts/` holds the checks that `npm run verify` runs.

## Rules the site keeps

1. **Nothing is taught twice.** The site tells the story and links. Concepts are taught in the book, behaviour is defined in the [specification](https://github.com/itinera-dev/spec), and each item is documented in its language's API reference.
2. **Facts come from one place.** Versions, tiers, capabilities and git refs come from `site.config.mjs` and `src/data/languages.json`, which follow each language's release and its `conformance.json`. They are never typed into a page's prose.
3. **Never ahead of the specification.** The site describes only what the specification defines and what a release ships. Anything planned says "planned".
4. **Rust on the site is pseudo-Rust.** It is an illustration, labelled as such on the page and in the Markdown copy, with a link to the book, where every program is real and compiled. Every Rust block is labelled; write no other kind of code block.
5. **Stable addresses.** A page, once published, never moves without a redirect.
6. **Small.** A handful of pages a maintainer can keep true without effort.

## Vocabulary

Use the words defined in chapter 1 of the specification, [01-concepts.md](https://github.com/itinera-dev/spec/blob/main/spec/01-concepts.md), exactly as defined there; they are not synonyms of each other. The slogan's "process" and "logic" are the only exception, and only in the slogan and the story around it.

## Hard rules

1. **Screen-reader friendly writing.** Headings, lists, prose and simple tables. Diagrams are Mermaid diagrams in fenced `mermaid` blocks, drawn in the reader's browser; each declares `accTitle` and `accDescr` and is followed by text, usually a numbered list, that says everything it shows. No ASCII-art diagrams, no arrows drawn with characters, no box-drawing trees.
2. **British spelling,** in a plain and warm voice.
3. **No code in workflow YAML.** Automation is Python, standard library only, in [itinera-dev/actions](https://github.com/itinera-dev/actions), with tests; a workflow only declares triggers and permissions and calls actions at pinned versions, and runs the scripts of `package.json`. The full rule is the "Automation" section of the [contributing guide](https://github.com/itinera-dev/.github/blob/main/CONTRIBUTING.md#automation).
4. **Every change passes `npm run verify`** before it is pushed: the type check, the contrast check, a forced build, the check of every page, link, Markdown copy and sharing image, axe on every page in both colour schemes, and the layout check from 360 to 1280 pixels wide. The Pages workflow runs it on every pull request and before every deployment, and deploys only from `main`.

## Commits and pull requests

- Commit messages and pull request descriptions say what changed and why, in plain prose.
- Every change an agent makes is reviewed by a separate reviewer agent before it is pushed.

## Working with the maintainer

- Start every reply with a heading.
- When a design decision is open, present one decision at a time, with a recommendation, and wait for the answer.
