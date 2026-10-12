// Small finishing passes over the rendered HTML.

import type { Element, ElementContent, Root } from 'hast';
import { toString } from 'hast-util-to-string';
import type { VFile } from 'vfile';
import { visit } from 'unist-util-visit';

const hasClass = (node: Element, name: string) => {
	const classes = node.properties.className;
	return Array.isArray(classes) && classes.includes(name);
};

/**
 * Names each code block after its caption.
 *
 * The highlighter makes every `<pre>` focusable, so a keyboard can scroll a
 * wide block at phone width. A focusable element that announces nothing is a
 * dead stop in the tab order, so each one is a group labelled by the caption
 * of the figure it sits in, such as "Pseudo-Rust: an illustration". The role
 * is what lets a screen reader announce that name: on a bare `<pre>`, many
 * ignore it.
 */
export function rehypeListingNames() {
	return (tree: Root) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'figure' || !hasClass(node, 'listing')) return;
			const caption = node.children.find((child): child is Element => child.type === 'element' && child.tagName === 'figcaption');
			const id = caption?.properties.id;
			if (typeof id !== 'string') return;
			// The highlighter may leave its block wrapped in a fragment, so the
			// `<pre>` is looked for anywhere inside the figure.
			visit(node, 'element', (inner) => {
				if (inner.tagName !== 'pre') return;
				inner.properties.role = 'group';
				inner.properties.ariaLabelledBy = [id];
			});
		});
	};
}

/**
 * Puts each Mermaid diagram in a figure captioned with its title, to be drawn
 * in the reader's browser, as GitHub draws one.
 *
 * The diagram's source stays in the page, so a reader without JavaScript still
 * reads it as text; `src/scripts/diagrams.ts` draws it in its place. Its
 * `accTitle` is made into the figure's visible caption, which also names the
 * drawing, and its `accDescr` describes the drawing. A diagram without either
 * fails the build. The text after each diagram on the page still says
 * everything it shows.
 *
 * Each diagram sits in a box of its own. A wide one, such as two pictures side
 * by side, keeps a size its words can be read at and scrolls inside that box
 * on a narrow screen; the script then makes the box a focusable group named by
 * the caption, as a table's is.
 */
export function rehypeDiagrams() {
	return (tree: Root, file: VFile) => {
		let diagrams = 0;
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'pre' || !parent || index === undefined) return;
			const code = node.children.find((child): child is Element => child.type === 'element' && child.tagName === 'code');
			if (!code || !hasClass(code, 'language-mermaid')) return;
			const source = toString(code).replace(/\n+$/, '');
			const title = /^[ \t]*accTitle[ \t]*:[ \t]*(\S.*?)[ \t]*$/m.exec(source)?.[1];
			if (title === undefined || !/^[ \t]*accDescr[ \t]*(:[ \t]*\S|\{\s*[^\s}])/m.test(source)) {
				const where = `content/${file.data.contentPath ?? 'a page'}, line ${node.position?.start.line ?? '?'}`;
				throw new Error(`${where}: a diagram needs an accTitle and an accDescr, which name and describe it for a screen reader.`);
			}
			diagrams += 1;
			const caption = `diagram-${diagrams}`;
			const figure: Element = {
				type: 'element',
				tagName: 'figure',
				properties: { className: ['diagram'] },
				children: [
					{
						type: 'element',
						tagName: 'div',
						properties: { className: ['diagram__scroll'] },
						children: [
							{
								type: 'element',
								tagName: 'pre',
								properties: { className: ['diagram__source'] },
								children: [{ type: 'text', value: source }],
							},
						],
					},
					{
						type: 'element',
						tagName: 'figcaption',
						properties: { id: caption, className: ['diagram__caption'] },
						children: [{ type: 'text', value: `Diagram: ${title}` }],
					},
				],
			};
			parent.children[index] = figure;
			return index + 1;
		});
	};
}

/**
 * Lets a wide table scroll inside its own box at phone width.
 *
 * The table keeps its own display, so screen readers still treat it as a
 * table; the box around it scrolls instead. A box that scrolls must be
 * reachable by keyboard, and a stop in the tab order must say what it is, so
 * the box is a focusable group named after the table's column headings.
 */
export function rehypeTables() {
	return (tree: Root) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'table' || !parent || index === undefined) return;
			const headings: string[] = [];
			visit(node, 'element', (cell) => {
				if (cell.tagName === 'th') headings.push(toString(cell).trim());
			});
			parent.children[index] = {
				type: 'element',
				tagName: 'div',
				properties: {
					className: ['table-scroll'],
					role: 'group',
					tabIndex: 0,
					ariaLabel: headings.length > 0 ? `Table: ${headings.join(', ')}` : 'Table',
				},
				children: [node],
			};
			return index + 1;
		});
	};
}

const element = (tagName: string, properties: Element['properties'], children: Element['children']): Element => ({
	type: 'element',
	tagName,
	properties,
	children,
});

/**
 * Puts each code block in a figure with a caption saying what it is.
 *
 * The only code on the site is Rust, and every Rust block is pseudo-Rust: an illustration of the idea,
 * lighter than real code, which no compiler checked. Its caption says so, with
 * the amber marker the site keeps for what the reader cannot take as shown,
 * and links to the book, where every program is real and compiled. A code
 * block in any other language fails the build. Runs before the highlighter,
 * which then colours the block inside the figure.
 */
export function rehypeListings(options: { book: string }) {
	return (tree: Root, file: VFile) => {
		let listings = 0;
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'pre' || !parent || index === undefined) return;
			const code = node.children.find((child): child is Element => child.type === 'element' && child.tagName === 'code');
			if (!code || hasClass(code, 'language-mermaid')) return;
			listings += 1;
			const id = `listing-${listings}`;
			if (!hasClass(code, 'language-rust')) {
				throw new Error(
					`content/${file.data.contentPath ?? 'a page'}, line ${node.position?.start.line ?? '?'}: a code block on the site is pseudo-Rust, fenced as \`rust\`, or a Mermaid diagram.`,
				);
			}
			const caption: Element['children'] = [
				element('span', { className: ['marker'] }, [{ type: 'text', value: 'Pseudo-Rust' }]),
				{ type: 'text', value: ' An illustration, not a program. ' },
				element('a', { href: options.book }, [{ type: 'text', value: 'Real, compiled code is in the book' }]),
				{ type: 'text', value: '.' },
			];
			parent.children[index] = element('figure', { className: ['listing', 'listing--pseudo'] }, [
				element('figcaption', { id, className: ['listing__caption'] }, caption),
				node,
			]);
			return index + 1;
		});
	};
}

/**
 * Marks a table cell that says only "Planned" with the amber marker, so what is
 * not there yet stands out from what is, by its words first and its colour too.
 */
export function rehypePlanned() {
	return (tree: Root) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'td' || toString(node).trim() !== 'Planned') return;
			node.children = [element('span', { className: ['marker'] }, [{ type: 'text', value: 'Planned' }])];
		});
	};
}

/** Whether a node is a heading of the given level. */
const isHeading = (node: Root['children'][number], level: number): node is Element =>
	node.type === 'element' && node.tagName === `h${level}`;

/**
 * Groups the children of `parent` into sections, one per heading of `level`:
 * each section holds its heading and everything up to the next. What comes
 * before the first heading is left as it is and returned apart.
 */
function sectionsOf(children: Root['children'], level: number) {
	const before: Root['children'] = [];
	const sections: Element[] = [];
	for (const child of children) {
		if (isHeading(child, level)) {
			const id = typeof child.properties.id === 'string' ? child.properties.id : undefined;
			// No accessible name: a named section is a landmark, and a dozen of
			// them would crowd the landmarks a screen reader lists. The headings
			// already let a reader move from section to section.
			sections.push(element('section', { className: ['section', ...(id ? [`section--${id}`] : [])] }, [child]));
		} else if (sections.length > 0 && child.type !== 'doctype') {
			sections[sections.length - 1].children.push(child);
		} else {
			before.push(child);
		}
	}
	return { before, sections };
}

/**
 * Lays a landing page out in sections: what comes before the first level 2
 * heading is the hero, in a header of its own, and each level 2 heading opens
 * a section named by it, so the page can give each its own band. In the
 * section named `answers`, the first two level 3 headings each open an
 * answer, and the answers sit side by side on a wide screen; what follows
 * them stays as it is. Runs after the headings have
 * their ids.
 */
export function rehypeLanding(options: { answers: string }) {
	return (tree: Root) => {
		const { before, sections } = sectionsOf(tree.children, 2);
		for (const section of sections) {
			if (!section.properties.className || !(section.properties.className as string[]).includes(`section--${options.answers}`)) continue;
			const [heading, ...rest] = section.children;
			const inner = sectionsOf(rest as Root['children'], 3);
			const answers = inner.sections.slice(0, 2).map((answer) => ({ ...answer, properties: { ...answer.properties, className: ['answer'] } }));
			section.children = [
				heading,
				...(inner.before as ElementContent[]),
				element('div', { className: ['answers'] }, answers),
				...inner.sections.slice(2).flatMap((after) => after.children),
			];
		}
		tree.children = [element('header', { className: ['hero'] }, before as ElementContent[]), ...sections];
	};
}

/**
 * Shows an image of the logo in the form made for the reader's colour scheme.
 *
 * An image of a form that has a dark twin, such as `/brand/itinera-logo.svg`
 * and `/brand/itinera-logo-dark.svg`, becomes a picture that shows the dark
 * twin in the dark scheme, since the light form's name would vanish there.
 */
export function rehypeSchemePictures(options: { dark: ReadonlySet<string> }) {
	return (tree: Root) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'img' || !parent || index === undefined || parent.type !== 'element' || parent.tagName === 'picture') return;
			const src = String(node.properties.src ?? '');
			const dark = src.replace(/\.svg$/, '-dark.svg');
			if (!src.endsWith('.svg') || !options.dark.has(dark)) return;
			parent.children[index] = element('picture', {}, [element('source', { srcSet: dark, media: '(prefers-color-scheme: dark)' }, []), node]);
			return index + 1;
		});
	};
}
