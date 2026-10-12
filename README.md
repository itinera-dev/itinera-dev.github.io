# itinera-dev.github.io

Itinera's site: separate process from logic, make agentic code safer. It is published at <https://itinera-dev.github.io/>.

## Reading it locally

```sh
npm ci
npm run dev
```

Then open <http://localhost:4321/>. It needs Node 22.12 or later. The book, under `/book/`, is built by [itinera-dev/book](https://github.com/itinera-dev/book), so its links lead nowhere locally.

## Changing it

Every page is a Markdown file in `content/`. [AGENTS.md](AGENTS.md) says where everything else is and the rules the site keeps.

`npm run verify` is the gate the Pages workflow runs on every pull request and before every deployment. It runs, in order, and stops at the first failure:

1. `npm run check`: Astro's type check.
2. `npm run contrast`: every pair of colours the pages use, read from `src/styles/tokens.css`, against WCAG AA in the light and the dark scheme.
3. `npm run build:strict`: a forced build, ignoring every cache, that also fails when the build printed an error.
4. `npm run pages`: that every page of `content/` was built with its Markdown copy and sharing image, that each has one level 1 heading and a body, that every link within the site leads to something that was built, and that every link into the book or the specification names a page or file listed in `src/data/linked.json`.
5. `npm run a11y`: axe on every page, in both colour schemes, once its diagrams are drawn.
6. `npm run layout`: every page at 360, 390, 768 and 1280 pixels wide, checking that nothing scrolls sideways except code, tables and diagrams, inside their own box.

The last two open the pages in Playwright's Chromium, installed once per machine with `npm run browsers`.

## License

Licensed under either of

- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or <https://www.apache.org/licenses/LICENSE-2.0>)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or <https://opensource.org/licenses/MIT>)

at your option.

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
