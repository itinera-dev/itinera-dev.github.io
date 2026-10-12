---
title: Accessibility
description: What was tested on the Itinera site and book, how, and how to report a problem.
---

# Accessibility

Itinera's site and its book are written to be read with a screen reader, and checked so they stay that way. If something gets in your way, please tell us; how is at the end of this page.

## How the pages are written

- Every page is headings, lists, prose and simple tables, so a screen reader can move through it by heading, list or table.
- Every diagram is drawn from text in your browser, and has a title and a description for a screen reader. The text around it, usually a numbered list, says everything it shows, so nobody needs to see it.
- Code blocks and wide tables scroll inside their own box on a narrow screen, can be reached by keyboard, and are named by their caption or their columns.
- What is planned, or only an illustration, is said in words, not only by its colour.
- The pages follow your system's colour scheme, light or dark, and load no fonts of their own.
- Every page has a [Markdown copy](/accessibility.md), at its address with `.md` added, for tools that read text better than web pages.

## What is checked, and how

Before any change is published, the same checks run on the site and on the book:

1. **Contrast.** Every pair of colours the pages use is checked against WCAG 2.1 AA, in the light and the dark scheme: 4.5 to 1 for text, and 3 to 1 for marks such as the focus ring.
2. **Automated accessibility checks.** Every page is opened in a real browser and checked with axe, against WCAG 2.2 levels A and AA and its best practices, in both colour schemes, once its diagrams are drawn.
3. **Layout.** Every page is opened at 360, 390, 768 and 1280 pixels wide, and fails if anything but a code block, a table or a diagram scrolls sideways.
4. **Links.** Every link and image between the site's own pages must lead somewhere that was built.
5. **Structure.** Every page must have exactly one level 1 heading and a body.

Automated checks find many problems, but not all of them, which is why your reports matter.

## Reporting a problem

If something is hard to use, [open an issue about the site]({{report-site}}) or [about the book]({{report-book}}). Say which page, what you were trying to do, and, if you like, what you use to read it. Problems that keep someone from using the pages are fixed first.
